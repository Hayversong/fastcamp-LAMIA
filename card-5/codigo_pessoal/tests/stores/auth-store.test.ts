import { beforeEach, describe, expect, it } from "vitest";
import { MOCK_CREDENTIALS } from "@/features/auth/constants";
import { useAuthStore } from "@/features/auth/store/auth-store";

describe("auth store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    useAuthStore.setState({ hydrated: false, userEmail: null });
  });

  it("autentica e persiste a sessao mock", () => {
    const authenticated = useAuthStore.getState().signIn(MOCK_CREDENTIALS);

    expect(authenticated).toBe(true);
    expect(useAuthStore.getState().userEmail).toBe(MOCK_CREDENTIALS.email);
    expect(window.localStorage.getItem("lamia-user")).toBe(MOCK_CREDENTIALS.email);
  });

  it("rejeita credenciais mock invalidas", () => {
    const authenticated = useAuthStore.getState().signIn({
      email: "outro@example.com",
      password: "senha-invalida",
    });

    expect(authenticated).toBe(false);
    expect(useAuthStore.getState().userEmail).toBeNull();
    expect(window.localStorage.getItem("lamia-user")).toBeNull();
  });

  it("encerra a sessao e remove a persistencia", () => {
    useAuthStore.getState().signIn(MOCK_CREDENTIALS);
    useAuthStore.getState().signOut();

    expect(useAuthStore.getState().userEmail).toBeNull();
    expect(window.localStorage.getItem("lamia-user")).toBeNull();
  });
});
