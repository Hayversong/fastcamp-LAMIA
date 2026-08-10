from http import HTTPStatus


def test_root_deve_retornar_ok_e_ola_mundo(client):
    response = client.get('/')  # Act

    assert response.status_code == HTTPStatus.OK  # Assert
    assert response.json() == {'message': 'Olá Mundo!'}  # Asset


def test_create_user(client):
    response = client.post(  # UserSchema
        '/users/',
        json={
            'username': 'testusername',
            'password': 'senha123',
            'email': 'teste@gmail.com',
        },
    )

    # voltou o status code correto?
    response.status_code == HTTPStatus.CREATED
    # Validar UserPublic
    assert response.json() == {
        'username': 'testusername',
        'email': 'teste@gmail.com',
        'id': 1,
    }


def test_read_users(client):
    response = client.get('/users/')

    assert response.status_code == HTTPStatus.OK
    assert response.json() == {
        'users': [
            {
                'username': 'testusername',
                'email': 'teste@gmail.com',
                'id': 1,
            }
        ]
    }


def test_update_user(client):
    response = client.put(
        '/users/1',
        json={
            'password': '123',
            'username': 'testusername2',
            'email': 'teste@gmail.com',
            'id': 1,
        },
    )
    assert response.json() == {
        'username': 'testusername2',
        'email': 'teste@gmail.com',
        'id': 1,
    }


def test_delete_user(client):
    response = client.delete('/users/1')

    assert response.json() == {'message': 'User deleted'}
