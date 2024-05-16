const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');

const filePath = path.join(__dirname, '..', 'fixtures', 'ts-sample.ts');

const code = fs.readFileSync(filePath, 'utf8');

/** @type {import('typescript').CompilerOptions} */
const compilerOptions = {
  // also loads and checks js
  allowJs: true,
  checkJs: true,

  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,

  // test types
  strict: true,

  // loads all declarations
  isolatedModules: false,
  skipDefaultLibCheck: false,
  skipLibCheck: false
};

module.exports = {
  name: 'typescript',
  type: 'operation',
  operations: [
    {
      name: 'transpile',
      fn: () => {
        ts.transpileModule(code, {
          compilerOptions: compilerOptions,
          fileName: filePath,
          reportDiagnostics: true
        });
      }
    },
    {
      name: 'createSourceFile',
      fn: () => {
        ts.createSourceFile(
          filePath,
          code,
          ts.ScriptTarget.ESNext,
          true,
          ts.ScriptKind.TS
        );
      }
    },
    {
      name: 'getTypeChecker',
      fn: () => {
        ts.createProgram({
          rootNames: [filePath],
          options: compilerOptions
        }).getTypeChecker();
      }
    }
  ],
  benchmarker: 'tinybench'
};
