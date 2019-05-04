import { SourceTextModule, createContext, Context } from 'vm'
import { Plugin, Resolver, Loader, Transpiler, find } from './plugin.js'

interface Options {
  context?: object
  resolver: Resolver
  loaders: Iterable<Plugin<Loader>>
  transpilers?: Iterable<Plugin<Transpiler>>
}

export class Application {
  private context: Context
  private resolver: Resolver
  private loaders: Iterable<Plugin<Loader>>
  private transpilers: Iterable<Plugin<Transpiler>>

  public cache = new Map<string, SourceTextModule>()

  constructor(options: Options) {
    this.context = createContext(options.context || Object.create(null))
    this.resolver = options.resolver
    this.loaders = options.loaders
    this.transpilers = options.transpilers || []

    this.initializeImportMeta = this.initializeImportMeta.bind(this)
    this.linker = this.linker.bind(this)
    this.importModuleDynamically = this.importModuleDynamically.bind(this)
  }

  private initializeImportMeta(url: URL, loadedMeta: any, transpiledMeta: any) {
    return (meta: any) => Object.assign(meta, { url: url.href }, loadedMeta, transpiledMeta)
  }

  private async linker(
    specifier: string,
    parentModule: { url: string }
  ): Promise<SourceTextModule> {
    const { url } = await this.resolver({ specifier, parentURL: new URL(parentModule.url) })

    let source: SourceTextModule = this.cache.get(url.href) as SourceTextModule
    if (source) return source

    const loader = find(this.loaders, url)
    if (!loader) throw new Error('no loader mate')
    const transpiler = find(this.transpilers, url)

    const loaded = await loader.handler({ url })
    const transpiled = transpiler
      ? await transpiler.handler({ code: loaded.code })
      : { code: loaded.code, meta: {} }

    source = new SourceTextModule(transpiled.code, {
      context: this.context,
      url: url.href,
      importModuleDynamically: this.importModuleDynamically,
      initializeImportMeta: this.initializeImportMeta(url, loaded.meta, transpiled.meta)
    })

    this.cache.set(url.href, source)
    await source.link(this.linker)
    return source
  }

  public async importModuleDynamically(
    specifier: string,
    parentModule: { url: string }
  ): Promise<SourceTextModule> {
    const source = await this.linker(specifier, parentModule)
    source.instantiate()
    await source.evaluate()
    return source
  }
}
