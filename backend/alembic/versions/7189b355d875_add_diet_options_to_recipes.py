"""add_diet_options_to_recipes

Revision ID: 7189b355d875
Revises: 003
Create Date: 2026-01-24 20:18:50.889104

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7189b355d875'
down_revision: Union[str, None] = '003'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add diet option columns to recipes table
    op.add_column('recipes', sa.Column('is_vegetarian', sa.Boolean(), nullable=False, server_default='0'))
    op.add_column('recipes', sa.Column('is_vegan', sa.Boolean(), nullable=False, server_default='0'))


def downgrade() -> None:
    # Remove diet option columns from recipes table
    op.drop_column('recipes', 'is_vegan')
    op.drop_column('recipes', 'is_vegetarian')
