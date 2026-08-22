from fastapi import status
from fastapi.testclient import TestClient

HORAS_ATUALIZADAS = 10
HORAS_PROGREDIDAS = 20


def dados_jogo(**sobrescritas: object) -> dict[str, object]:
    dados: dict[str, object] = {
        'titulo': 'Hades',
        'plataforma': 'PC',
        'genero': 'Roguelike',
        'status': 'backlog',
        'horas_jogadas': 0,
        'nota': None,
        'data_compra': '2026-01-15',
    }
    dados.update(sobrescritas)
    return dados


def criar_jogo(
    cliente: TestClient,
    headers: dict[str, str],
    **sobrescritas: object,
) -> dict[str, object]:
    resposta = cliente.post(
        '/api/v1/games/',
        json=dados_jogo(**sobrescritas),
        headers=headers,
    )
    assert resposta.status_code == status.HTTP_201_CREATED
    return resposta.json()


def test_verificacao_saude(cliente: TestClient) -> None:
    resposta = cliente.get('/health')
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json() == {'status': 'ok'}


def test_criar_jogo(cliente: TestClient, headers_auth: dict[str, str]) -> None:
    jogo = criar_jogo(cliente, headers_auth)
    assert jogo['id'] == 1
    assert jogo['titulo'] == 'Hades'


def test_listar_jogos_com_filtros(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    criar_jogo(cliente, headers_auth, status='playing')
    criar_jogo(
        cliente,
        headers_auth,
        titulo='Forza Horizon',
        plataforma='Xbox',
        genero='Corrida',
    )
    resposta = cliente.get(
        '/api/v1/games/?status=playing&plataforma=PC',
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()['total'] == 1
    assert resposta.json()['itens'][0]['titulo'] == 'Hades'


def test_buscar_jogo_por_id(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    jogo = criar_jogo(cliente, headers_auth)
    resposta = cliente.get(
        f'/api/v1/games/{jogo["id"]}',
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()['id'] == jogo['id']


def test_atualizar_jogo(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    jogo = criar_jogo(cliente, headers_auth)
    resposta = cliente.put(
        f'/api/v1/games/{jogo["id"]}',
        json=dados_jogo(
            titulo='Hades II',
            status='playing',
            horas_jogadas=HORAS_ATUALIZADAS,
            nota=9,
        ),
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()['titulo'] == 'Hades II'
    assert resposta.json()['horas_jogadas'] == HORAS_ATUALIZADAS


def test_atualizar_progresso(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    jogo = criar_jogo(cliente, headers_auth)
    resposta = cliente.patch(
        f'/api/v1/games/{jogo["id"]}/progress',
        json={'horas_jogadas': HORAS_PROGREDIDAS, 'status': 'playing'},
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json()['horas_jogadas'] == HORAS_PROGREDIDAS


def test_remover_jogo(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    jogo = criar_jogo(cliente, headers_auth)
    resposta_remocao = cliente.delete(
        f'/api/v1/games/{jogo["id"]}',
        headers=headers_auth,
    )
    assert resposta_remocao.status_code == status.HTTP_204_NO_CONTENT

    resposta_busca = cliente.get(
        f'/api/v1/games/{jogo["id"]}',
        headers=headers_auth,
    )
    assert resposta_busca.status_code == status.HTTP_404_NOT_FOUND


def test_jogo_inexistente_retorna_404(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    resposta = cliente.get(
        '/api/v1/games/999',
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_404_NOT_FOUND
    assert resposta.json() == {'detail': 'Jogo não encontrado'}


def test_rejeita_nota_e_horas_invalidas(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    resposta_nota = cliente.post(
        '/api/v1/games/',
        json=dados_jogo(nota=11),
        headers=headers_auth,
    )
    resposta_horas = cliente.post(
        '/api/v1/games/',
        json=dados_jogo(horas_jogadas=-1),
        headers=headers_auth,
    )
    assert resposta_nota.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
    assert resposta_horas.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT


def test_rejeita_jogo_duplicado(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    criar_jogo(cliente, headers_auth)
    resposta = cliente.post(
        '/api/v1/games/',
        json=dados_jogo(titulo='hades', plataforma='pc'),
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_409_CONFLICT


def test_resumo(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    criar_jogo(
        cliente,
        headers_auth,
        status='playing',
        horas_jogadas=12,
    )
    criar_jogo(
        cliente,
        headers_auth,
        titulo='Celeste',
        status='completed',
        horas_jogadas=8,
    )
    resposta = cliente.get(
        '/api/v1/games/stats/summary',
        headers=headers_auth,
    )
    assert resposta.status_code == status.HTTP_200_OK
    assert resposta.json() == {
        'total_jogos': 2,
        'total_horas_jogadas': 20.0,
        'jogos_por_status': {
            'backlog': 0,
            'playing': 1,
            'completed': 1,
            'dropped': 0,
        },
    }


def test_usuarios_diferentes_nao_compartilham_jogos(
    cliente: TestClient,
    headers_auth: dict[str, str],
) -> None:
    jogo = criar_jogo(
        cliente,
        headers_auth,
        titulo='Jogo do User A',
    )

    resposta_registro = cliente.post(
        '/auth/register',
        json={
            'username': 'user_b',
            'email': 'b@example.com',
            'senha': 'senhaB123',
        },
    )
    assert resposta_registro.status_code == status.HTTP_201_CREATED

    resposta_login = cliente.post(
        '/auth/token',
        data={
            'username': 'b@example.com',
            'password': 'senhaB123',
        },
    )
    token_b = resposta_login.json()['access_token']
    headers_b = {'Authorization': f'Bearer {token_b}'}

    resposta_listagem = cliente.get('/api/v1/games/', headers=headers_b)
    assert resposta_listagem.status_code == status.HTTP_200_OK
    assert resposta_listagem.json()['total'] == 0

    resposta_busca = cliente.get(
        f'/api/v1/games/{jogo["id"]}',
        headers=headers_b,
    )
    assert resposta_busca.status_code == status.HTTP_404_NOT_FOUND
