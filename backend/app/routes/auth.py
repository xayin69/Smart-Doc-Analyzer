import os
import random
import string
from backend.app.core.dependencies import get_current_user
from fastapi import Response
from datetime import datetime, timedelta
from urllib.parse import quote_plus
from fastapi.security import OAuth2PasswordRequestForm

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from database.db import get_db
from database.models.user import User
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.utils.email import send_email

import secrets
from fastapi import Form, Request

from database.repositories.password_reset_repo import (
    create_reset_token,
    get_valid_token,
    mark_token_used
)

from database.repositories.user_repo import (
    get_user_by_email,
    update_user_password
)

router = APIRouter()
EXPOSE_VERIFICATION_CODE = os.getenv("EXPOSE_VERIFICATION_CODE", "false").lower() == "true"

@router.post("/register")
async def register(email: str, password: str, db: Session = Depends(get_db)):
    # 1️⃣ INPUT VALIDATION (Add it here)
    if len(password) > 64:
        raise HTTPException(status_code=400, detail="Password too long (max 64 characters)")

    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    # 2️⃣ DATABASE CHECKS
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 3️⃣ LOGIC & SAVING
    verification_token = ''.join(random.choices(string.digits, k=6))

    user = User(
        email=email,
        hashed_password=hash_password(password),
        verification_token=verification_token,
        verification_expires_at=datetime.utcnow() + timedelta(minutes=10),
        is_verified=False
    )

    db.add(user)
    verification_link = (
        f"http://localhost:8000/verify-email?email={quote_plus(user.email)}&code={verification_token}"
    )

    try:
        db.flush()
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not create user account") from exc

    try:
        await send_email(
            to_email=user.email,
            subject="Verify Your Account",
            body=f"Click the link to verify your account:\n{verification_link}",
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=502,
            detail="Could not send verification email. Please try again in later.",
        ) from exc

    try:
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Could not save user account") from exc

    response = {"message": "User registered. Verify your email."}
    if EXPOSE_VERIFICATION_CODE:
        response["verification_code_for_testing"] = verification_token
    return response

def _verify_user_email(email: str, code: str, db: Session) -> None:
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.verification_token != code:
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if user.verification_expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Verification code expired")

    user.is_verified = True
    user.verification_token = None

    db.commit()


@router.get("/verify-email", response_class=HTMLResponse)
def verify_email_link(email: str, code: str, db: Session = Depends(get_db)):
    _verify_user_email(email=email, code=code, db=db)
    frontend_base = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")
    return RedirectResponse(
        url=f"{frontend_base}/profile-setup?email={quote_plus(email)}",
        status_code=302,
    )


@router.post("/verify-email")
def verify_email(email: str, code: str, db: Session = Depends(get_db)):
    _verify_user_email(email=email, code=code, db=db)

    return {"message": "Email verified successfully"}


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    response: Response = None
 ):

    user = db.query(User).filter(User.email == form_data.username).first()
    

    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token = create_access_token({"sub": str(user.id)})

    response.set_cookie(
    key="access_token",
    value=access_token,
    httponly=True,
    secure=False,  # True in production (HTTPS)
    samesite="lax",
    max_age=60 * 60 * 24  # 1 day
)

    return {"message": "Login successful"}


@router.get("/me")
def get_me(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_verified": current_user.is_verified,
    }


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}



@router.post("/forgot-password")
async def forgot_password(
    email: str,
    db: Session = Depends(get_db)
):
    """
    Always return generic success message.
    Do NOT reveal if email exists.
    """

    user = get_user_by_email(db, email)

    if user:
        token = secrets.token_urlsafe(32)
        expires_at = datetime.utcnow() + timedelta(minutes=30)

        create_reset_token(
            db=db,
            user_id=user.id,
            token=token,
            expires_at=expires_at
        )

        reset_link = f"http://localhost:8000/reset-password?token={token}"

        await send_email(
            to_email=user.email,
            subject="Password Reset",
            body=f"""
            Click the link below to reset your password:
            {reset_link}

            This link expires in 30 minutes.
            """
        )

    return {
        "message": "If the email exists, a reset link has been sent."
    }



@router.get("/reset-password", response_class=HTMLResponse)
def reset_password_form(
    token: str,
    db: Session = Depends(get_db)
):
    reset_token = get_valid_token(db, token)

    if not reset_token:
        return HTMLResponse("<h3>Invalid or expired reset link.</h3>")

    return HTMLResponse(f"""
        <html>
            <body>
                <h2>Reset Password</h2>
                <form method="post" action="/reset-password">
                    <input type="hidden" name="token" value="{token}" />
                    <input type="password" name="new_password" placeholder="New Password" required />
                    <button type="submit">Reset Password</button>
                </form>
            </body>
        </html>
    """)



@router.post("/reset-password", response_class=HTMLResponse)
def reset_password(
    token: str = Form(...),
    new_password: str = Form(...),
    db: Session = Depends(get_db)
):
    reset_token = get_valid_token(db, token)

    if not reset_token:
        return HTMLResponse("<h3>Invalid or expired reset link.</h3>")

    user = reset_token.user

    new_hashed = hash_password(new_password)

    update_user_password(
        db=db,
        user=user,
        new_hashed_password=new_hashed
    )

    mark_token_used(db, reset_token)

    return HTMLResponse("<h3>Password successfully reset.</h3>")


