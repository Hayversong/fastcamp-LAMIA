import { describe, expect, it } from "vitest";
import { formatDate } from "@/lib/format";

describe("formatDate", () => {
  it("formata uma data ISO para pt-BR", () => {
    expect(formatDate("2026-07-01")).toBe("01/07/2026");
  });
});
