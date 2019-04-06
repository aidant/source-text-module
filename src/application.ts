import { Cache } from './cache'
import { SourceTextModule, createContext } from 'vm'
import { URL } from 'url'

type Resolver = (options: { specifier: string; parentURL: URL }) => Promise<{ url: URL }>
type Loader = (options: { url: URL }) => Promise<{ code: string; meta?: any }>
type Transpiler = (options: { code: string }) => Promise<{ code: string; meta?: any }>

interface Plugin<T> {
  test: (url: URL) => boolean
  handler: T
}

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

  const linker = async (
    specifier: string,
    parentModule: { url: string }
  ): Promise<SourceTextModule> => {
    const { url } = await resolver({ specifier, parentURL: new URL(parentModule.url) })

    if (cache.has(url)) return cache.get(url)

    const loader = loaders.find(loader => loader.test(url))
    if (!loader) throw new Error('no loader mate')
    const transpiler = transpilers.find(transpiler => transpiler.test(url))

    const loaded = await loader.handler({ url })
    const transpiled = transpiler && (await transpiler.handler({ code: loaded.code }))

    const source = new SourceTextModule((transpiled && transpiled.code) || loaded.code, {
      context,
      url: url.href,
      importModuleDynamically: linker,
      initializeImportMeta: meta =>
        Object.assign(meta, { url: url.href }, loaded.code, transpiled && transpiled.code)
    })

    cache.add(url, source)
    await source.link(linker)
    return source
  }

  return {
    async run(specifier: string, baseURL: URL) {
      const source = await linker(specifier, { url: baseURL.href })
      source.instantiate()
      await source.evaluate()
    }
  }
}
