const fromJpStringSearch: RegExp = /~[01]/g;
const toJpStringSearch: RegExp = /[~\/]/g;

export class JsonPointer {
  private segments: string[];
  private fnGet: (input: string) => any;

  constructor(segments?: string|string[], noCompile?: boolean) {
    if (segments) {
      if (Array.isArray(segments)) {
        this.segments = segments;
      } else {
        this.segments = [segments];
      }
    } else {
      this.segments = [];
    }
    if (!noCompile) {
      this.compileFunctions();
    }
  }

  get(input: any): any { return this.fnGet(input); }


  /**
   * set value
   *
   * @param input
   * @param [value]
   * @returns       returns 'value' if pointer.length === 1 or 'input' otherwise
   *
   * throws if 'input' is not an object
   * throws if one of the ancestors is a scalar
   */
  set(input: any, value?: any): any {
    if (typeof input !== 'object') {
      throw new Error('Invalid input object.');
    }
    if (this.segments.length === 0) {
      throw new Error(`setting via root JSON pointer is not allowed.`);
    }

    const len = this.segments.length - 1;
    let node = input;
    let nextnode: any;
    let part: string;

    for (let idx = 0; idx < len;) {
      if (node === null || typeof node !== 'object') {
        throw new Error(`Invalid JSON pointer reference (level ${idx}).`);
      }
      part = this.segments[idx++];
      nextnode = node[part];
      if (nextnode === undefined) {
        if (this.segments[idx] === '-') {
          nextnode = [];
        } else {
          nextnode = {};
        }
        if (Array.isArray(node)) {
          if (part === '-') {
            node.push(nextnode);
          } else {
            let i = parseInt(part, 10);
            if (isNaN(i)) {
              throw Error(`Invalid JSON pointer array index reference (level ${idx}).`);
            }
            node[i] = nextnode;
          }
        } else {
          node[part] = nextnode;
        }
      }
      node = nextnode;
    }

    if (value === undefined) {
      delete node[this.segments[len]];
    } else {
      if (Array.isArray(node)) {
        let i = parseInt(this.segments[len], 10);
        if (isNaN(i)) {
          throw Error(`Invalid JSON pointer array index reference at end of pointer.`);
        }
        node[i] = value;
      } else {
        if (typeof node !== 'object') {
          throw new Error(`Invalid JSON pointer reference at end of pointer.`);
        }
        node[this.segments[len]] = value;
      }
    }
    return input;
  }

  concat(p: JsonPointer): JsonPointer { return new JsonPointer(this.segments.concat(p.segments)); }
  concatSegment(segment: string|string[]): JsonPointer { return new JsonPointer(this.segments.concat(segment)); }
  concatPointer(pointer: string): JsonPointer { return this.concat(JsonPointer.compile(pointer)); }

  toString(): string {
    if (this.segments.length === 0) {
      return '';
    }
    return '/'.concat(
        // tslint:disable-next-line: no-unbound-method
        this.segments.map((v: string) => v.replace(toJpStringSearch, JsonPointer.toJpStringReplace)).join('/'));
  }

  toURIFragmentIdentifier(): string {
    if (this.segments.length === 0) {
      return '#';
    }
    return '#/'.concat(
        // tslint:disable-next-line: no-unbound-method
        this.segments.map((v: string) => encodeURIComponent(v).replace(toJpStringSearch, JsonPointer.toJpStringReplace))
            .join('/'));
  }

  private compileFunctions(): void {
    let body = '';

    for (let idx = 0; idx < this.segments.length;) {
      let segment = this.segments[idx++].replace(/\\/g, '\\\\');
      body += `
      if (node == undefined) return undefined;
      node = node['${segment}'];
      `;
    }
    body += `
      return node;
    `;
    this.fnGet = new Function('node', body) as(input: string) => any;
  }

  static compile(pointer: string, decodeOnly?: boolean): JsonPointer {
    let segments = pointer.split('/');
    let firstSegment = segments.length >= 1 ? segments.shift() : undefined;
    if (firstSegment === '') {
      return new JsonPointer(
          // tslint:disable-next-line: no-unbound-method
          segments.map((v: string) => v.replace(fromJpStringSearch, JsonPointer.fromJpStringReplace)), decodeOnly);
    }
    if (firstSegment === '#') {
      return new JsonPointer(
          segments.map(
              // tslint:disable-next-line: no-unbound-method
              (v: string) => decodeURIComponent(v.replace(fromJpStringSearch, JsonPointer.fromJpStringReplace))),
          decodeOnly);
    }
    throw new Error(`JSON pointer '${pointer}' is invalid.`);
  }

  static get(obj: any, pointer: string): any {
    let jp = JsonPointer.compile(pointer, true);
    return jp.get(obj);
  }
  static set(obj: any, pointer: string, value: any): any {
    let jp = JsonPointer.compile(pointer, true);
    return jp.set(obj, value);
  }

  static fromJpStringReplace(v: string): string {
    switch (v) {
      case '~1':
        return '/';
      case '~0':
        return '~';
    }
    throw new Error('JsonPointer.escapedReplacer: this should not happen');
  }

  static toJpStringReplace(v: string): string {
    switch (v) {
      case '/':
        return '~1';
      case '~':
        return '~0';
    }
    throw new Error('JsonPointer.unescapedReplacer: this should not happen');
  }
}
