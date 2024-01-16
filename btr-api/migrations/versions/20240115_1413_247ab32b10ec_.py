"""empty message

Revision ID: 247ab32b10ec
Revises: f586cb178aff
Create Date: 2024-01-15 14:13:52.835673

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '247ab32b10ec'
down_revision = 'f586cb178aff'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('submission', schema=None) as batch_op:
        batch_op.add_column(sa.Column('submitted_datetime', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True))

    with op.batch_alter_table('submission_history', schema=None) as batch_op:
        batch_op.add_column(sa.Column('submitted_datetime', sa.DateTime(timezone=True), autoincrement=False, nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('submission_history', schema=None) as batch_op:
        batch_op.drop_column('submitted_datetime')

    with op.batch_alter_table('submission', schema=None) as batch_op:
        batch_op.drop_column('submitted_datetime')

    # ### end Alembic commands ###
