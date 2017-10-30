// tslint:disable no-require-imports no-var-requires variable-name no-null-keyword
import * as bm from 'benchmark';
const bbm = require('beautify-benchmark');

import { JsonPointer as JsonPointerX } from 'jsonpointerx';

let content: any = { l1: { l2: { l3: { l4: { l5: { l6: { l7: { l8: { l9: { l10: '42' } } } } } } } } } };

let jpstring10 = '/l1/l2/l3/l4/l5/l6/l7/l8/l9/l10';
let jpstring5 = '/l1/l2/l3/l4/l5';
let jpstring1 = '/l1';


let suiteGet10 = new bm.Suite();
console.log('============================================================');
console.log(`json pointer: level 10:`);
console.log('------------------------------------------------------------');
suiteGet10
  .add('compiled get', () => {
    let jpCompiled = JsonPointerX.compile(jpstring10);
    jpCompiled.get(content);
  })
  .add('non compiled get', () => {
    let jpNonCompiled = JsonPointerX.compile(jpstring10);
    jpNonCompiled.get(content);
  })
  .on('cycle', (event: bm.Event) => { bbm.add(event.target); })
  .on('complete', () => { bbm.log(); })
  .run({ async: true })
  .on('complete', () => {
    console.log('============================================================');
    console.log(`json pointer: level 5:`);
    console.log('------------------------------------------------------------');
    bbm.reset();
    let suiteGet5 = new bm.Suite();
    suiteGet5
      .add('compiled get', () => {
        let jpCompiled = JsonPointerX.compile(jpstring5);
        jpCompiled.get(content);
      })
      .add('non compiled get', () => {
        let jpNonCompiled = JsonPointerX.compile(jpstring5);
        jpNonCompiled.get(content);
      })
      .on('cycle', (event: bm.Event) => { bbm.add(event.target); })
      .on('complete', () => { bbm.log(); })
      .run({ async: true })
      .on('complete', () => {
        console.log('============================================================');
        console.log(`json pointer: level 1:`);
        console.log('------------------------------------------------------------');
        bbm.reset();
        let suiteGet1 = new bm.Suite();
        suiteGet1
          .add('compiled get', () => {
            let jpCompiled = JsonPointerX.compile(jpstring1);
            jpCompiled.get(content);
          })
          .add('non compiled get', () => {
            let jpNonCompiled = JsonPointerX.compile(jpstring1);
            jpNonCompiled.get(content);
          })
          .on('cycle', (event: bm.Event) => { bbm.add(event.target); })
          .on('complete', () => { bbm.log(); })
          .run({ async: true });
      });
  });
