export const settled = <T>(
  promise: Promise<T>
): { status: 'fulfilled'; value: T } | { status: 'rejected'; reason: any } =>
  promise.then(
    value => ({ status: 'fulfilled', value }),
    reason => ({ status: 'rejected', reason })
  ) as any

export const allSettled = <T>(promises: Promise<T>[]) => Promise.all(promises.map(settled))
