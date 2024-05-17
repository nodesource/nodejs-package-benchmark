# nodejs-package-benchmark

This package allows you to benchmark different runtimes using popular
packages operations.

## Supported packages

- [x] ~fastify~ - Temporary disabled.
- [x] lodash
- [x] prettier
- [x] babel
- [x] moment
- [x] dotenv
- [x] pinojs
- [x] winston
- [x] underscore
- [x] typescript

## Install

```console
npm i -g nodejs-package-benchmark
```

## Comparison

To compare binaries, you can use the `bench-it` script.

### Syntax: `bench-it $BINARY ["baseline"]`

This script allows you to compare the performance of binaries. If it's your first run, you need to generate the `baseline` data using:

```console
$ bench-it ./node baseline
```

To compare subsequent runs, simply omit the "baseline" option:

```console
$ bench-it ./node
```
> [!TIP]
> It's recommended to have `colordiff` installed for a clearer comparison of differences.

## Single run

To a pretty terminal output, run `index.js`

```console
$ node index.js
cpu: 13th Gen Intel(R) Core(TM) i5-13600K (20 cores)
node: v20.13.1 (/home/hzk/.nvm/versions/node/v20.13.1/bin/node)
os: Linux 5.15.133.1-microsoft-standard-WSL2 x64
---------------------------------------------------------------------
babel
  transform (code=true ast=true):                                    147.1 (15 samples)
  transform (code=false):                                            150.4 (16 samples)
dotenv
  config:                                                            64.39K (6440 samples)
lodash
  .chunk:                                                            19.62M (1961973 samples)
  .groupBy:                                                          6.303M (630542 samples)
  .includes:                                                         18.38M (1837801 samples)
  .orderBy:                                                          1.737M (173672 samples)
moment
  format (full):                                                     878.8K (87908 samples)
  format:                                                            839.3K (83928 samples)
  fromNow (YYYYMMDD):                                                153.4K (15339 samples)
  subtract (10):                                                     288.7K (28871 samples)
pinojs
  info (10x):                                                        243.7K (24686 samples)
prettier
  format:                                                            71.71 (10 samples)
  format (singleQuote=true useTabs=true):                            68.52 (10 samples)
  format (semi=false):                                               70.61 (10 samples)
typescript
  transpile:                                                         85.23 (10 samples)
  createSourceFile:                                                  1.866K (187 samples)
  getSemanticDiagnostics:                                            2.102 (10 samples)
underscore
  .chunk:                                                            4.606M (467160 samples)
  .groupBy:                                                          1.66M (169265 samples)
  .includes:                                                         7.626M (762632 samples)
  .orderBy:                                                          733.5K (73352 samples)
winston
  info (10x):                                                        43.13K (4431 samples)
---------------------------------------------------------------------
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
