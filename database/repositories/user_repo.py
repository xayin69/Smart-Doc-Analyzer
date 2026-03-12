from sqlalchemy.orm import Session
from database.models.user import User


def create_user(
    db: Session,
    email: str,
    hashed_password: str
) -> User:
    """
    Create a new user.
    Password MUST already be hashed.
    """

    user = User(
        email=email,
        hashed_password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_user_by_email(
    db: Session,
    email: str
) -> User | None:
    """
    Find user by email.
    """

    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_id(
    db: Session,
    user_id: int
) -> User | None:
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

def update_user_password(
    db: Session,
    user: User,
    new_hashed_password: str
):
    user.hashed_password = new_hashed_password
    db.commit()
    db.refresh(user)
    return user
