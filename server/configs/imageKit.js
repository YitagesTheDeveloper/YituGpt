import ImageKit from '@imagekit/nodejs'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  // baseURL is optional; keep default unless overridden
  baseURL: process.env.IMAGE_KIT_BASE_URL || undefined,
})

export default imagekit


