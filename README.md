# Parallel fetcher helper

Want to fetch multiple resources in parallel? This helper function is for you!

```jsx
import { fetcher, parallelFetcher } from "./parallel-fetcher.js";

const data = await parallelFetcher({
  ditto: fetcher("https://pokeapi.co/api/v2/pokemon/ditto"),
  pikachu: fetcher("https://pokeapi.co/api/v2/pokemon/pikachu"),
  charmander: fetcher("https://pokeapi.co/api/v2/pokemon/charmander"),
  notFound: fetcher("https://foo.com/api/not-found"),
});

Object.entries(data).forEach(([_, value]) => {
  if (value.error) {
    console.error(value.error);
    return;
  }
  console.log(
    `Request time: ${value.time}ms\nName: ${value.data?.name || value.error}\n`,
  );
});
```
