import { posix as path } from 'path'
import { URL } from 'url'

export const resolver = async (options: {
  specifier: string
  parentURL: URL
}): Promise<{ url: URL }> => {
  const specifier = /^[a-z]+:\/\//.test(options.specifier)
    ? new URL(options.specifier).pathname
    : options.specifier

  const { dir } = path.parse(options.parentURL.pathname)
  const url = new URL(options.parentURL.href)
  url.pathname = path.resolve(dir, specifier)
  return { url }
}
