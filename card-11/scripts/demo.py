"""Cliente real: python scripts/demo.py --mode both --source arxiv."""

import argparse
import json
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

parser = argparse.ArgumentParser()
parser.add_argument("--mode", choices=["json", "stream", "both"], default="both")
parser.add_argument(
    "--source", choices=["arxiv", "semantic_scholar", "auto"], default="arxiv"
)
parser.add_argument("--url", default="http://127.0.0.1:8110")
parser.add_argument(
    "--question",
    default="Quais temas aparecem nos artigos? Cite títulos e fontes disponíveis.",
)
parser.add_argument("--output", default="docs/evidencias.txt")
args = parser.parse_args()
sys.stdout.reconfigure(encoding="utf-8")
lines = []


def record(text):
    print(text, flush=True)
    lines.append(text)


payload = {
    "user_input": args.question,
    "session_id": "demo_" + str(int(time.time())),
    "source": args.source,
}
record("Execução de cliente real em " + datetime.now(timezone.utc).isoformat())
record("Fonte: " + args.source)
success = False
try:
    if args.mode in ("json", "both"):
        response = requests.post(
            args.url + "/chat/orquestrador", json=payload, timeout=300
        )
        response.raise_for_status()
        body = response.json()
        record("JSON: " + json.dumps(body, ensure_ascii=False))
        assert body["usage"]["total_tokens"] > 0, "Nenhum uso de LLM informado"
    if args.mode in ("stream", "both"):
        start = time.monotonic()
        done = False
        usage_seen = False
        with requests.post(
            args.url + "/chat/orquestrador/stream",
            json=payload,
            stream=True,
            timeout=300,
        ) as response:
            response.raise_for_status()
            response.encoding = "utf-8"
            event = ""
            for line in response.iter_lines(chunk_size=1, decode_unicode=True):
                if line.startswith("event: "):
                    event = line[7:]
                elif line.startswith("data: "):
                    data = json.loads(line[6:])
                    record(
                        f"[+{time.monotonic() - start:.3f}s] {event}: "
                        + json.dumps(data, ensure_ascii=False)
                    )
                    if event == "error":
                        raise RuntimeError(data["message"])
                    if event == "usage":
                        assert data["total_tokens"] > 0, "Streaming sem uso positivo"
                        usage_seen = True
                    if event == "done":
                        done = True
        if not done or not usage_seen:
            raise RuntimeError("Stream interrompido antes de usage e done.")
    success = True
except (requests.RequestException, RuntimeError, AssertionError) as exc:
    record("FALHA: " + str(exc))
finally:
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("Registro salvo em " + str(output), flush=True)
if not success:
    sys.exit(1)
