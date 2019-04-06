import { SourceTextModule, createContext } from 'vm'
import { URL } from 'url'

import { Cache } from './cache'
import { Resolver, runResolvers } from './run-resolvers'
import { Loader, runLoaders } from './run-loaders'
import { Transpiler, runTranspilers } from './run-transpilers'

export interface Options {
  context: object
  entry: string
  baseURL: URL
  resolvers: Resolver[]
  loaders: Loader[]
  transpilers: Transpiler[]
}

export const application = async (options: Options) => {
  const cache = new Cache<SourceTextModule>()

  const linker = async (
    specifier: string,
    parentModule: { url: string }
  ): Promise<SourceTextModule> => {
    const resolved = await runResolvers(options.resolvers, {
      specifier,
      parentURL: new URL(parentModule.url)
    })

    if (cache.has(resolved.url)) return cache.get(resolved.url)

    const loaded = await runLoaders(options.loaders, resolved)

    const transpiled = await runTranspilers(options.transpilers, {
      code: loaded.code,
      ext: loaded.ext
    })

    const source = new SourceTextModule(transpiled.code, {
      url: resolved.url.href,
      context: createContext(options.context),
      initializeImportMeta: meta =>
        Object.assign(
          meta,
          { url: resolved.url.href },
          loaded.meta,
          transpiled.meta
        )
    })

    cache.add(resolved.url, source)
    await source.link(linker)
    return source
  }

  const source = await linker(options.entry, { url: options.baseURL.href })
  source.instantiate()
  await source.evaluate()
}
