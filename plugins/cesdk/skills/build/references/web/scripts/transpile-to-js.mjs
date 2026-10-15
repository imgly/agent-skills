#!/usr/bin/env node

/**
 * Transpile a CE.SDK starter kit from TypeScript to JavaScript.
 *
 * Converts all .ts files to .js and .tsx files to .jsx, removes TypeScript
 * config files, updates index.html references, removes TypeScript
 * dependencies and the `tsc` steps from package.json, and drops README lines
 * for the scripts that no longer exist.
 *
 * Prerequisites: TypeScript 5 must be installed in the project being
 * converted (npm install --no-save typescript@5).
 *
 * Usage:
 *   node transpile-to-js.mjs <directory>
 *
 * Example:
 *   node .claude/skills/cesdk-build/scripts/transpile-to-js.mjs ./my-project
 */

import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

const dir = process.argv[2];
if (!dir) {
  console.error('Usage: node transpile-to-js.mjs <directory>');
  process.exit(1);
}

const root = path.resolve(dir);
if (!fs.existsSync(root)) {
  console.error(`Directory not found: ${root}`);
  process.exit(1);
}

// The script ships inside the skill folder, which has no node_modules, so
// typescript is resolved from the project being converted.
let ts;
try {
  ts = createRequire(path.join(root, 'package.json'))('typescript');
} catch (error) {
  if (error.code !== 'MODULE_NOT_FOUND') throw error;
  console.error(
    `Cannot find the typescript package in ${root}.\n` +
      `Install it there first: cd ${root} && npm install --no-save typescript@5`
  );
  process.exit(1);
}
if (typeof ts.transpileModule !== 'function') {
  console.error(
    `typescript ${ts.version} in ${root} has no transpileModule API. ` +
      `Install TypeScript 5 instead: npm install --no-save typescript@5`
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 1. Find and transpile all .ts and .tsx files
// ---------------------------------------------------------------------------

function findTsFiles(dirPath) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...findTsFiles(fullPath));
    } else if (
      entry.isFile() &&
      /\.tsx?$/.test(entry.name) &&
      !entry.name.endsWith('.d.ts')
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

const tsFiles = findTsFiles(root);

for (const tsFile of tsFiles) {
  const source = fs.readFileSync(tsFile, 'utf8');
  const result = ts.transpileModule(source, {
    fileName: tsFile,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      jsx: ts.JsxEmit.Preserve,
      removeComments: false,
    },
  });

  const jsFile = tsFile.replace(/\.ts(x?)$/, '.js$1');
  fs.writeFileSync(jsFile, result.outputText, 'utf8');
  fs.unlinkSync(tsFile);
  console.log(`  ${path.relative(root, tsFile)} -> ${path.relative(root, jsFile)}`);
}

// ---------------------------------------------------------------------------
// 2. Remove TypeScript config files
// ---------------------------------------------------------------------------

for (const file of ['tsconfig.json', 'tsconfig.base.json']) {
  const filePath = path.join(root, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  Removed ${file}`);
  }
}

// ---------------------------------------------------------------------------
// 3. Update index.html: change .ts/.tsx references to .js/.jsx
// ---------------------------------------------------------------------------

const indexHtml = path.join(root, 'index.html');
if (fs.existsSync(indexHtml)) {
  let html = fs.readFileSync(indexHtml, 'utf8');
  const updated = html.replace(/src="([^"]*?)\.ts(x?)"/g, 'src="$1.js$2"');
  if (updated !== html) {
    fs.writeFileSync(indexHtml, updated, 'utf8');
    console.log('  Updated index.html script references');
  }
}

// ---------------------------------------------------------------------------
// 4. Clean up package.json: remove TS-only devDependencies and tsc steps
// ---------------------------------------------------------------------------

function removeTscSteps(scripts) {
  const result = {};
  for (const [name, command] of Object.entries(scripts)) {
    const kept = command
      .split('&&')
      .map((step) => step.trim())
      .filter((step) => !/^tsc(\s|$)/.test(step));
    if (kept.length > 0) result[name] = kept.join(' && ');
  }
  return result;
}

let removedScripts = [];
const pkgPath = path.join(root, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  const tsDevDeps = [
    'typescript',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
  ];

  let changed = false;
  if (pkg.devDependencies) {
    for (const dep of tsDevDeps) {
      if (pkg.devDependencies[dep]) {
        delete pkg.devDependencies[dep];
        changed = true;
      }
    }
  }

  if (pkg.scripts) {
    const scripts = removeTscSteps(pkg.scripts);
    removedScripts = Object.keys(pkg.scripts).filter((name) => !(name in scripts));
    if (JSON.stringify(scripts) !== JSON.stringify(pkg.scripts)) {
      pkg.scripts = scripts;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('  Cleaned TypeScript dependencies and scripts from package.json');
  }
}

// ---------------------------------------------------------------------------
// 5. Update README.md: drop lines that document a removed script
// ---------------------------------------------------------------------------

const readmePath = path.join(root, 'README.md');
if (removedScripts.length > 0 && fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const lines = readme
    .split('\n')
    .filter(
      (line) =>
        !removedScripts.some((name) => {
          const command = `npm run ${name}`;
          const at = line.indexOf(command);
          return at !== -1 && !/[\w:-]/.test(line[at + command.length] ?? '');
        })
    );
  const updated = lines.join('\n');
  if (updated !== readme) {
    fs.writeFileSync(readmePath, updated, 'utf8');
    console.log('  Removed README.md lines for scripts that no longer exist');
  }
}

console.log(`\nDone! Converted ${tsFiles.length} file(s) to JavaScript.`);
