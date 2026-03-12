from sqlalchemy.orm import Session
from datetime import datetime
from database.models.password_reset_token import PasswordResetToken


def create_reset_token(
    db: Session,
    user_id: int,
    token: str,
    expires_at
) -> PasswordResetToken:

    reset_token = PasswordResetToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )

    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)

    return reset_token


def get_valid_token(
    db: Session,
    token: str
) -> PasswordResetToken | None:

    return (
        db.query(PasswordResetToken)
        .filter(
            PasswordResetToken.token == token,
            PasswordResetToken.used == False,
            PasswordResetToken.expires_at > datetime.utcnow()
        )
        .first()
    )


def mark_token_used(
    db: Session,
    reset_token: PasswordResetToken
):
    reset_token.used = True
    db.commit()
