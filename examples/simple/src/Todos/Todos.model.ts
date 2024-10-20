import { createStore } from "zustand-fractal";

import { TodoItem } from "./TodoItem/TodoItem.model";
import { immer } from "zustand/middleware/immer";

class TodosState {
  todos = [] as TodoItem[];

  keyword = "";
}

export const TodosStore = createStore(
  immer(() => ({
    ...new TodosState(),
  })),
  (set, get) => ({
    filteredTodos() {
      return get().todos.filter((todo) =>
        todo.title.toLowerCase().includes(get().keyword.toLowerCase())
      );
    },
    setKeywords: (value: string) =>
      set((state) => {
        state.keyword = value;
      }),
    completeAll: () =>
      set((state) => {
        state.todos.forEach((todo) => {
          todo.completed = true;
        });
      }),
    addTodo: (title: string) =>
      set((state) => {
        const item = { ...new TodoItem() };
        item.title = title;
        state.todos.push(item);
      }),
    deleteTodo: (id: string) =>
      set((state) => {
        state.todos = state.todos.filter((todo) => todo.id !== id);
      }),
    updateTodo: (todo: TodoItem) =>
      set((state) => {
        let todoIndex = state.todos.findIndex((item) => item.id === todo.id);

        if (todoIndex !== -1) {
          state.todos[todoIndex] = todo;
        }
      }),
  })
);
