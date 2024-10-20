import { produce } from "immer";
import { StoreApi } from "zustand";

export function createSliceStore<TState, RState>(
  rootStore: StoreApi<RState>,
  selector: (state: RState) => TState,
  setSliceState: (newSliceState: TState) => any
): StoreApi<TState> {
  const getSliceState = () => {
    return selector(rootStore.getState());
  };

  const setState = (partial, replace, action) => {
    const sliceState = selector(rootStore.getState());
    const newSliceState =
      typeof partial === "function" ? produce(partial)(sliceState) : partial;
    setSliceState(newSliceState);
  };

  const getState = getSliceState;

  const getInitialState = () => initialState;

  const api = {
    setState,
    getState,
    getInitialState,
    subscribe: rootStore.subscribe,
  };
  const initialState = getSliceState();

  return api as any;
}
