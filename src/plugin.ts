import { URL } from 'url'

type Matcher = (url: URL) => boolean

export interface Plugin<T> {
  test: RegExp | Matcher
  handler: T
}

export const find = <T> (plugins: Plugin<T>[], url: URL) => plugins.find(plugin => {
  if (typeof plugin.test === 'function') return plugin.test(url)
  return plugin.test.test(url.href)
})


export type Resolver = (options: { specifier: string; parentURL: URL }) => Promise<{ url: URL }>
export type Loader = (options: { url: URL }) => Promise<{ code: string; meta?: any }>
export type Transpiler = (options: { code: string }) => Promise<{ code: string; meta?: any }>
