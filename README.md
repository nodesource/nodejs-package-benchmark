# nodejs-package-benchmark

This package allows you to benchmark different runtimes using popular
packages operations.

## Supported packages

- [x] fastify
- [x] lodash
- [x] prettier
- [x] babel
- [x] moment
- [x] dotenv
- [x] pinojs
- [x] winston
- [x] underscore

## Running

To a pretty terminal output, run `index.js`

```console
$ node index.js
Running Node.js Package Benchmark...
----------------------------------------------------------
babel
  transform (code=true ast=true):                         70.09 (3 samples)
  transform (code=false):                                 78.57 (2 samples)
dotenv
  config:                                                 31.09K (5 samples)
lodash
  .chunk:                                                 24.47M (5 samples)
  .groupBy:                                               3.343M (7 samples)
  .includes:                                              10.35M (6 samples)
  .orderBy:                                               921.3K (8 samples)
moment
  format (full):                                          504.7K (7 samples)
  format:                                                 441K (4 samples)
  fromNow (YYYYMMDD):                                     73K (9 samples)
  subtract (10):                                          134K (5 samples)
pinojs
  info (10x):                                             109.1K (4 samples)
prettier
  format (semi=true):                                     773.5K (3 samples)
  format (singleQuote=true semi=true tabs=true):          593.7K (3 samples)
  format (singleQuote=false semi=false tabs=false):       473.4K (3 samples)
underscore
  .chunk:                                                 3.15M (3 samples)
  .groupBy:                                               1.003M (3 samples)
  .includes:                                              6.588M (4 samples)
  .orderBy:                                               488.7K (5 samples)
winston
  info (10x):                                             24.48K (4 samples)
```

To store it as JSON, just pipe output to a file:

```console
$ node index.js > results.json
$ cat result.json
[
  {
    "name": "babel",
    "method": "benchmarkjs",
    "operations": [
      {
        "name": "transform (code=true ast=true)",
        "opsSec": 67.80076532539411,
        "samples": 3
      },
      {
...
```
