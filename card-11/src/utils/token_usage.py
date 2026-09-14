"""Contagem isolada por requisição, incluindo chamadas auxiliares do fluxo."""

from langchain_core.callbacks import BaseCallbackHandler

from src.api.schemas.chat import TokenUsage
from src.config import model_name, provider_name


class TokenTracker(BaseCallbackHandler):
    raise_error = True

    def __init__(self):
        self.inputs = {}
        self.input_tokens = self.output_tokens = self.calls = 0
        self.methods = set()

    def on_chat_model_start(self, serialized, messages, *, run_id, **kwargs):
        self.inputs[run_id] = messages[0]

    def on_llm_end(self, response, *, run_id, **kwargs):
        message = response.generations[0][0].message
        usage = getattr(message, "usage_metadata", None)
        legacy = (response.llm_output or {}).get("token_usage")
        messages = self.inputs.pop(run_id, [])
        if usage:
            input_count, output_count = usage["input_tokens"], usage["output_tokens"]
            method = "provider"
        elif legacy:
            input_count, output_count = (
                legacy["prompt_tokens"],
                legacy["completion_tokens"],
            )
            method = "provider"
        else:
            import tiktoken

            # Aproximação ChatML para GPT-4o; nunca apresentada como usage oficial.
            encoding = tiktoken.encoding_for_model(model_name())
            input_count = 3 + sum(
                3
                + len(encoding.encode(str(m.content), disallowed_special=()))
                + len(
                    encoding.encode(
                        {"human": "user", "ai": "assistant"}.get(m.type, m.type)
                    )
                )
                for m in messages
            )
            output_count = len(
                encoding.encode(str(message.content), disallowed_special=())
            )
            method = "estimated"
        self.record_usage(input_count, output_count, method)

    def record_usage(self, input_count, output_count, method="provider"):
        self.methods.add(method)
        self.input_tokens += input_count
        self.output_tokens += output_count
        self.calls += 1

    def snapshot(self):
        method = "mixed" if len(self.methods) > 1 else next(iter(self.methods), "none")
        return TokenUsage(
            provider=provider_name(),
            model=model_name(),
            input_tokens=self.input_tokens,
            output_tokens=self.output_tokens,
            total_tokens=self.input_tokens + self.output_tokens,
            llm_calls=self.calls,
            counting_method=method,
        )
