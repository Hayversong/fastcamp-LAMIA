import { beforeEach, describe, expect, it } from "vitest";
import { useUserStore } from "@/features/auth/store/user-store";

const mockUser = {
  name: "Haytham",
  email: "haytham@example.com",
};

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.setState({ user: mockUser });
  });

  it("remove o usuário ao executar logout", () => {
    useUserStore.getState().logout();

    expect(useUserStore.getState().user).toBeNull();
  });

  it("define novamente o usuário após o logout", () => {
    useUserStore.getState().logout();
    useUserStore.getState().setUser(mockUser);

    expect(useUserStore.getState().user).toEqual(mockUser);
  });

  it("restaura o usuario simulado ao fazer login", () => {
    useUserStore.getState().logout();
    useUserStore.getState().login();

    expect(useUserStore.getState().user).toEqual(mockUser);
  });
});
