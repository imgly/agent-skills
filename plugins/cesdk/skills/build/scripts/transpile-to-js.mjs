#!/usr/bin/env node

/**
 * Transpile a CE.SDK starter kit from TypeScript to JavaScript.
 *
 * Converts all .ts files to .js, removes TypeScript config files,
 * updates index.html references, and cleans up package.json.
 *
 * Prerequisites: `typescript` must be installed (npm install typescript).
 *
 * Usage:
 *   node transpile-to-js.mjs <directory>
 *
 * Example:
 *   node .claude/skills/cesdk-build/scripts/transpile-to-js.mjs ./my-project
 */

import ts from 'typescript';
import fs from 'fs';
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

// ---------------------------------------------------------------------------
// 1. Find and transpile all .ts files
// ---------------------------------------------------------------------------

function findTsFiles(dirPath) {
  const results = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...findTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const tsFiles = findTsFiles(root);

for (const tsFile of tsFiles) {
  const source = fs.readFileSync(tsFile, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      removeComments: false,
    },
  });

  const jsFile = tsFile.replace(/\.ts$/, '.js');
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
// 3. Update index.html: change .ts references to .js
// ---------------------------------------------------------------------------

const indexHtml = path.join(root, 'index.html');
if (fs.existsSync(indexHtml)) {
  let html = fs.readFileSync(indexHtml, 'utf8');
  const updated = html.replace(/src="([^"]*?)\.ts"/g, 'src="$1.js"');
  if (updated !== html) {
    fs.writeFileSync(indexHtml, updated, 'utf8');
    console.log('  Updated index.html script references');
  }
}

// ---------------------------------------------------------------------------
// 4. Rename vite.config.ts -> vite.config.js (already transpiled above)
// ---------------------------------------------------------------------------

// The .ts file was already transpiled and renamed in step 1.
// Vite supports vite.config.js natively, no further changes needed.

// ---------------------------------------------------------------------------
// 5. Clean up package.json: remove TS-only devDependencies
// ---------------------------------------------------------------------------

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

  if (changed) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('  Cleaned TypeScript dependencies from package.json');
  }
}

console.log(`\nDone! Converted ${tsFiles.length} file(s) to JavaScript.`);
