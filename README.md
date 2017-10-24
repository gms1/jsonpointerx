# jsonpointerx

[![Build Status](https://api.travis-ci.org/gms1/jsonpointerx.svg?branch=master)](https://travis-ci.org/gms1/jsonpointerx)
[![npm version](https://badge.fury.io/js/jsonpointerx.svg)](https://badge.fury.io/js/jsonpointerx)
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

  json_pointer.get     x     163,710 ops/sec ±0.32% (91 runs sampled)
  jsonpointer.get      x   2,253,155 ops/sec ±0.15% (92 runs sampled)
  json-ptr.get         x 274,255,100 ops/sec ±1.68% (89 runs sampled)
  jsonpointerx.get     x 456,065,079 ops/sec ±0.18% (93 runs sampled)

============================================================
json pointer: get property from 'null' ancestor - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get     x      73,942 ops/sec ±0.22% (95 runs sampled)
  jsonpointer.get      x     161,628 ops/sec ±0.21% (94 runs sampled)
  json-ptr.get         x     198,217 ops/sec ±0.35% (92 runs sampled)
  jsonpointerx.get     x 515,021,762 ops/sec ±1.50% (87 runs sampled)

============================================================
json pointer: set property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.set     x   144,255 ops/sec ±0.18% (93 runs sampled)
  jsonpointer.set      x 1,756,455 ops/sec ±0.22% (95 runs sampled)
  json-ptr.set         x 2,727,048 ops/sec ±0.26% (94 runs sampled)
  jsonpointerx.set     x 4,844,445 ops/sec ±0.16% (95 runs sampled)
```

## License

**jsonpointerx** is licensed under the MIT License:
[LICENSE](./LICENSE)

## Release Notes

[CHANGELOG](./CHANGELOG.md)
