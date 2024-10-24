import { fetcher, parallelFetcher } from "./parallel-fetcher.js";

// Usage example
let start = performance.now();

const data = await parallelFetcher({
  ditto: fetcher("https://pokeapi.co/api/v2/pokemon/ditto"),
  pikachu: fetcher("https://pokeapi.co/api/v2/pokemon/pikachu"),
  charmander: fetcher("https://pokeapi.co/api/v2/pokemon/charmander"),
  notFound: fetcher("https://foo.com/api/not-found"),
});

// Loop over the results and log the time it took to fetch each resource
Object.entries(data).forEach(([_, value]) => {
  console.log(value.time, value.data?.name || value.error);
});

console.log("Total time:", performance.now() - start);
