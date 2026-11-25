#!/usr/bin/env node
// Thêm đuôi file vào import tương đối trong các .d.ts đã emit.
//
// Package khai "type": "module" nên TypeScript coi .d.ts là ES module; với
// moduleResolution node16/nodenext, import tương đối PHẢI có đuôi file
// (TS2834). tsc (moduleResolution bundler) giữ nguyên specifier không đuôi từ
// source → mọi re-export resolve thất bại và thành `any` (issue #13).
//
// Script đổi './button' → './button.js', './pro-table' → './pro-table/index.js'
// (TypeScript map .js → .d.ts). Vẫn đúng với moduleResolution bundler/node10.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROOT = resolve(process.argv[2] ?? 'dist')

// from '…' | import('…') | import '…'  — chỉ specifier tương đối không có đuôi.
const SPECIFIER = /(\bfrom\s+|\bimport\s*\(\s*|\bimport\s+)(['"])(\.{1,2}\/[^'"]*?)\2/g
const HAS_EXT = /\.(js|mjs|cjs|json|css|svg|png)$/

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (name.endsWith('.d.ts')) out.push(p)
  }
  return out
}

function resolveSpecifier(fromFile, spec) {
  if (HAS_EXT.test(spec)) return spec
  const base = resolve(dirname(fromFile), spec)
  if (existsSync(`${base}.d.ts`)) return `${spec}.js`
  if (existsSync(join(base, 'index.d.ts'))) return `${spec.replace(/\/$/, '')}/index.js`
  return null
}

let files = 0
let rewritten = 0
const unresolved = []
for (const file of walk(ROOT)) {
  const src = readFileSync(file, 'utf8')
  const out = src.replace(SPECIFIER, (m, head, q, spec) => {
    const next = resolveSpecifier(file, spec)
    if (next === null) {
      unresolved.push(`${file}: ${spec}`)
      return m
    }
    if (next !== spec) rewritten++
    return `${head}${q}${next}${q}`
  })
  if (out !== src) {
    writeFileSync(file, out)
    files++
  }
}

if (unresolved.length) {
  console.error(`fix-dts-extensions: không resolve được ${unresolved.length} import:\n  ${unresolved.join('\n  ')}`)
  process.exit(1)
}
console.log(`fix-dts-extensions: ${rewritten} import trong ${files} file .d.ts`)
