from pprint import pprint

import requests

url = "http://localhost:8110/chat/orquestrador"

payload = {
    "user_input": "Olá! Como você pode me ajudar hoje?",
    "session_id": "teste_01",
}
headers = {"accept": "application/json", "Content-Type": "application/json"}

print(f"Enviando requisição para: {url}...")

try:
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()

    print("\nSucesso! Resposta da API:")
    pprint(response.json())

except requests.exceptions.HTTPError as errh:
    print(f"\n Erro HTTP: {errh}")
    print(f"Detalhes: {response.text}")
except requests.exceptions.ConnectionError:
    print(
        "\n Erro de Conexão: Não foi possível conectar ao servidor. O Uvicorn está rodando?"
    )
except requests.exceptions.Timeout:
    print("\n Erro de Timeout: A requisição demorou muito para responder.")
except requests.exceptions.RequestException as err:
    print(f"\n Erro Inesperado: {err}")
