export const settled = <T>(promise: Promise<T>) =>
  promise.then(
    value => ({ status: 'fulfilled', value }),
    reason => ({ status: 'rejected', reason })
  )

export const allSettled = <T>(promises: Promise<T>[]) => Promise.all(promises.map(settled))
