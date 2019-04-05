import { URL } from 'url'

export class Cache<T> {
  private cache: { [href: string]: T } = {}

  add (url: URL, module: T) {
    this.cache[url.href] = module
  }

  get (url: URL): T {
    return this.cache[url.href]
  }

  has (url: URL): boolean {
    return url.href in this.cache
  }
}
