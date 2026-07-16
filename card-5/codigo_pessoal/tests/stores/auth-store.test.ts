import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "@/features/auth/store/auth-store";

describe("auth store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({ hydrated: false, userEmail: null });
  });

  it("autentica e persiste a sessao mock", () => {
    useAuthStore.getState().signIn("usuario@example.com");

    expect(useAuthStore.getState().userEmail).toBe("usuario@example.com");
    expect(window.localStorage.getItem("lamia-user")).toBe("usuario@example.com");
  });

  it("encerra a sessao e remove a persistencia", () => {
    useAuthStore.getState().signIn("usuario@example.com");
    useAuthStore.getState().signOut();

    expect(useAuthStore.getState().userEmail).toBeNull();
    expect(window.localStorage.getItem("lamia-user")).toBeNull();
  });
});
