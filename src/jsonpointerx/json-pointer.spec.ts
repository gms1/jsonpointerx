// tslint:disable no-null-keyword no-unused-variable only-arrow-functions typedef

import { JsonPointer } from './index';

function testConvertString(ptr: string, isRoot: boolean = false): void {
  const jp = JsonPointer.compile(ptr);
  expect(jp.toString()).toEqual(ptr, `convert failed for "${ptr}"`);
  expect(jp.root).toEqual(
    isRoot,
    isRoot ? `${ptr} should be 'root'` : `${ptr} should not be 'root'`,
  );
}

function testConvertURIFragment(ptr: string, alt?: string, isRoot: boolean = false): void {
  const jp = JsonPointer.compile(ptr);
  expect(jp.toURIFragmentIdentifier()).toEqual(alt ? alt : ptr, `convert failed for "${ptr}"`);
  expect(jp.root).toEqual(
    isRoot,
    isRoot ? `${ptr} should be 'root'` : `${ptr} should not be 'root'`,
  );
}

const DEFAULT_OPTIONS = JsonPointer.options();

describe('json-pointer', () => {
  let rfcExample: any;

  beforeEach(() => {
    JsonPointer.options(DEFAULT_OPTIONS);
    rfcExample = {
      foo: ['bar', 'baz'],
      '': 0,
      'a/b': 1,
      'c%d': 2,
      'e^f': 3,
      'g|h': 4,
      'i\\j': 5,
      'k"l': 6,
      "k'l": 6,
      ' ': 7,
      'm~n': 8,
    };
  });

  it('convert', () => {
    testConvertString('', true);
    testConvertString('/foo');
    testConvertString('/foo/0');
    testConvertString('/');
    testConvertString('/a~1b');
    testConvertString('/c%d');
    testConvertString('/e^f');
    testConvertString('/g|h');
    testConvertString('/i\\j');
    testConvertString('/k"l');
    testConvertString("/k'l");
    testConvertString('/ ');
    testConvertString('/m~0n');

    testConvertURIFragment('#', undefined, true);
    testConvertURIFragment('#/foo');
    testConvertURIFragment('#/foo/0');
    testConvertURIFragment('#/');
    testConvertURIFragment('#/a~1b', '#/a%2Fb');
    testConvertURIFragment('#/c%25d');
    testConvertURIFragment('#/e%5Ef');
    testConvertURIFragment('#/g%7Ch');
    testConvertURIFragment('#/i%5Cj');
    testConvertURIFragment('#/k%22l');
    testConvertURIFragment('#/k%27l', "#/k'l");
    testConvertURIFragment('#/%20');
    testConvertURIFragment('#/m~0n');
  });

  function testGet(decodeOnly: boolean): void {
    expect(JsonPointer.compile('', decodeOnly).get(rfcExample)).toEqual(
      rfcExample,
      'get failed for ""',
    );
    expect(JsonPointer.compile('/foo', decodeOnly).get(rfcExample)).toEqual(
      rfcExample.foo,
      'get failed for "/foo"',
    );
    expect(JsonPointer.compile('/foo/0', decodeOnly).get(rfcExample)).toEqual(
      rfcExample.foo[0],
      'get failed for "/foo/0"',
    );
    expect(JsonPointer.compile('/', decodeOnly).get(rfcExample)).toEqual(
      rfcExample[''],
      'get failed for "/"',
    );
    expect(JsonPointer.compile('/a~1b', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['a/b'],
      'get failed for "/a~1b"',
    );
    expect(JsonPointer.compile('/c%d', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['c%d'],
      'get failed for "/c%d"',
    );
    expect(JsonPointer.compile('/e^f', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['e^f'],
      'get failed for "/e^f"',
    );
    expect(JsonPointer.compile('/g|h', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['g|h'],
      'get failed for "/g|h"',
    );
    expect(JsonPointer.compile('/i\\j', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['i\\j'],
      'get failed for "/i\\j"',
    );
    expect(JsonPointer.compile('/k"l', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['k"l'],
      'get failed for "/k"l"',
    );
    expect(JsonPointer.compile("/k'l", decodeOnly).get(rfcExample)).toEqual(
      rfcExample["k'l"],
      'get failed for "/k\'l"',
    );
    expect(JsonPointer.compile('/ ', decodeOnly).get(rfcExample)).toEqual(
      rfcExample[' '],
      'get failed for "/ "',
    );
    expect(JsonPointer.compile('/m~0n', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['m~n'],
      'get failed for "/m~0n"',
    );

    expect(JsonPointer.compile('#', decodeOnly).get(rfcExample)).toEqual(
      rfcExample,
      'get failed for "#"',
    );
    expect(JsonPointer.compile('#/foo', decodeOnly).get(rfcExample)).toEqual(
      rfcExample.foo,
      'get failed for "#/foo"',
    );
    expect(JsonPointer.compile('#/foo/0', decodeOnly).get(rfcExample)).toEqual(
      rfcExample.foo[0],
      'get failed for "#/foo/0"',
    );
    expect(JsonPointer.compile('#/', decodeOnly).get(rfcExample)).toEqual(
      rfcExample[''],
      'get failed for "#/"',
    );
    expect(JsonPointer.compile('#/a~1b', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['a/b'],
      'get failed for "#/a~1b"',
    );
    expect(JsonPointer.compile('#/c%25d', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['c%d'],
      'get failed for "#/c%25d"',
    );
    expect(JsonPointer.compile('#/e%5Ef', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['e^f'],
      'get failed for "#/e%5Ef"',
    );
    expect(JsonPointer.compile('#/g%7Ch', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['g|h'],
      'get failed for "#/g%7Ch"',
    );
    expect(JsonPointer.compile('#/i%5Cj', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['i\\j'],
      'get failed for "#/i%5Cj"',
    );
    expect(JsonPointer.compile('#/k%22l', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['k"l'],
      'get failed for "#/k%22l"',
    );
    expect(JsonPointer.compile('#/k%27l', decodeOnly).get(rfcExample)).toEqual(
      rfcExample["k'l"],
      'get failed for "#/k%27l"',
    );
    expect(JsonPointer.compile('#/%20', decodeOnly).get(rfcExample)).toEqual(
      rfcExample[' '],
      'get failed for "#/%20"',
    );
    expect(JsonPointer.compile('#/m~0n', decodeOnly).get(rfcExample)).toEqual(
      rfcExample['m~n'],
      'get failed for "#/m~0n"',
    );

    // extended the rfc example:

    // should not throw on undefined ancestors:
    expect(JsonPointer.compile('/undef1', decodeOnly).get(rfcExample)).toBeUndefined(
      'get failed for "/undef1"',
    );

    expect(JsonPointer.compile('/foo/undef2', decodeOnly).get(rfcExample)).toBeUndefined(
      'get failed for "/foo/undef2"',
    );
    expect(JsonPointer.compile('/foo/undef2/undef3', decodeOnly).get(rfcExample)).toBeUndefined(
      'get failed for "/foo/undef2/undef3"',
    );

    expect(JsonPointer.compile('/foo/-', decodeOnly).get(rfcExample)).toEqual(
      undefined,
      'get failed for "/foo/-"',
    );
    expect(JsonPointer.compile('/foo/0/bar', decodeOnly).get(rfcExample)).toEqual(
      undefined,
      'get failed for "/foo/0/bar"',
    );

    // should not throw on null ancestors:
    rfcExample.foo.null1 = null;
    expect(JsonPointer.compile('/foo/null1', decodeOnly).get(rfcExample)).toEqual(
      rfcExample.foo.null1,
      'get failed for "/foo/null1"',
    );
    expect(JsonPointer.compile('/foo/null1/undef3', decodeOnly).get(rfcExample)).toBeUndefined(
      'get failed for "/foo/null1/undef3"',
    );

    // decoding of '~01'
    rfcExample.foo['~1'] = 'foo';
    expect(JsonPointer.compile('/foo/~01', decodeOnly).get(rfcExample)).toEqual(
      rfcExample.foo['~1'],
      'get failed for "/foo/~01"',
    );

    // construct
    let jp: JsonPointer;

    jp = new JsonPointer('foo', decodeOnly);
    expect(jp.get(rfcExample)).toEqual(
      rfcExample.foo,
      'get using constructed jp failed for "/foo"',
    );

    jp = new JsonPointer(['foo', '0'], decodeOnly);
    expect(jp.get(rfcExample)).toEqual(
      rfcExample.foo[0],
      'get using constructed jp failed for "/foo/0"',
    );

    jp = new JsonPointer(undefined, decodeOnly);
    expect(jp.get(rfcExample)).toEqual(rfcExample, 'get using constructed jp failed for ""');
  }

  it('get compiled', () => {
    testGet(false);
  });

  it('get non compiled', () => {
    testGet(true);
  });

  it('get non compiled', () => {
    JsonPointer.options({ noCompile: true });
    testGet(false);
    JsonPointer.options({ noCompile: false });
  });

  it('get static', () => {
    expect(JsonPointer.get(rfcExample, '/foo/0')).toEqual(
      rfcExample.foo[0],
      'static get failed for "/foo/0"',
    );
  });

  it('set static', () => {
    const setValue = 'testValue';
    JsonPointer.set(rfcExample, '/foo/0', setValue);
    expect(JsonPointer.get(rfcExample, '/foo/0')).toEqual(
      setValue,
      'static set failed for "/foo/0"',
    );
  });

  it('set', () => {
    let setValue: any = {};
    let jp: JsonPointer;

    expect(() => JsonPointer.compile('').set(rfcExample, setValue)).toThrowError(
      'Set for root JSON pointer is not allowed.',
    );

    setValue = ['baz', 'bar'];
    jp = JsonPointer.compile('/foo');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/foo"');

    setValue = 'testValue';
    jp = JsonPointer.compile('/foo/0');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/foo/0"');

    setValue = 8;
    jp = JsonPointer.compile('/');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/"');

    setValue = 8;
    jp = JsonPointer.compile('/a~1b');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/a~1b"');

    setValue = 7;
    jp = JsonPointer.compile('/c%d');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/c%d"');

    setValue = 6;
    jp = JsonPointer.compile('/e^f');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/e^f"');

    setValue = 5;
    jp = JsonPointer.compile('/g|h');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/g|h"');

    setValue = 4;
    jp = JsonPointer.compile('/i\\j');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/i\\j"');

    setValue = 3;
    jp = JsonPointer.compile('/k"l');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/k"l"');

    setValue = 3;
    jp = JsonPointer.compile("/k'l");
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/k\'l"');

    setValue = 2;
    jp = JsonPointer.compile('/ ');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/ "');

    setValue = 1;
    jp = JsonPointer.compile('/m~0n');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/m~0n"');

    // extended the rfc example:
    setValue = 'brz';
    jp = JsonPointer.compile('/unknown1/grz');
    jp.set(rfcExample, setValue);
    expect(jp.get(rfcExample)).toEqual(setValue, 'set failed for "/unknown1/grz"');

    rfcExample.grz = { brz: { mau: 'dau' } };

    JsonPointer.compile('/grz/brz').set(rfcExample);
    expect(rfcExample.grz.brz).toBeUndefined('set failed for "/grz/brz"');

    setValue = 'testValue2';
    let arrLen = rfcExample.foo.length;
    jp = JsonPointer.compile('/foo/-');
    jp.set(rfcExample, setValue);
    expect(rfcExample.foo[arrLen]).toEqual(setValue, 'set failed for "/foo/-"');

    arrLen = rfcExample.foo.length;
    jp = JsonPointer.compile('/foo/-/part');
    jp.set(rfcExample, setValue);
    expect(rfcExample.foo[arrLen].part).toEqual(setValue, 'set failed for "/foo/-/part"');

    arrLen = rfcExample.foo.length;
    jp = JsonPointer.compile(`/foo/${arrLen}/part`);
    jp.set(rfcExample, setValue);
    expect(rfcExample.foo[arrLen].part).toEqual(setValue, 'set failed for "/foo/[len]/part"');

    jp = JsonPointer.compile(`/new/-/part`);
    jp.set(rfcExample, setValue);
    expect(rfcExample.new[0].part).toEqual(setValue, 'set failed for "/new/-/part"');

    setValue = 2;

    expect(() =>
      JsonPointer.compile('/unknown1/grz/blub/xx').set(rfcExample, setValue),
    ).toThrowError(/^Cannot create property/);

    expect(() => JsonPointer.compile('/unknown1/grz/blub').set(rfcExample, setValue)).toThrowError(
      /^Cannot create property/,
    );

    expect(() =>
      JsonPointer.compile('/foo/unknown2/unknown3').set(rfcExample, setValue),
    ).toThrowError('Invalid JSON pointer array index reference (level 2).');

    expect(() => JsonPointer.compile('/foo/unknown2').set(rfcExample, setValue)).toThrowError(
      'Invalid JSON pointer array index reference at end of pointer.',
    );

    // more:
    expect(() => JsonPointer.compile('/grz/brz').set(43)).toThrowError('Invalid input object.');
    expect(() => JsonPointer.compile('/grz/brz').set('')).toThrowError('Invalid input object.');
  });

  it('concat', () => {
    expect(
      JsonPointer.compile('/foo')
        .concat(JsonPointer.compile('/0'))
        .get(rfcExample),
    ).toEqual(rfcExample.foo[0], 'concat 1 failed for "/foo/0"');

    expect(
      JsonPointer.compile('/foo')
        .concatSegment('0')
        .get(rfcExample),
    ).toEqual(rfcExample.foo[0], 'concat 2 failed for "/foo/0"');

    expect(
      JsonPointer.compile('/foo')
        .concatPointer('/0')
        .get(rfcExample),
    ).toEqual(rfcExample.foo[0], 'concat 3 failed for "/foo/0"');

    expect(
      JsonPointer.compile('/foo')
        .concatPointer('#/0')
        .get(rfcExample),
    ).toEqual(rfcExample.foo[0], 'concat 3 failed for "/foo/0"');
  });

  it('compile failure', () => {
    expect(() => JsonPointer.compile('abc')).toThrow();
    expect(() => JsonPointer.compile('#abc')).toThrow();
    expect(() => JsonPointer.compile('/a/__proto__/b')).toThrow(); // '__proto__' is blacklisted by default
    expect(() => JsonPointer.compile('/prototype/b')).toThrow(); // 'prototype' is blacklisted by default
  });
});
