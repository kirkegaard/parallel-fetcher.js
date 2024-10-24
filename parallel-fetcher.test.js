// fetcher.test.js
import { jest } from "@jest/globals";
import { fetcher, parallelFetcher } from "./parallel-fetcher.js";

// Mock the fetch API and performance.now()
global.fetch = jest.fn();
global.performance = { now: jest.fn() };

describe("fetcher", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  test("should fetch data successfully", async () => {
    // Mock performance.now to simulate time taken
    performance.now.mockReturnValueOnce(1000).mockReturnValueOnce(2000);

    // Mock successful fetch response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Pikachu" }),
    });

    const result = await fetcher("https://pokeapi.co/api/v2/pokemon/pikachu");

    expect(fetch).toHaveBeenCalledWith(
      "https://pokeapi.co/api/v2/pokemon/pikachu",
      {},
    );
    expect(result).toEqual({ data: { name: "Pikachu" }, time: 1000 });
  });

  test("should throw an error on failed fetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetcher("https://foo.com/api/not-found")).rejects.toThrow(
      "HTTP error! status: 404",
    );
    expect(fetch).toHaveBeenCalledWith("https://foo.com/api/not-found", {});
  });
});

describe("parallelFetcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch multiple data in parallel", async () => {
    // Mock performance.now to simulate time taken without specific sequence
    performance.now
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce(1500)
      .mockReturnValueOnce(2000)
      .mockReturnValueOnce(2500)
      .mockReturnValueOnce(3000)
      .mockReturnValueOnce(3500);

    // Mock fetch responses
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Ditto" }),
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Pikachu" }),
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Charmander" }),
    });

    const paths = {
      ditto: fetcher("https://pokeapi.co/api/v2/pokemon/ditto"),
      pikachu: fetcher("https://pokeapi.co/api/v2/pokemon/pikachu"),
      charmander: fetcher("https://pokeapi.co/api/v2/pokemon/charmander"),
    };

    const result = await parallelFetcher(paths);
    console.log(result);

    // Check that the response has the expected structure
    expect(result).toEqual({
      ditto: { data: { name: "Ditto" }, time: expect.any(Number) },
      pikachu: { data: { name: "Pikachu" }, time: expect.any(Number) },
      charmander: { data: { name: "Charmander" }, time: expect.any(Number) },
    });
  });

  test("should handle fetch failures in parallelFetcher", async () => {
    // Mock successful and failed responses
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ name: "Ditto" }),
    });
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const paths = {
      ditto: fetcher("https://pokeapi.co/api/v2/pokemon/ditto"),
      notFound: fetcher("https://foo.com/api/not-found"),
    };

    const result = await parallelFetcher(paths);

    expect(result).toEqual({
      ditto: { data: { name: "Ditto" }, time: expect.any(Number) },
      notFound: { error: "HTTP error! status: 404" },
    });
  });
});
