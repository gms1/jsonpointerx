# jsonpointerx

THIS PROJECT HAS BEEN MOVED!

THE NEW LOCATION IS HERE: [jsonpointerx](https://github.com/gms1/HomeOfThings/tree/master/packages/js/jsonpointerx)

[![Version](https://img.shields.io/npm/v/jsonpointerx)](https://www.npmjs.com/package/jsonpointerx)
[![Build Workflow](https://github.com/gms1/jsonpointerx/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/gms1/jsonpointerx/actions/workflows/build.yml)
[![Coverage Status](https://codecov.io/gh/gms1/jsonpointerx/branch/master/graph/badge.svg)](https://codecov.io/gh/gms1/jsonpointerx)
[![DeepScan Grade](https://deepscan.io/api/projects/742/branches/1407/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=742&bid=1407)
[![Known Vulnerabilities](https://snyk.io/test/github/gms1/jsonpointerx/badge.svg)](https://snyk.io/test/github/gms1/jsonpointerx)

[![License](https://img.shields.io/npm/l/jsonpointerx)](https://github.com/gms1/jsonpointerx/blob/master/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

**jsonpointerx** is one of the x-th jsonpointer implementation
The reason I started this project was the need for fast 'get / set' methods via JSON pointers ( see benchmark below )

## Introduction

### Installation

```shell
npm install jsonpointerx
```

### Usage

```JavaScript
import {JsonPointer} from 'jsonpointerx';

let content = { foo: ['bar', 'baz'], more: {x: 'y'} };
let jp = JsonPointer.compile('/foo/0');
let jp2 = JsonPointer.compile('/more');
let jp3 = new JsonPointer(['add','new']);    // another way to instantiate a JsonPointer using decoded path segments
                                             // (property names)

jp.get(content);                             // returns 'bar' (content.foo[0])

jp.set(content, 'bak');                      // sets content.foo[0] to 'bak'
jp.set(content);                             // deletes content.foo[0] (does not change the length of the array)
jp2.set(content);                            // deletes content.more

jp3.set(content, {key: 'value'});            // sets content.add.new.key to 'value'

jp.toString();                               // returns '/foo/0'
jp.toURIFragmentIdentifier();                // returns '#/foo/0'

jp2.concat(jp3).toString();                  // returns '/more/add/new'
jp2.concatSegment('add').toString();         // returns '/more/add'
jp2.concatSegment(['add','new']).toString(); // returns '/more/add/new'
jp2.concatPointer('/add/new').toString();    // returns '/more/add/new'

```

> NOTE: the 'get' method should never throw

for convenience these further static methods exist:

```JavaScript

JsonPointer.set(content, '/foo/0', 'bar');      // sets content.foo[0] to 'bar'
JsonPointer.get(content, '/foo/0');             // returns 'bar' (content.foo[0])

```

> NOTE: feel free to contribute if you have additional requirements

## Benchmark

```shell

gms@orion:~/work/HOT/jsonpointerx/bench$ npm run test

============================================================
json pointer: get defined property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get x     538,688 ops/sec ±0.19% (100 runs sampled)
  jsonpointer.get  x   5,282,555 ops/sec ±0.43% (94 runs sampled)
  json-ptr.get     x 893,703,300 ops/sec ±0.74% (88 runs sampled)
  jsonpointerx.get x 964,196,465 ops/sec ±1.93% (87 runs sampled)

============================================================
json pointer: get property from 'null' ancestor - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get x     125,478 ops/sec ±0.83% (96 runs sampled)
  jsonpointer.get  x      81,552 ops/sec ±0.17% (97 runs sampled)
  json-ptr.get     x 879,120,006 ops/sec ±0.26% (88 runs sampled)
  jsonpointerx.get x 882,737,697 ops/sec ±0.96% (93 runs sampled)

============================================================
json pointer: set property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.set x    492,791 ops/sec ±1.98% (95 runs sampled)
  jsonpointer.set  x  4,088,610 ops/sec ±0.41% (94 runs sampled)
  json-ptr.set     x  6,012,530 ops/sec ±0.28% (94 runs sampled)
  jsonpointerx.set x 14,032,516 ops/sec ±0.65% (99 runs sampled)

```

> NOTE: while 'json-ptr' is now similar fast for `get` operations, 'jsonpointerx' is about 2 times faster for the `set` operation

## Security

> NOTE: please do not feed this library with unsanitized user input

> NOTE: sometimes the use of `new Function('...')` is forbidden (e.g using strict content-security-policy)
> so you may want to disable this feature by setting the global 'noCompile' option to 'true':

```JavaScript
JsonPointer.options({noCompile: true});
```

> NOTE: you can blacklist certain JSON pointer segments. By default only `__proto__` and `prototype` are blacklisted

e.g to add 'foo' to the blacklist:

```JavaScript
JsonPointer.options().blacklist.push('foo');
```

or

```Javascript
JsonPointer.options({blacklist: ['__proto__', 'prototype', 'foo']});
```

## License

**jsonpointerx** is licensed under the MIT License:
[LICENSE](./LICENSE)

## Release Notes

[CHANGELOG](./CHANGELOG.md)
