import { runPlugins, Toolkit } from './run-plugins'
import { URL } from 'url'

export interface LoaderOptions {
  url: URL
}

export interface LoaderResult {
  code: string
  ext: string
  meta?: object
}

export type Loader = (
  options: LoaderOptions,
  toolkit: Toolkit
) => Promise<Symbol | LoaderResult>

export const runLoaders = (loaders: Loader[], options: LoaderOptions) =>
  runPlugins<Loader, LoaderOptions, LoaderResult>(loaders, options)
