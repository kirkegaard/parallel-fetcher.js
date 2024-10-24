const fetcher = async (path, options = {}) => {
  const start = performance.now();
  const response = await fetch(path, options);
  const end = performance.now();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return { data, time: end - start };
};

const parallelFetcher = async (paths) => {
  // Create an array of promises that will be settled in parallel using
  // Promise.allSettled and map over the paths object to create a new object
  // with the results of each promise If a promise rejects, the error will be
  // caught and the result will be an object with the error message instead of
  // the data. This way, the function will not throw an error if one of the
  // promises rejects
  const promises = Object.entries(paths).map(async ([key, promise]) => {
    try {
      const result = await promise;
      return { [key]: result };
    } catch (error) {
      return { [key]: { error: error.message } };
    }
  });

  // Wait for all promises to settle
  const results = await Promise.allSettled(promises);

  // Reduce the results into a single object
  return results.reduce((acc, curr) => {
    // Get the key and value of the current promise
    const [key, value] = Object.entries(curr.value)[0];
    acc[key] = value;
    return acc;
  }, {});
};

export { fetcher, parallelFetcher };
