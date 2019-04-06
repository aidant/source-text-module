import { application } from './application'
import { URL } from 'url'
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
  context: { console },
  baseURL: new URL('file:///projects/source-text-module/test/'),
  entry: './hello-world.ts',
  resolvers: [resolver],
  loaders: [fileLoader],
  transpilers: [typescriptTranspiler(tsOptions)]
})

app.catch(console.error)
