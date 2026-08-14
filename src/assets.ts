/**
 * assets.ts — the one place that decides where a picture lives.
 *
 * THE IDEA (borrowed from nyblnet/bento, MIT — see docs/CREDITS.md)
 *
 * A slide never contains a picture. It contains a *reference* to one:
 *
 *     <img src="asset:a3f19c22.jpg">
 *
 * Every picture goes into one flat table, keyed by a hash of its own bytes.
 * At the very end of the build, ONE function turns each reference into a real
 * `src` — and that function is the entire inline-vs-folder switch:
 *
 *     mode 'inline'  ->  src="data:image/jpeg;base64,/9j/4AAQ..."   (fat file, one thing to send)
 *     mode 'folder'  ->  src="assets/a3f19c22.jpg"                  (small file + a folder)
 *
 * Because the reference is indirect, nothing upstream — not the Markdown, not
 * the renderer, not the templates — knows or cares which mode is active.
 *
 * Two things fall out of the design for free:
 *
 *   1. DEDUPLICATION. The key is a content hash, so the same logo used on
 *      twenty slides is stored once and written once. Byte-identical files with
 *      different names collapse into one asset.
 *
 *   2. VALIDATION. Every reference is a lookup, so a picture that never made it
 *      into the table is a dangling key we can detect and fail on, instead of a
 *      silently broken image in a book someone already emailed out.
 */

import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join, resolve as resolvePath } from 'node:path'

/** Where the pictures end up. The whole choice, in one type. */
export type AssetMode = 'inline' | 'folder'

/** The prefix that marks a string as a reference rather than a real URL. */
export const ASSET_PREFIX = 'asset:'

export interface AssetRecord {
  /** Content-derived filename, e.g. `a3f19c22.jpg`. Stable across builds. */
  readonly key: string
  readonly bytes: Uint8Array
  readonly mime: string
  /** Every source path that resolved to these bytes (>1 means we deduped). */
  readonly sources: string[]
}

/** What a finished build did with its pictures — reported to the user. */
export interface AssetReport {
  mode: AssetMode
  count: number
  totalBytes: number
  /** Assets that appeared more than once and were stored only once. */
  deduped: number
  /** Written files, folder mode only. */
  files: string[]
}

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
}

/** True for anything already usable as-is: absolute URLs and data URIs. */
export function isExternalRef(src: string): boolean {
  return /^(https?:|data:|blob:|#|mailto:)/i.test(src)
}

export function isAssetRef(src: string): boolean {
  return src.startsWith(ASSET_PREFIX)
}

export class MissingAssetError extends Error {
  // Assigned by hand rather than as `constructor(readonly sourcePath: string)`.
  // A parameter property is one of the few pieces of TypeScript that EMITS code
  // rather than only describing types, so Node's strip-only type removal
  // refuses it — and this single line was the one thing standing between "this
  // skill requires Bun" and "this skill runs on stock Node". Worth the four
  // extra lines.
  readonly sourcePath: string
  readonly referencedFrom: string

  constructor(sourcePath: string, referencedFrom: string) {
    super(
      `Picture not found: ${sourcePath}\n` +
      `  referenced from: ${referencedFrom}\n` +
      `  Check the path is right and relative to the Markdown file.`,
    )
    this.name = 'MissingAssetError'
    this.sourcePath = sourcePath
    this.referencedFrom = referencedFrom
  }
}

export class AssetStore {
  /** content hash -> record. The hash IS the identity, so dedup is automatic. */
  readonly #byHash = new Map<string, AssetRecord>()
  /** absolute source path -> hash, so re-adding the same file is a no-op. */
  readonly #byPath = new Map<string, string>()

  /**
   * Read a picture off disk and put it in the table.
   *
   * @param sourcePath  path as written by the author (relative to `baseDir`)
   * @param baseDir     directory the Markdown file lives in
   * @param referencedFrom  human-readable location, used only in error text
   * @returns an `asset:<key>` reference to embed in the HTML
   */
  async add(sourcePath: string, baseDir: string, referencedFrom = 'the book'): Promise<string> {
    const abs = resolvePath(baseDir, sourcePath)

    const seen = this.#byPath.get(abs)
    if (seen) return ASSET_PREFIX + this.#byHash.get(seen)!.key

    let bytes: Uint8Array
    try {
      bytes = await readFile(abs)
    } catch {
      throw new MissingAssetError(sourcePath, referencedFrom)
    }
    return this.addBytes(bytes, extname(abs) || '.bin', abs, referencedFrom)
  }

  /**
   * Put raw bytes in the table. Used for generated artwork (an SVG we built)
   * as well as files read from disk — both go through the same dedup.
   */
  addBytes(bytes: Uint8Array, ext: string, sourceLabel: string, _referencedFrom = ''): string {
    const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 8)
    const existing = this.#byHash.get(hash)

    if (existing) {
      // Byte-identical to something already stored: reuse it, record the alias.
      if (!existing.sources.includes(sourceLabel)) existing.sources.push(sourceLabel)
      this.#byPath.set(sourceLabel, hash)
      return ASSET_PREFIX + existing.key
    }

    const normalisedExt = ext.startsWith('.') ? ext.toLowerCase() : `.${ext.toLowerCase()}`
    const record: AssetRecord = {
      key: `${hash}${normalisedExt}`,
      bytes,
      mime: MIME_BY_EXT[normalisedExt] ?? 'application/octet-stream',
      sources: [sourceLabel],
    }
    this.#byHash.set(hash, record)
    this.#byPath.set(sourceLabel, hash)
    return ASSET_PREFIX + record.key
  }

  get size(): number {
    return this.#byHash.size
  }

  all(): AssetRecord[] {
    return [...this.#byHash.values()]
  }

  #findByKey(key: string): AssetRecord | undefined {
    for (const rec of this.#byHash.values()) if (rec.key === key) return rec
    return undefined
  }

  /**
   * ── THE SWITCH ──────────────────────────────────────────────────────────
   * Turn one `asset:<key>` reference into a real `src` value.
   *
   * This is the only function in the codebase that knows the difference
   * between the two output modes. Everything else just passes references
   * around.
   */
  resolve(ref: string, mode: AssetMode, assetDirName = 'assets'): string {
    if (!isAssetRef(ref)) return ref

    const key = ref.slice(ASSET_PREFIX.length)
    const rec = this.#findByKey(key)
    if (!rec) {
      // A reference with nothing behind it. Caller decides whether to throw;
      // returning the ref verbatim makes the breakage visible in the output
      // rather than rendering a confusing blank.
      return ref
    }

    return mode === 'inline'
      ? `data:${rec.mime};base64,${Buffer.from(rec.bytes).toString('base64')}`
      : `${assetDirName}/${rec.key}`
  }

  /** Rewrite every `asset:` reference in a finished HTML string. */
  resolveAll(html: string, mode: AssetMode, assetDirName = 'assets'): string {
    return html.replace(
      /asset:([A-Za-z0-9]+\.[A-Za-z0-9]+)/g,
      (whole) => this.resolve(whole, mode, assetDirName),
    )
  }

  /**
   * Every reference in `html` that has no asset behind it.
   * A non-empty result means the book would ship with broken pictures.
   */
  danglingRefs(html: string): string[] {
    const found = new Set<string>()
    for (const [, key] of html.matchAll(/asset:([A-Za-z0-9]+\.[A-Za-z0-9]+)/g)) {
      if (!this.#findByKey(key)) found.add(key)
    }
    return [...found]
  }

  /**
   * Write the pictures next to the HTML. No-op in inline mode, because in
   * inline mode the pictures are already *in* the HTML.
   */
  async writeFolder(outDir: string, mode: AssetMode, assetDirName = 'assets'): Promise<AssetReport> {
    const records = this.all()
    const report: AssetReport = {
      mode,
      count: records.length,
      totalBytes: records.reduce((n, r) => n + r.bytes.byteLength, 0),
      deduped: records.filter((r) => r.sources.length > 1).length,
      files: [],
    }
    if (mode === 'inline' || records.length === 0) return report

    const dir = join(outDir, assetDirName)
    await mkdir(dir, { recursive: true })
    for (const rec of records) {
      const path = join(dir, rec.key)
      await writeFile(path, rec.bytes)
      report.files.push(`${assetDirName}/${rec.key}`)
    }
    return report
  }

  /** Human-readable one-liner for the build log. */
  static describe(report: AssetReport): string {
    if (report.count === 0) return 'no pictures'
    const kb = (report.totalBytes / 1024).toFixed(0)
    const dedup = report.deduped ? `, ${report.deduped} reused` : ''
    return report.mode === 'inline'
      // A book with one picture reported "1 pictures". Small, and it is the
      // last line the author reads after every single build.
      ? `${report.count} ${report.count === 1 ? 'picture' : 'pictures'} packed inside the file (${kb} KB${dedup})`
      : `${report.count} ${report.count === 1 ? 'picture' : 'pictures'} written to ./assets/ (${kb} KB${dedup})`
  }
}

/** Pretty name for a source path, used in error messages. */
export function label(path: string): string {
  return basename(path)
}
