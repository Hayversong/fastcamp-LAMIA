from fast_zero.models import User


def test_create_user():
    user = User(username='hay', email='hay@email.com', password='senha-123')

    assert user.username == 'hay'
