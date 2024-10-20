import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { createStore } from "zustand-fractal";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export class TodoItem {
  id = uuidv4();
  title = "";
  detail = "";
  completed = false;
  deadline = moment().add(7, "days").format("YYYY-MM-DD HH:mm:ss");
}

export const TodoItemStore = createStore(
  immer<TodoItem>(() => ({
    ...new TodoItem(),
  })),
  (set) => ({
    setCompleted: (value: boolean) =>
      set((todo) => {
        todo.completed = value;
      }),
    updateTodoTitle: (title: string) =>
      set((todo) => {
        todo.title = title;
      }),
    updateTodoDeadline: (deadline: string) =>
      set((todo) => {
        todo.deadline = deadline;
      }),
  })
);
