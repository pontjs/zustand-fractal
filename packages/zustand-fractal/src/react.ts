import { useContext } from "react";
import { StoreApi, useStore } from "zustand";

type ExtractState<S> = S extends {
  getState: () => infer T;
}
  ? T
  : never;
type ReadonlyStoreApi<T> = Pick<
  StoreApi<T>,
  "getState" | "getInitialState" | "subscribe"
>;
type WithReact<S extends ReadonlyStoreApi<unknown>> = S & {
  /** @deprecated please use api.getInitialState() */
  getServerState?: () => ExtractState<S>;
};

export function useFractalStore<S extends WithReact<ReadonlyStoreApi<unknown>>>(
  storeApi: S
): ExtractState<S>;
export function useFractalStore<
  S extends WithReact<ReadonlyStoreApi<unknown>>,
  U,
>(storeApi: S, selector: (state: ExtractState<S>) => U): U;
export function useFractalStore(defaultStoreApi, selector?) {
  const storeApi = defaultStoreApi?.Context
    ? useContext(defaultStoreApi?.Context)
    : defaultStoreApi;

  return useStore(storeApi, selector);
}

export function useActions<Actions>(
  storeApi: ReadonlyStoreApi<unknown> & { actions: Actions }
): Actions;
export function useActions(defaultStoreApi) {
  const storeApi = defaultStoreApi?.Context
    ? useContext(defaultStoreApi.Context)
    : defaultStoreApi;

  return storeApi.actions;
}
