const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');
const assert = require('node:assert');

const filePath = path.join(__dirname, '..', 'fixtures', 'ts-sample.ts');
const code = fs.readFileSync(filePath, 'utf8');

module.exports = {
  name: 'typescript',
  type: 'operation',
  operations: [
    {
      name: 'transpile',
      fn: () => {
        const r = ts.transpile(
          code,
          {
            // CJS Settings
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.Node,

            // Avoid writing to disk
            noEmit: true,

            // Avoids any checking related code
            checkJs: false,
            strict: false,
            isolatedModules: true,
            skipDefaultLibCheck: true,
            skipLibCheck: true,
          },
          filePath,
        );
        assert.ok(r);
      },
    },
    {
      name: 'createSourceFile',
      fn: () => {
        const r = ts.createSourceFile(
          filePath,
          code,
          ts.ScriptTarget.ESNext,
          false,
          ts.ScriptKind.TS,
        );
        assert.ok(r);
      },
    },
    {
      name: 'getSemanticDiagnostics',
      fn: () => {
        const program = ts.createProgram({
          rootNames: [filePath],
          options: {
            // CJS Settings
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.CommonJS,
            moduleResolution: ts.ModuleResolutionKind.Node,

            // also loads and checks js
            allowJs: true,
            checkJs: true,

            // test types
            strict: true,

            // Avoid writing to disk
            noEmit: true,

            // Loads external files
            isolatedModules: true,
            skipDefaultLibCheck: false,
            skipLibCheck: false,
          },
        });

        program.getSemanticDiagnostics(program.getSourceFile(filePath));
      },
    },
  ],
  benchmarker: 'tinybench',
};
