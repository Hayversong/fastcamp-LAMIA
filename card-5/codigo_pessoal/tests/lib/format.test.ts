import { describe, expect, it } from "vitest";
import { formatMonthLabel } from "@/lib/format";

describe("formatMonthLabel", () => {
  it("returns the first three characters from a month label", () => {
    expect(formatMonthLabel("Janeiro")).toBe("Jan");
  });
});
