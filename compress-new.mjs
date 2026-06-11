import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const publicDir = './public'
const MAX_WIDTH = 2560
const QUALITY = 82

const newFiles = [
  '11052026-DSCF0007.jpeg',
  '11052026-DSCF0009-2.jpeg',
  '11052026-DSCF0019-2.jpeg',
  '11052026-DSCF0022-2.jpeg',
  '11052026-DSCF0085.jpeg',
  '11052026-DSCF0099.jpeg',
  '11052026-DSCF0210.jpeg',
  '12052026-DJI_20260512110956_0928_D.jpeg',
  '12052026-DSCF0070.jpeg',
  '12052026-DSCF0084.jpeg',
  '12052026-DSCF0095.jpeg',
  '12052026-DSCF0180.jpeg',
  '12052026-DSCF0363-HDR.jpeg',
  '12052026-DSCF0390.jpeg',
  '12052026-DSCF0396.jpeg',
  '12052026-DSCF0431.jpeg',
  '12052026-DSCF0501.jpeg',
  '12052026-DSCF0534.jpeg',
  '12052026-DSCF0563.jpeg',
  '12052026-DSCF0601.jpeg',
  '12052026-DSCF0638.jpeg',
  '12052026-DSCF0667.jpeg',
  '12052026-DSCF0709.jpeg',
  '12052026-DSCF0806.jpeg',
  'Foto Capa 2.jpeg',
  'Foto Capa 3.jpeg',
  'Foto Capa1.jpeg',
]

let totalBefore = 0
let totalAfter = 0

for (const file of newFiles) {
  const path = join(publicDir, file)
  const before = (await stat(path)).size
  totalBefore += before

  await sharp(path)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(path + '.tmp')

  const { rename } = await import('fs/promises')
  await rename(path + '.tmp', path)

  const after = (await stat(path)).size
  totalAfter += after

  const pct = (((before - after) / before) * 100).toFixed(0)
  console.log(`${file}: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB (-${pct}%)`)
}

console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(0)}MB → ${(totalAfter/1024/1024).toFixed(0)}MB (-${(((totalBefore-totalAfter)/totalBefore)*100).toFixed(0)}%)`)
