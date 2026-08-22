from sqlalchemy import select

from fast_zero.models import User


def test_create_user(session):
    user = User(username='hay', email='hay@email.com', password='senha-123')

    session.add(user)
    session.commit()

    result = session.scalar(select(User).where(User.email == 'hay@email.com'))

    assert result.username == 'hay'
