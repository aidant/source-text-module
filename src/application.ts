import { Cache } from './cache'
import { SourceTextModule, createContext } from 'vm'
import { URL } from 'url'
import { Plugin, Resolver, Loader, Transpiler, find } from './plugin'
import { decorateErrorStack } from 'internal/util'

interface Options {
  scope?: object
  resolver: Resolver
  loaders: Plugin<Loader>[]
  transpilers?: Plugin<Transpiler>[]
}

export const application = ({
  scope = Object.create(null),
  resolver,
  loaders,
  transpilers = []
}: Options) => {
  const cache = new Cache<SourceTextModule>()
  const context = createContext(scope)

  const importModuleDynamically = async (
    specifier: string,
    parentModule: { url: string }
  ): Promise<SourceTextModule> => {
    const source = await linker(specifier, parentModule)
    source.instantiate()
    await source.evaluate()
    return source
  }

  const linker = async (
    specifier: string,
    parentModule: { url: string }
  ): Promise<SourceTextModule> => {
    const { url } = await resolver({ specifier, parentURL: new URL(parentModule.url) })

    if (cache.has(url)) return cache.get(url)

    const loader = find(loaders, url)
    if (!loader) throw new Error('no loader mate')
    const transpiler = find(transpilers, url)

    const loaded = await loader.handler({ url })
    const transpiled = transpiler && (await transpiler.handler({ code: loaded.code }))

    const code = transpiled ? transpiled.code : loaded.code

    let source: SourceTextModule
    try {
      source = new SourceTextModule(code, {
        context,
        url: url.href,
        importModuleDynamically,
        initializeImportMeta: meta =>
          Object.assign(meta, { url: url.href }, loaded.meta, transpiled && transpiled.meta)
      })
    } catch (error) {
      decorateErrorStack(error)
      throw error
    }

    cache.add(url, source)
    await source.link(linker)
    return source
  }

  return {
    cache,
    run: (specifier: string, { url = new URL(process.cwd(), 'file:') } = {}) =>
      importModuleDynamically(specifier, { url: url.href })
  }
}
