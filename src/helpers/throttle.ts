export enum PromiseState {
  Pending = 'pending',
  Fulfilled = 'fulfilled',
  Rejected = 'rejected',
}

function getPromiseState(promise: Promise<any>): Promise<PromiseState> {
  const control = Symbol();

  return Promise
    .race([promise, control])
    .then(value => (value === control) ? PromiseState.Pending : PromiseState.Fulfilled)
    .catch(() => PromiseState.Rejected);
}

export function isFulfilled<T>(promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T> {
  return promise.status === "fulfilled";
}

export function isRejected<T>(promise: PromiseSettledResult<T>): promise is PromiseRejectedResult {
  return promise.status === "rejected";
}

export async function* throttle<InputType, OutputType>(reservoir: InputType[], promiseFn: (args: InputType) => Promise<OutputType>, concurrencyLimit: number): AsyncGenerator<PromiseSettledResult<OutputType>[], void, PromiseSettledResult<OutputType>[] | undefined> {
  let iterable = reservoir.splice(0, concurrencyLimit).map(args => promiseFn(args));

  while (iterable.length > 0) {
    await Promise.race(iterable);

    const pending: Promise<OutputType>[] = [];
    const resolved: Promise<OutputType>[] = [];

    for (const currentValue of iterable) {
      if (await getPromiseState(currentValue) === PromiseState.Pending) {
        pending.push(currentValue);
      } else {
        resolved.push(currentValue);
      }
    }

    iterable = [
      ...pending,
      ...reservoir.splice(0, concurrencyLimit - pending.length).map(args => promiseFn(args))
    ];

    yield Promise.allSettled(resolved);
  }
}

export async function drip(args: any, promiseFn: any, concurrencyLimit: number, setProgress: Function) {
  const allItems = args.length;
  const timeoutPromises = await throttle<number, string>(args, async item => await promiseFn.apply(null, item), concurrencyLimit);

  let i = 0;
  let results: any[] = [];
  for await (const chunk of timeoutPromises) {
    i++;
    setProgress(() => Math.ceil(i / allItems * 100));
    results = results.concat(chunk.filter(isFulfilled).map(({ value }) => value))
    let errd = chunk.filter(isRejected)
    if (errd.length) {
      console.error(errd.map(({ reason }) => reason));
    }
  }

  return results.flat();
}
