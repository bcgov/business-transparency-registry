"""empty message

Revision ID: 877c0b71efb6
Revises: 552ee76a1331
Create Date: 2024-08-14 15:20:39.210182

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '877c0b71efb6'
down_revision = '0a5356f460a4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('submission', schema=None) as batch_op:
        batch_op.add_column(sa.Column('previous_payload', postgresql.JSONB(astext_type=sa.Text()), nullable=True))

    with op.batch_alter_table('submission_history', schema=None) as batch_op:
        batch_op.add_column(sa.Column('previous_payload', postgresql.JSONB(astext_type=sa.Text()), autoincrement=False, nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('submission_history', schema=None) as batch_op:
        batch_op.drop_column('previous_payload')

    with op.batch_alter_table('submission', schema=None) as batch_op:
        batch_op.drop_column('previous_payload')

    # ### end Alembic commands ###
