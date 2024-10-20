import { createContext, Provider, useContext, useEffect, useRef } from "react";
import React from "react";
import { useStore, createStore } from "zustand";
import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from "zustand";
import { createSliceStore } from "./fractal";

type StoreApiWithContext<T> = StoreApi<T> & {
  Context?: React.Context<StoreApi<T>>;
};

export function create<
  T,
  Actions,
  Mos extends [StoreMutatorIdentifier, unknown][] = [],
>(
  createInitalState: StateCreator<T, [], Mos>,
  createActions: (
    setState: (setter: ((state: T) => any) | T | Partial<T>) => void,
    getState: StoreApi<T>["getState"],
    storeApi: StoreApi<T>
  ) => Actions
) {
  const defaultStoreApi = createStore<T>(createInitalState as any);
  const actions = createActions(
    defaultStoreApi.setState,
    defaultStoreApi.getState,
    defaultStoreApi
  );

  Object.assign(defaultStoreApi, { actions });

  const StoreContext = createContext(defaultStoreApi);

  class StorePrividerProps<R> {
    rootStore: StoreApiWithContext<R>;
    deps: any[] = [];
    selector: (rootState: R) => T;
    updator: (sliceState: T) => any;
    children?: any;
  }

  function StoreProvider<R>(props: StorePrividerProps<R>): React.ReactNode {
    const { deps, selector, updator, rootStore, ...rest } = props;
    const RootStoreContext = rootStore.Context;
    const storeApi: StoreApi<R> = RootStoreContext
      ? useContext(RootStoreContext)
      : rootStore;

    const store = React.useMemo(() => {
      const sliceStore = createSliceStore(
        storeApi,
        props.selector,
        props.updator
      );
      const sliceStoreActions = createActions(
        sliceStore.setState,
        sliceStore.getState,
        sliceStore
      );

      Object.assign(sliceStore, {
        actions: sliceStoreActions,
      });

      return sliceStore;
    }, [storeApi, ...deps]);

    return <StoreContext.Provider {...rest} value={store} />;
  }
  Object.assign(defaultStoreApi, {
    Provider: StoreProvider,
    Context: StoreContext,
  });

  type ReturnType = StoreApi<T> & {
    actions: Actions;
    Provider: typeof StoreProvider;
    Context: typeof StoreContext;
  };

  return defaultStoreApi as ReturnType;
}
