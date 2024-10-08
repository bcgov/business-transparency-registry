"""empty message

Revision ID: 4aaab6597068
Revises: 8d8279a86def
Create Date: 2024-10-07 14:12:40.894440

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4aaab6597068'
down_revision = '8d8279a86def'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('request',
    sa.Column('id', sa.Uuid(), nullable=False),
    sa.Column('full_name', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('birthdate', sa.Date(), nullable=False),
    sa.Column('business_identifier', sa.String(), nullable=False),
    sa.Column('information_to_omit', sa.Enum('ALL', 'FULL_NAME', 'BIRTH_YEAR', 'CITIZENSHIP_PR', name='informationtoomittype'), nullable=False),
    sa.Column('individual_at_risk', sa.Enum('SI', 'HOUSEHOLD', name='individualatrisk'), nullable=False),
    sa.Column('reasons', sa.String(), nullable=False),
    sa.Column('completing_party', sa.Enum('SI', 'REPRESENTATIVE', name='completingparty'), nullable=False),
    sa.Column('completing_name', sa.String(), nullable=False),
    sa.Column('completing_email', sa.String(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.Column('version', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sqlite_autoincrement=True
    )
    with op.batch_alter_table('request', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_request_business_identifier'), ['business_identifier'], unique=False)

    op.create_table('request_history',
    sa.Column('id', sa.Uuid(), autoincrement=False, nullable=False),
    sa.Column('full_name', sa.String(), autoincrement=False, nullable=False),
    sa.Column('email', sa.String(), autoincrement=False, nullable=False),
    sa.Column('birthdate', sa.Date(), autoincrement=False, nullable=False),
    sa.Column('business_identifier', sa.String(), autoincrement=False, nullable=False),
    sa.Column('information_to_omit', sa.Enum('ALL', 'FULL_NAME', 'BIRTH_YEAR', 'CITIZENSHIP_PR', name='informationtoomittype'), autoincrement=False, nullable=False),
    sa.Column('individual_at_risk', sa.Enum('SI', 'HOUSEHOLD', name='individualatrisk'), autoincrement=False, nullable=False),
    sa.Column('reasons', sa.String(), autoincrement=False, nullable=False),
    sa.Column('completing_party', sa.Enum('SI', 'REPRESENTATIVE', name='completingparty'), autoincrement=False, nullable=False),
    sa.Column('completing_name', sa.String(), autoincrement=False, nullable=False),
    sa.Column('completing_email', sa.String(), autoincrement=False, nullable=False),
    sa.Column('created_at', sa.DateTime(), autoincrement=False, nullable=False),
    sa.Column('updated_at', sa.DateTime(), autoincrement=False, nullable=False),
    sa.Column('version', sa.Integer(), autoincrement=False, nullable=False),
    sa.Column('changed', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id', 'version'),
    sqlite_autoincrement=True
    )
    with op.batch_alter_table('request_history', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_request_history_business_identifier'), ['business_identifier'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('request_history', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_request_history_business_identifier'))

    op.drop_table('request_history')
    with op.batch_alter_table('request', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_request_business_identifier'))

    op.drop_table('request')
    # ### end Alembic commands ###