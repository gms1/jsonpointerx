# jsonpointerx

[![npm version](https://badge.fury.io/js/jsonpointerx.svg)](https://badge.fury.io/js/jsonpointerx)
[![Build Status](https://api.travis-ci.org/gms1/jsonpointerx.svg?branch=master)](https://travis-ci.org/gms1/jsonpointerx)
[![Coverage Status](https://coveralls.io/repos/github/gms1/jsonpointerx/badge.svg?branch=master)](https://coveralls.io/github/gms1/jsonpointerx?branch=master)
[![DeepScan Grade](https://deepscan.io/api/projects/742/branches/1407/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=742&bid=1407)
[![Dependency Status](https://david-dm.org/gms1/jsonpointerx.svg)](https://david-dm.org/gms1/jsonpointerx)
[![Known Vulnerabilities](https://snyk.io/test/github/gms1/jsonpointerx/badge.svg)](https://snyk.io/test/github/gms1/jsonpointerx)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

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

```Javascript

JsonPointer.set(content, '/foo/0', 'bar');      // sets content.foo[0] to 'bar'
JsonPointer.get(content, '/foo/0');             // returns 'bar' (content.foo[0])

```

> NOTE: feel free to contribute if you have additional requirements

## Benchmark

> NOTE: The 'json-ptr' library is very fast, but the 'get' method throws an exception if an ancestor has a null value, which may lead to poor performance if one can not exclude such situations

```shell
gms@orion:~/work/HOT/jsonpointerx/bench$ npm run test

============================================================
json pointer: get defined property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get x     349,905 ops/sec ±1.36% (87 runs sampled)
  jsonpointer.get  x   2,775,193 ops/sec ±1.16% (86 runs sampled)
  json-ptr.get     x 635,536,028 ops/sec ±0.97% (86 runs sampled)
  jsonpointerx.get x 811,617,229 ops/sec ±1.03% (84 runs sampled)

============================================================
json pointer: get property from 'null' ancestor - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.get x     105,759 ops/sec ±1.57% (86 runs sampled)
  jsonpointer.get  x     190,582 ops/sec ±1.95% (84 runs sampled)
  json-ptr.get     x     239,306 ops/sec ±1.09% (83 runs sampled)
  jsonpointerx.get x 810,884,287 ops/sec ±1.44% (83 runs sampled)

============================================================
json pointer: set property - suite:
------------------------------------------------------------
  4 tests completed.

  json_pointer.set x   352,312 ops/sec ±1.63% (86 runs sampled)
  jsonpointer.set  x 2,212,944 ops/sec ±0.90% (87 runs sampled)
  json-ptr.set     x 3,974,295 ops/sec ±1.15% (91 runs sampled)
  jsonpointerx.set x 7,331,909 ops/sec ±0.94% (88 runs sampled)
```

## Security

> NOTE: sometimes the use of `new Function('...')` is forbidden (e.g using strict content-security-policy)
> so you may want to disable this feature by setting the global 'noCompile' option to 'off':

```Javascript
JsonPointer.options({noCompile: true});
```

## License

**jsonpointerx** is licensed under the MIT License:
[LICENSE](./LICENSE)

## Release Notes

[CHANGELOG](./CHANGELOG.md)
