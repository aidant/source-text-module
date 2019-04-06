import { runPlugins, Toolkit } from './run-plugins'
import { URL } from 'url'

export interface ResolverOptions {
  specifier: string
  parentURL: URL
}

export interface ResolverResult {
  url: URL
}

export type Resolver = (
  options: ResolverOptions,
  toolkit: Toolkit
) => Promise<symbol | ResolverResult>

export const runResolvers = (resolvers: Resolver[], options: ResolverOptions) =>
  runPlugins<Resolver, ResolverOptions, ResolverResult>(resolvers, options)
