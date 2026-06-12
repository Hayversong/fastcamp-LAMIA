import {
  GameDataSchema,
  GameFormInputSchema,
  SavedGameSchema,
  SearchedGameSchema,
  validateData,
} from "@/lib/validation";

describe("validateData", () => {
  test("aceita dados válidos", () => {
    const input = { gameName: "X", rating: 5, comment: "ok" };
    const result = validateData(input, GameFormInputSchema);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test("rejeita dados inválidos", () => {
    const input = { gameName: "", rating: 20, comment: "" };
    const result = validateData(input, GameFormInputSchema);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("GameFormInputSchema", () => {
  test("aceita dados válidos", () => {
    const result = GameFormInputSchema.safeParse({
      gameName: "Celeste",
      rating: 10,
      comment: "Excelente",
    });

    expect(result.success).toBe(true);
  });

  test("rejeita gameName vazio", () => {
    const result = GameFormInputSchema.safeParse({
      gameName: "",
      rating: 8,
      comment: "Bom",
    });

    expect(result.success).toBe(false);
  });

  test("rejeita rating acima de 10", () => {
    const result = GameFormInputSchema.safeParse({
      gameName: "Celeste",
      rating: 11,
      comment: "Bom",
    });

    expect(result.success).toBe(false);
  });

  test("rejeita rating abaixo de 0", () => {
    const result = GameFormInputSchema.safeParse({
      gameName: "Celeste",
      rating: -1,
      comment: "Bom",
    });

    expect(result.success).toBe(false);
  });

  test("rejeita rating não-inteiro", () => {
    const result = GameFormInputSchema.safeParse({
      gameName: "Celeste",
      rating: 8.5,
      comment: "Bom",
    });

    expect(result.success).toBe(false);
  });

  test("aceita comment vazio (campo opcional)", () => {
    const result = GameFormInputSchema.safeParse({
      gameName: "Celeste",
      rating: 8,
      comment: "",
    });

    expect(result.success).toBe(true);
  });
});

describe("GameDataSchema", () => {
  test("aceita image null", () => {
    const result = GameDataSchema.safeParse({
      name: "Celeste",
      image: null,
      released: null,
      rating: 10,
      comment: "Excelente",
    });

    expect(result.success).toBe(true);
  });

  test("rejeita image como string inválida (não-URL)", () => {
    const result = GameDataSchema.safeParse({
      name: "Celeste",
      image: "not-a-url",
      released: null,
      rating: 10,
      comment: "Excelente",
    });

    expect(result.success).toBe(false);
  });
});

describe("SavedGameSchema", () => {
  test("aceita dados completos com id e createdAt", () => {
    const result = SavedGameSchema.safeParse({
      name: "Celeste",
      image: "https://example.com/celeste.jpg",
      released: "2018-01-25",
      rating: 10,
      comment: "Excelente",
      id: 1,
      createdAt: "2025-01-01T00:00:00.000Z",
    });

    expect(result.success).toBe(true);
  });

  test("rejeita quando falta id", () => {
    const result = SavedGameSchema.safeParse({
      name: "Celeste",
      image: null,
      released: null,
      rating: 10,
      comment: "Excelente",
      createdAt: "2025-01-01T00:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });
});

describe("SearchedGameSchema", () => {
  test("aplica defaults para image, released e rating null", () => {
    const result = SearchedGameSchema.parse({
      name: "Celeste",
    });

    expect(result).toEqual({
      name: "Celeste",
      image: null,
      released: null,
      rating: null,
    });
  });
});
