# zustand-fractal

<p align="center">
  <img src="https://img.alicdn.com/imgextra/i2/O1CN011N4AN11QnfRWmTt2D_!!6000000002021-0-tps-1024-1024.jpg" alt="Zustand Fractal Logo" />
</p>

[![Version](https://img.shields.io/npm/v/zustand-fractal?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/zustand-fractal)
[![Downloads](https://img.shields.io/npm/dt/zustand-fractal.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/zustand-fractal)

zustand-fractal is a library that allows you to create modular, composable and fractal state management with Zustand. It combines the simplicity and power of Zustand with the flexibility of fractal state architecture.

zustand-fractal can easily handle the issue of multiple instances of Redux Store, as well as the problem of how to reuse components that have consumed specific data from the Redux Store through useStore in other scenarios.

## Installation

```bash
npm install zustand-fractal
# or
yarn add zustand-fractal
```

## Why zustand-fractal?

- Enables modular and composable state management
- Promotes reusability of state slices across different parts of your application
- Maintains the performance benefits of Zustand
- Allows for easy organization of complex state logic

## Basic Usage

First, create a fractal store:

```typescript
import { createStore } from "zustand-fractal";

export const BearStore = createStore(
  () => ({
    bears: 0,
  }),
  (set) => ({
    increasePopulation: () => set((state) => state.bears++),
  })
);
```

Then use it in your components:

```typescript
import { useStore, useActions } from "zustand-fractal";

function BearComponent() {
  const bears = useStore(BearStore, (state) => state.bears);
  const bearsActions = useActions(BearStore);

  return (
    <div>
      <h1>{bears} bears</h1>
      <button onClick={bearsActions.increasePopulation}>increase</button>
    </div>
  );
}
```

## Advanced Usage

### Nested Fractal Stores

Zustand Fractal allows you to create nested fractal stores for more complex state management:

```typescript
const BearsManagerStore = createStore(() => ({
  red: {
    bears: 0,
  },
  green: {
    bears: 1,
  },
  blueList: []
}), (set) => ({
  addBlueBear: (bearsCnt: number) => set(state => state.blueList.push({ bears: bearsCnt })),
  updateRed: (redBear) => set(state => state.red = readBear),
  updateGreen: (greenBear) => set(state => state.green = greenBear),
  updateBlue: (blueBear, index) => set(state => state.blueList[index] = blueBear),
}))

function BearsManager() {
  const bearsManager = useStore(BearsManagerStore);
  const bearsManagerActions = useActions(BearsManagerStore);

  return (
    <div>
      <h1>red: </h1>
      <BearStore.Provider
        rootStore={BearsManagerStore}
        selector={state => state.red}
        updator={bearsManagerActions.updateRed}
      >
        <BearComponent />
      </BearStore.Provider>


      <h1>green: </h1>
      <BearStore.Provider
        rootStore={BearsManagerStore}
        selector={state => state.green}
        updator={bearsManagerActions.updateGreen}
      >
        <BearComponent />
      </BearStore.Provider>

      <h1>blue: </h1>
      {
        bearsManager.blueList.map((blueItem, index) => {
          return (
            <BearStore.Provider
              key={index}
              rootStore={BearsManagerStore}
              selector={state => state.blueList[index]}
              updator={(newBlue) => {
                bearsManagerActions.updateBlue(newBlue, index);
              }}
              deps={[]}
            >
              <BearComponent />
            </BearStore.Provider>
          )
        })
      }
      <button onClick={() => bearsManagerActions.addBlueBear(0)}>add bears</button>
    </div>
  );
}
```

### Computed Properties

```typescript
const TaskStore = createFractalStore(
  () => ({
    totalTasks: 0,
    completedTasks: 0,
  }),
  (set, get) => ({
    progressPercentage() {
      return get().totalTasks === 0
        ? 0
        : (get().completedTasks / get().totalTasks) * 100;
    },
  })
);
```

## Middleware Support

Zustand Fractal supports Zustand middleware. Here's an example using the `persist` middleware:

```typescript
import { persist, devtools } from "zustand/middleware";
import { createStore } from "zustand-fractal";

const PersistentBearStore = createStore(
  devtools(
    persist(
      immer(() => ({
        bears: 0,
      })),
      { name: "bear-storage" }
    )
  ),
  (set) => ({
    addBear: () => set((state) => ({ bears: state.bears + 1 })),
  })
);
```

## TypeScript Support

Zustand Fractal is written in TypeScript and provides full type support out of the box.

## Contributing

We welcome contributions!

## License

Zustand Fractal is [MIT licensed](LICENSE).
