'use strict';

function config(target /* 'production' or 'development' */) {
  var tsLintTask = target === 'production' ? 'ts:lint:full' : 'ts:lint';

  return {
    outDir: './dist',

    tasks: [
      {
        name: 'dist:packageJson',
        operation: {
          type: 'jsonTransform',
          src: 'package.json',
          transform: (data, file) => {
            delete data.scripts;
            delete data.devDependencies;
            return data;
          },
          whitespace: 2
        }
      },
      {
        name: 'dist:copyMainFiles',
        operation: {
          type: 'copyFile',
          src: '{README.md,LICENSE,.npmignore}',
        }
      },
      {
        name: 'dist:files',
        deps: ['dist:packageJson', 'dist:copyMainFiles'],
      },
      {
        name: 'ts:tsc:main',
        operation: {
          type: 'typescript',
          watch: true,
          tsConfigFile: 'tsconfig.json'
          // tsLintFile: 'tslint.json'
        }
      },
      {
        name: 'ts:tsc:module',
        operation: {
          type: 'typescript',
          tsConfigFile: 'tsconfig.module.json',
        }
      },
      {
        name: 'ts:tsc',
        deps: ['ts:tsc:main', 'ts:tsc:module'],
      },
      {
        name: 'ts:lint',
        operation: {
          type: 'tslint',
          src: './src/**/*.ts',
          tsLintFile: 'tslint.json',
        }
      },
      {
        name: 'rollup:main',
        deps: ['ts:tsc'],
        operation: {
          type: 'rollup',
          rollupConfigFile: './rollup.config.lib.umd.js',
          addMinified: false,
        }
      },
      {
        name: 'ts:lint:full',
        operation: {type: 'tslint', src: './src/**/*.ts', tsLintFile: 'tslint.full.json', typeChecking: true}
      },
      {name: 'build', deps: ['dist:files', 'rollup:main', tsLintTask]},
      {name: 'test', deps: ['build'], operation: {type: 'jasmine', src: './dist/*.spec.js'}}
    ]

  };
}



// run:
require('./build/gulp/index').run(config, __dirname);
