type Matcher = (url: URL) => boolean

export interface Plugin<T> {
  test: Matcher | string | RegExp
  handler: T
}

const test = <T> (plugin: Plugin<T>, url: URL): boolean => {
  if (typeof plugin.test === 'function') return plugin.test(url)
  if (typeof plugin.test === 'string') return plugin.test === url.href
  if (plugin.test instanceof RegExp) return plugin.test.test(url.href)
  throw new TypeError('invalid plugin.test')
}

export const find = <T> (plugins: Iterable<Plugin<T>>, url: URL) => {
  for (const plugin of plugins) if (test(plugin, url)) return plugin
}


export type Resolver = (options: { specifier: string; parentURL: URL }) => Promise<{ url: URL }>
export type Loader = (options: { url: URL }) => Promise<{ code: string; meta?: any }>
export type Transpiler = (options: { code: string }) => Promise<{ code: string; meta?: any }>
