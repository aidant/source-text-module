import { application } from './application'
import { resolver } from './plugins/resolver'
import { fileLoader } from './plugins/file-loader'
import { typescriptTranspiler } from './plugins/typescript-transpiler'
import { TranspileOptions, ScriptTarget } from 'typescript'
import { httpLoader } from './plugins/http-loader'

const tsOptions: TranspileOptions = {
  compilerOptions: {
    target: ScriptTarget.ESNext
  }
}

const scope = {
  console,
  Deno: { noColor: false }
}

const app = application({
  scope,
  resolver: resolver({ extensions: ['.ts'] }),
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
  .run('./test/hello-world')
  .catch(console.error)
