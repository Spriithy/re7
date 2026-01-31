"""add_user_profile_fields

Revision ID: 004
Revises: 003
Create Date: 2026-01-25 10:44:52.562905

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add profile fields to users table
    op.add_column('users', sa.Column('full_name', sa.String(100), nullable=True))
    op.add_column('users', sa.Column('avatar_url', sa.String(500), nullable=True))


def downgrade() -> None:
    # Remove profile fields from users table
    op.drop_column('users', 'avatar_url')
    op.drop_column('users', 'full_name')
