# jsonpointerx

[![npm version](https://badge.fury.io/js/jsonpointerx.svg)](https://badge.fury.io/js/jsonpointerx)
[![Build Status](https://api.travis-ci.org/gms1/jsonpointerx.svg?branch=master)](https://travis-ci.org/gms1/jsonpointerx)
[![DeepScan Grade](https://deepscan.io/api/projects/742/branches/1407/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=742&bid=1407)
[![Dependency Status](https://david-dm.org/gms1/jsonpointerx.svg)](https://david-dm.org/gms1/jsonpointerx)
[![devDependency Status](https://david-dm.org/gms1/jsonpointerx/dev-status.svg)](https://david-dm.org/gms1/jsonpointerx#info=devDependencies)
[![Known Vulnerabilities](https://snyk.io/test/github/gms1/jsonpointerx/badge.svg)](https://snyk.io/test/github/gms1/jsonpointerx)
[![Greenkeeper badge](https://badges.greenkeeper.io/gms1/jsonpointerx.svg)](https://greenkeeper.io/)

**jsonpointerx** is one of the x-th jsonpointer implementation
The reason I started this project was the need for fast 'get / set' methods via JSON pointers ( see benchmark below )

## Introduction

### Installation

```shell
npm install jsonpointerx
```

### Usage

```Javascript
import {JsonPointer} from 'jsonpointerx';

let content = { foo: ['bar', 'baz'], more: {x: 'y'} };
let jp = JsonPointer.compile('/foo/0');
let jp2 = JsonPointer.compile('/more');
let jp3 = new JsonPointer(['add','new']);  // another way to instantiate a JsonPointer using decoded path segments
                                           // (property names)

jp.get(content);                           // returns 'bar' (content.foo[0])

jp.set(content, 'bak');                    // sets content.foo[0] to 'bak'
jp.set(content);                           // deletes content.foo[0] (does not change the length of the array)
jp2.set(content);                          // deletes content.more

jp3.set(content, {key: 'value'});          // sets content.add.new.key to 'value'

jp.toString();                             // returns '/foo/0'
jp.toURIFragmentIdentifier();              // returns '#/foo/0'


```

> NOTE: the 'get' method should never throw

for convenience these further methods exist:

```Javascript

JsonPointer.set(content, '/foo/0', 'bar');      // sets content.foo[0] to 'bar'
JsonPointer.get(content, '/foo/0');             // returns 'bar' (content.foo[0])

```

> NOTE: feel free to contribute if you have additional requirements

## Benchmark

> NOTE: The 'json-ptr' library is very fast, but the 'get' method throws an exception if an ancestor has a null value, which may lead to poor performance if one can not exclude such situations

```shell
gms@sirius:~/work/jsonpointerx/bench$ npm run test
============================================================
json pointer: get defined property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get x     172,109 ops/sec ±0.24% (94 runs sampled)
  jsonpointer.get  x   2,268,653 ops/sec ±0.27% (95 runs sampled)
  json-ptr.get     x 273,236,092 ops/sec ±0.29% (95 runs sampled)
  jsonpointerx.get x 451,561,618 ops/sec ±0.26% (90 runs sampled)

============================================================
json pointer: get property from 'null' ancestor - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get x      72,891 ops/sec ±0.29% (93 runs sampled)
  jsonpointer.get  x     160,989 ops/sec ±0.31% (92 runs sampled)
  json-ptr.get     x     193,191 ops/sec ±0.50% (92 runs sampled)
  jsonpointerx.get x 515,641,306 ops/sec ±2.22% (84 runs sampled)

============================================================
json pointer: set property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.set x   149,749 ops/sec ±0.20% (92 runs sampled)
  jsonpointer.set  x 1,690,753 ops/sec ±0.47% (88 runs sampled)
  json-ptr.set     x 2,760,613 ops/sec ±0.39% (95 runs sampled)
  jsonpointerx.set x 5,279,633 ops/sec ±0.21% (95 runs sampled)

```

## License

**jsonpointerx** is licensed under the MIT License:
[LICENSE](./LICENSE)

## Release Notes

[CHANGELOG](./CHANGELOG.md)
