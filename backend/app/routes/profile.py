from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from database.db import get_db
from database.models.user import User
from database.models.user_profile import UserProfile

router = APIRouter()


class ProfilePayload(BaseModel):
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=100)
    sex: str | None = Field(default=None, max_length=10)
    date_of_birth: date | None = None
    country: str | None = Field(default=None, max_length=100)
    profile_image: str | None = None


class ProfileSetupPayload(ProfilePayload):
    email: str


def _clean(value: str | None) -> str | None:
    if value is None:
        return None
    stripped = value.strip()
    return stripped if stripped else None


def _validate_sex(sex: str | None) -> str | None:
    if sex is None:
        return None
    normalized = sex.strip().lower()
    if normalized not in {"male", "female"}:
        raise HTTPException(status_code=400, detail="Sex must be 'male' or 'female'.")
    return normalized


def _get_or_create_profile(db: Session, user_id: int) -> UserProfile:
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        profile = UserProfile(user_id=user_id)
        db.add(profile)
        db.flush()
    return profile


def _apply_profile_payload(profile: UserProfile, payload: ProfilePayload):
    profile.first_name = _clean(payload.first_name)
    profile.last_name = _clean(payload.last_name)
    profile.bio = _clean(payload.bio)
    profile.sex = _validate_sex(payload.sex)
    profile.date_of_birth = payload.date_of_birth
    profile.country = _clean(payload.country)
    profile.profile_image = _clean(payload.profile_image)


def _serialize_profile(email: str, profile: UserProfile | None) -> dict:
    return {
        "email": email,
        "first_name": profile.first_name if profile else None,
        "last_name": profile.last_name if profile else None,
        "bio": profile.bio if profile else None,
        "sex": profile.sex if profile else None,
        "date_of_birth": profile.date_of_birth.isoformat() if profile and profile.date_of_birth else None,
        "country": profile.country if profile else None,
        "profile_image": profile.profile_image if profile else None,
    }


@router.post("/profile/setup")
def setup_profile(payload: ProfileSetupPayload, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.strip()).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found for this email.")

    profile = _get_or_create_profile(db, user.id)
    _apply_profile_payload(profile, payload)
    db.commit()
    db.refresh(profile)
    return {"message": "Profile setup saved.", "profile": _serialize_profile(user.email, profile)}


@router.get("/profile/me")
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    return _serialize_profile(current_user.email, profile)


@router.put("/profile/me")
def update_my_profile(
    payload: ProfilePayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = _get_or_create_profile(db, current_user.id)
    _apply_profile_payload(profile, payload)
    db.commit()
    db.refresh(profile)
    return {"message": "Profile updated.", "profile": _serialize_profile(current_user.email, profile)}
