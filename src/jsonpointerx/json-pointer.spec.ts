// tslint:disable no-null-keyword

import {JsonPointer} from './index';

function testConvertString(ptr: string): void {
  expect(JsonPointer.compile(ptr).toString()).toEqual(ptr, `convert failed for "${ptr}"`);
}

function testConvertURIFragment(ptr: string, alt?: string): void {
  expect(JsonPointer.compile(ptr).toURIFragmentIdentifier()).toEqual(alt ? alt : ptr, `convert failed for "${ptr}"`);
}

describe('json-pointer', () => {

  let rfcExample: any;

  beforeEach(() => {
    rfcExample =
        {foo: ['bar', 'baz'], '': 0, 'a/b': 1, 'c%d': 2, 'e^f': 3, 'g|h': 4, 'i\\j': 5, 'k"l': 6, ' ': 7, 'm~n': 8};
  });

  it('convert', () => {
    testConvertString('');
    testConvertString('/foo');
    testConvertString('/foo/0');
    testConvertString('/');
    testConvertString('/a~1b');
    testConvertString('/c%d');
    testConvertString('/e^f');
    testConvertString('/g|h');
    testConvertString('/i\\j');
    testConvertString('/k"l');
    testConvertString('/ ');
    testConvertString('/m~0n');

    testConvertURIFragment('#');
    testConvertURIFragment('#/foo');
    testConvertURIFragment('#/foo/0');
    testConvertURIFragment('#/');
    testConvertURIFragment('#/a~1b', '#/a%2Fb');
    testConvertURIFragment('#/c%25d');
    testConvertURIFragment('#/e%5Ef');
    testConvertURIFragment('#/g%7Ch');
    testConvertURIFragment('#/i%5Cj');
    testConvertURIFragment('#/k%22l');
    testConvertURIFragment('#/%20');
    testConvertURIFragment('#/m~0n');

  });

  function testGet(decodeOnly: boolean): void {
    expect(JsonPointer.compile('', decodeOnly).get(rfcExample)).toEqual(rfcExample, 'get failed for ""');
    expect(JsonPointer.compile('/foo', decodeOnly).get(rfcExample)).toEqual(rfcExample.foo, 'get failed for "/foo"');
    expect(JsonPointer.compile('/foo/0', decodeOnly).get(rfcExample))
        .toEqual(rfcExample.foo[0], 'get failed for "/foo/0"');
    expect(JsonPointer.compile('/', decodeOnly).get(rfcExample)).toEqual(rfcExample[''], 'get failed for "/"');
    expect(JsonPointer.compile('/a~1b', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['a/b'], 'get failed for "/a~1b"');
    expect(JsonPointer.compile('/c%d', decodeOnly).get(rfcExample)).toEqual(rfcExample['c%d'], 'get failed for "/c%d"');
    expect(JsonPointer.compile('/e^f', decodeOnly).get(rfcExample)).toEqual(rfcExample['e^f'], 'get failed for "/e^f"');
    expect(JsonPointer.compile('/g|h', decodeOnly).get(rfcExample)).toEqual(rfcExample['g|h'], 'get failed for "/g|h"');
    expect(JsonPointer.compile('/i\\j', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['i\\j'], 'get failed for "/i\\j"');
    expect(JsonPointer.compile('/k"l', decodeOnly).get(rfcExample)).toEqual(rfcExample['k"l'], 'get failed for "/k"l"');
    expect(JsonPointer.compile('/ ', decodeOnly).get(rfcExample)).toEqual(rfcExample[' '], 'get failed for "/ "');
    expect(JsonPointer.compile('/m~0n', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['m~n'], 'get failed for "/m~0n"');

    expect(JsonPointer.compile('#', decodeOnly).get(rfcExample)).toEqual(rfcExample, 'get failed for "#"');
    expect(JsonPointer.compile('#/foo', decodeOnly).get(rfcExample)).toEqual(rfcExample.foo, 'get failed for "#/foo"');
    expect(JsonPointer.compile('#/foo/0', decodeOnly).get(rfcExample))
        .toEqual(rfcExample.foo[0], 'get failed for "#/foo/0"');
    expect(JsonPointer.compile('#/', decodeOnly).get(rfcExample)).toEqual(rfcExample[''], 'get failed for "#/"');
    expect(JsonPointer.compile('#/a~1b', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['a/b'], 'get failed for "#/a~1b"');
    expect(JsonPointer.compile('#/c%25d', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['c%d'], 'get failed for "#/c%25d"');
    expect(JsonPointer.compile('#/e%5Ef', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['e^f'], 'get failed for "#/e%5Ef"');
    expect(JsonPointer.compile('#/g%7Ch', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['g|h'], 'get failed for "#/g%7Ch"');
    expect(JsonPointer.compile('#/i%5Cj', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['i\\j'], 'get failed for "#/i%5Cj"');
    expect(JsonPointer.compile('#/k%22l', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['k"l'], 'get failed for "#/k%22l"');
    expect(JsonPointer.compile('#/%20', decodeOnly).get(rfcExample)).toEqual(rfcExample[' '], 'get failed for "#/%20"');
    expect(JsonPointer.compile('#/m~0n', decodeOnly).get(rfcExample))
        .toEqual(rfcExample['m~n'], 'get failed for "#/m~0n"');


    // extended the rfc example:

    // should not throw on undefined ancestors:
    expect(JsonPointer.compile('/undef1', decodeOnly).get(rfcExample)).toBeUndefined('get failed for "/undef1"');

    expect(JsonPointer.compile('/foo/undef2', decodeOnly).get(rfcExample))
        .toBeUndefined('get failed for "/foo/undef2"');
    expect(JsonPointer.compile('/foo/undef2/undef3', decodeOnly).get(rfcExample))
        .toBeUndefined('get failed for "/foo/undef2/undef3"');

    // should not throw on null ancestors:
    rfcExample.foo.null1 = null;
    expect(JsonPointer.compile('/foo/null1', decodeOnly).get(rfcExample))
        .toEqual(rfcExample.foo.null1, 'get failed for "/foo/null1"');
    expect(JsonPointer.compile('/foo/null1/undef3', decodeOnly).get(rfcExample))
        .toBeUndefined('get failed for "/foo/null1/undef3"');

    // decoding of '~01'
    rfcExample.foo['~1'] = 'foo';
    expect(JsonPointer.compile('/foo/~01', decodeOnly).get(rfcExample))
        .toEqual(rfcExample.foo['~1'], 'get failed for "/foo/~01"');
  }

  it('get compiled', () => { testGet(false); });

  it('get non compiled', () => { testGet(true); });

  it('get static', () => {
    expect(JsonPointer.get(rfcExample, '/foo/0')).toEqual(rfcExample.foo[0], 'static get failed for "/foo/0"');
  });

  it('set static', () => {
    let setValue = 'angular';
    JsonPointer.set(rfcExample, '/foo/0', setValue);
    expect(JsonPointer.get(rfcExample, '/foo/0')).toEqual(setValue, 'static set failed for "/foo/0"');
  });

  it('set', () => {
    let setValue: any = {};

    expect(() => JsonPointer.compile('').set(rfcExample, setValue))
        .toThrowError('Set for root JSON pointer is not allowed.');

    setValue = ['baz', 'bar'];
    JsonPointer.compile('/foo').set(rfcExample, setValue);
    expect(JsonPointer.compile('/foo').get(rfcExample)).toEqual(setValue, 'set failed for "/foo"');

    setValue = 'angular';
    JsonPointer.compile('/foo/0').set(rfcExample, setValue);
    expect(JsonPointer.compile('/foo/0').get(rfcExample)).toEqual(setValue, 'set failed for "/foo/0"');

    setValue = 8;
    JsonPointer.compile('/').set(rfcExample, setValue);
    expect(JsonPointer.compile('/').get(rfcExample)).toEqual(setValue, 'set failed for "/"');

    setValue = 8;
    JsonPointer.compile('/a~1b').set(rfcExample, setValue);
    expect(JsonPointer.compile('/a~1b').get(rfcExample)).toEqual(setValue, 'set failed for "/a~1b"');

    setValue = 7;
    JsonPointer.compile('/c%d').set(rfcExample, setValue);
    expect(JsonPointer.compile('/c%d').get(rfcExample)).toEqual(setValue, 'set failed for "/c%d"');

    setValue = 6;
    JsonPointer.compile('/e^f').set(rfcExample, setValue);
    expect(JsonPointer.compile('/e^f').get(rfcExample)).toEqual(setValue, 'set failed for "/e^f"');

    setValue = 5;
    JsonPointer.compile('/g|h').set(rfcExample, setValue);
    expect(JsonPointer.compile('/g|h').get(rfcExample)).toEqual(setValue, 'set failed for "/g|h"');

    setValue = 4;
    JsonPointer.compile('/i\\j').set(rfcExample, setValue);
    expect(JsonPointer.compile('/i\\j').get(rfcExample)).toEqual(setValue, 'set failed for "/i\\j"');

    setValue = 3;
    JsonPointer.compile('/k"l').set(rfcExample, setValue);
    expect(JsonPointer.compile('/k"l').get(rfcExample)).toEqual(setValue, 'set failed for "/k"l"');

    setValue = 2;
    JsonPointer.compile('/ ').set(rfcExample, setValue);
    expect(JsonPointer.compile('/ ').get(rfcExample)).toEqual(setValue, 'set failed for "/ "');

    setValue = 1;
    JsonPointer.compile('/m~0n').set(rfcExample, setValue);
    expect(JsonPointer.compile('/m~0n').get(rfcExample)).toEqual(setValue, 'set failed for "/m~0n"');


    // extended the rfc example:
    setValue = 'brz';
    JsonPointer.compile('/unknown1/grz').set(rfcExample, setValue);
    expect(JsonPointer.compile('/unknown1/grz').get(rfcExample)).toEqual(setValue, 'set failed for "/unknown1/grz"');

    setValue = 2;

    expect(() => JsonPointer.compile('/unknown1/grz/blub/xx').set(rfcExample, setValue))
        .toThrowError(/^Cannot create property/);

    expect(() => JsonPointer.compile('/unknown1/grz/blub').set(rfcExample, setValue))
        .toThrowError(/^Cannot create property/);


    expect(() => JsonPointer.compile('/foo/unknown2/unknown3').set(rfcExample, setValue))
        .toThrowError('Invalid JSON pointer array index reference (level 2).');

    expect(() => JsonPointer.compile('/foo/unknown2').set(rfcExample, setValue))
        .toThrowError('Invalid JSON pointer array index reference at end of pointer.');

    rfcExample.grz = {brz: {mau: 'dau'}};

    JsonPointer.compile('/grz/brz').set(rfcExample);
    expect(rfcExample.grz.brz).toBeUndefined('set failed for "/grz/brz"');

  });

  it('concat', () => {
    expect(JsonPointer.compile('/foo').concat(JsonPointer.compile('/0')).get(rfcExample))
        .toEqual(rfcExample.foo[0], 'concat 1 failed for "/foo/0"');


    expect(JsonPointer.compile('/foo').concatSegment('0').get(rfcExample))
        .toEqual(rfcExample.foo[0], 'concat 2 failed for "/foo/0"');

    expect(JsonPointer.compile('/foo').concatPointer('/0').get(rfcExample))
        .toEqual(rfcExample.foo[0], 'concat 3 failed for "/foo/0"');

    expect(JsonPointer.compile('/foo').concatPointer('#/0').get(rfcExample))
        .toEqual(rfcExample.foo[0], 'concat 3 failed for "/foo/0"');

  });

});
