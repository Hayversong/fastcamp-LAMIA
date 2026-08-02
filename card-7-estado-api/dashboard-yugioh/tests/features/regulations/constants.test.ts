import { describe, expect, it } from "vitest";
import { getLimitLabel } from "@/features/regulations/constants";

describe("getLimitLabel", () => {
  it.each([
    [0, "Proibida"],
    [1, "Limitada"],
    [2, "Semilimitada"],
  ])("traduz o limite %i", (limit, label) => {
    expect(getLimitLabel(limit)).toBe(label);
  });

  it("retorna um fallback para limites desconhecidos", () => {
    expect(getLimitLabel(3)).toBe("Status desconhecido");
  });
});
