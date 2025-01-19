import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import type { Hash } from 'crypto'
import { createHash } from 'crypto'

export const computeHash = (directory: string | string[], inputHash?: Hash) => {
  const hash = inputHash ? inputHash : createHash('sha1')

  const paths = Array.isArray(directory) ? directory : [directory]

  for (const path of paths) {
    const statInfo = statSync(path)

    if (statInfo.isDirectory()) {
      const directoryEntries = readdirSync(path, { withFileTypes: true })
      const fullPaths = directoryEntries.map((e) => join(path, e.name))

      computeHash(fullPaths, hash)
    } else {
      const statInfo = statSync(path)
      const fileInfo = `${path}:${statInfo.size}:${statInfo.mtimeMs}`

      hash.update(fileInfo)
    }
  }

  // if not being called recursively, get the digest and return it as the hash result
  if (!inputHash) {
    return hash.digest().toString('base64')
  }

  return
}
