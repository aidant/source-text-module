import { application } from './application'
import { resolver } from './plugins/resolver'
import { fileLoader } from './plugins/file-loader'
import { typescriptTranspiler } from './plugins/typescript-transpiler'
import { TranspileOptions, ScriptTarget } from 'typescript'

const tsOptions: TranspileOptions = {
  compilerOptions: {
    target: ScriptTarget.ESNext
  }
}

const app = application({
  scope: { console },
  resolver: resolver({ extensions: ['.ts'] }),
  loaders: [
    {
      test: () => true,
      handler: fileLoader
    }
  ],
  transpilers: [
    {
      test: () => true,
      handler: typescriptTranspiler(tsOptions)
    }
  ]
})

app
  .run('./test/hello-world')
  .catch(console.error)