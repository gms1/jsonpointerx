// tslint:disable no-require-imports no-var-requires variable-name no-null-keyword
import * as bm from 'benchmark';
const bbm = require('beautify-benchmark');

import {JsonPointer as JsonPointerX} from 'jsonpointerx';
import { JsonPointer as json_ptr_i } from 'json-ptr';
const jsonpointer_i = require('jsonpointer');
const json_pointer_i = require('json-pointer');


let jpstring = '/l1/l2/l3/l4/l5/l6/l7/l8/l9/l10';
let content: any = {l1: {l2: {l3: {l4: {l5: {l6: {l7: {l8: {l9: {l10: '42'}}}}}}}}}};
let content2: any = {l1: {l2: {l3: {l4: {l5: {l6: {l7: {l8: {l9: null}}}}}}}}};

let jsonpointer = jsonpointer_i.compile(jpstring);
let jsonpointerx = JsonPointerX.compile(jpstring);
let json_ptr = json_ptr_i.create(jpstring);
let json_pointer = json_pointer_i;

let suiteGetDefined = new bm.Suite();
console.log('============================================================');
console.log(`json pointer: get defined property - suite:`);
console.log('------------------------------------------------------------');
suiteGetDefined.add('json_pointer.get', () => json_pointer.get(content, jpstring))
    .add('jsonpointer.get', () => jsonpointer.get(content))
    .add('json-ptr.get', () => json_ptr.get(content))
    .add('jsonpointerx.get', () => jsonpointerx.get(content))
    .on('cycle', (event: bm.Event) => { bbm.add(event.target); })
    .on('complete', () => { bbm.log(); })
    .run({async: true})
    .on('complete', () => {
      console.log('============================================================');
      console.log(`json pointer: get property from 'null' ancestor - suite:`);
      console.log('------------------------------------------------------------');
      bbm.reset();
      let suiteGetUndefined = new bm.Suite();
      suiteGetUndefined
          .add(
              'json_pointer.get',
              () => {
                try {
                  json_pointer.get(content2, jpstring);
                } catch (e) {
                }
              })
          .add(
              'jsonpointer.get',
              () => {
                try {
                  jsonpointer.get(content2);
                } catch (e) {
                }
              })
          .add(
              'json-ptr.get',
              () => {
                try {
                  json_ptr.has(content2);
                } catch (e) {
                }
              })
          .add(
              'jsonpointerx.get',
              () => {
                try {
                  jsonpointerx.get(content2);
                } catch (e) {
                }
              })
          .on('cycle', (event: bm.Event) => { bbm.add(event.target); })
          .on('complete', () => { bbm.log(); })
          .run({async: true})
          .on('complete', () => {
            console.log('============================================================');
            console.log(`json pointer: set property - suite:`);
            console.log('------------------------------------------------------------');
            bbm.reset();
            let suiteSet = new bm.Suite();
            suiteSet.add('json_pointer.set', () => json_pointer.set(content, jpstring, 123))
                .add('jsonpointer.set', () => jsonpointer.set(content, 123))
                .add('json-ptr.set', () => json_ptr.set(content, 123))
                .add('jsonpointerx.set', () => jsonpointerx.set(content, 123))
                .on('cycle', (event: bm.Event) => { bbm.add(event.target); })
                .on('complete', () => { bbm.log(); })
                .run({async: true});
          });
    });
