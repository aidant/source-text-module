import { Application } from './application.js'
import { resolver } from './plugins/resolver.js'
import { fileLoader } from './plugins/file-loader.js'
import { typescriptTranspiler } from './plugins/typescript-transpiler.js'
import ts from 'typescript'
import { httpLoader } from './plugins/http-loader.js'

const tsOptions: ts.TranspileOptions = {
  compilerOptions: {
    target: ts.ScriptTarget.ESNext
  }
}

const app = new Application({
  context: {
    console,
    Deno: { noColor: false }
  },
  resolver: resolver(),
  loaders: [
    {
      test: /file:/,
      handler: fileLoader
    },
    {
      test: /https:/,
      handler: httpLoader
    }
  ],
  transpilers: [
    {
      test: /\.ts$/,
      handler: typescriptTranspiler(tsOptions)
    }
  ]
})

app
  .importModuleDynamically('./test/hello-world.ts', { url: 'file:///projects/source-text-module/test' })
  .catch(console.error)
