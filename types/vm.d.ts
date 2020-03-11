declare module 'vm' {
  interface Meta { url: string }
  type Linker = (specifier: string, referencingModule: Module) => Module | Promise<Module>
  type InitializeImportMeta = (meta: Meta, module: Module) => void

  interface ModuleEvaluateOptions {
    timeout?: number
    breakOnSigint?: boolean
  }

  class Module {
    dependencySpecifiers: string[]
    error: any
    identifier: string
    namespace: object
    status: 'unlinked' | 'linking' | 'linked' | 'evaluating' | 'evaluated' | 'errored'

    evaluate(options?: ModuleEvaluateOptions): Promise<{ result: unknown }>
    link(linker: Linker): Promise<Module>
  }

  interface SourceTextModuleConstructorOptions {
    identifier?: string
    cachedData?: Buffer | NodeJS.TypedArray | DataView
    context?: Context
    lineOffset?: number
    columnOffset?: number
    initializeImportMeta?: InitializeImportMeta
    importModuleDynamically?: Linker
  }

  class SourceTextModule extends Module {
    constructor(code: string, options?: SourceTextModuleConstructorOptions)

    createCachedData(): Buffer
  }

  interface SyntheticModuleConstructorOptions {
    identifier?: string
    context?: Context
  }

  class SyntheticModule extends Module {
    constructor(exportNames: string[], evaluateCallback: () => void, options?: SyntheticModuleConstructorOptions)

    setExport(name: string, value: unknown): void
  }
}
