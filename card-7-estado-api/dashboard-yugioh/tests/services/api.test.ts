import { afterEach, describe, expect, it } from "vitest";
import type { AxiosAdapter } from "axios";
import { api } from "@/services/api";

const adapter: AxiosAdapter = async (config) => ({
  data: null,
  status: 200,
  statusText: "OK",
  headers: {},
  config,
});

describe("cliente Axios", () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it("adiciona o token ao header Authorization", async () => {
    window.localStorage.setItem("token", "token-de-teste");

    const response = await api.get("/regulations", { adapter });

    expect(response.config.headers.Authorization).toBe("Bearer token-de-teste");
  });

  it("não adiciona Authorization quando não há token", async () => {
    const response = await api.get("/regulations", { adapter });

    expect(response.config.headers.Authorization).toBeUndefined();
  });
});
