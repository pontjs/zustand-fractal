/**
 * @author
 * @description
 */
import * as React from "react";
import { TodosStore } from "./Todos.model";
import { TodoItemComponent } from "./TodoItem/TodoItem.component";
import { Button, Input, Modal } from "@arco-design/web-react";
import { AddTodoModal } from "./AddTodoModal";
import { IconCheck } from "@arco-design/web-react/icon";
import { useActions, useStore } from "zustand-fractal";
import { TodoItemStore } from "./TodoItem/TodoItem.model";

export class TodosRootProps {}

export const TodosRoot: React.FC<TodosRootProps> = (props) => {
  const todos = useStore(TodosStore);
  const todosActions = useActions(TodosStore);

  const [createTodoVisible, setCreateTodoVisible] = React.useState(false);

  return (
    <div className='todos-root flex-1'>
      <div className='headers flex items-center justify-between'>
        <div className='flex items-center'>
          search todo:
          <Input
            value={todos.keyword}
            placeholder='input todo keyword please'
            className='w-[200px] ml-2'
            onChange={(value) => {
              todosActions.setKeywords(value);
            }}
          />
        </div>
        <div className='buttons'>
          <Button
            onClick={() => {
              setCreateTodoVisible(true);
            }}
          >
            + add todo
          </Button>
          <Button
            className='ml-2'
            onClick={() => {
              todosActions.completeAll();
            }}
          >
            <IconCheck />
            complete all
          </Button>
        </div>
      </div>
      <div className='list'>
        {todosActions.filteredTodos().map((todo, index) => {
          return (
            <TodoItemStore.Provider
              key={todo.id}
              rootStore={TodosStore}
              selector={(state) =>
                state.todos.find((item) => item.id === todo.id)
              }
              updator={todosActions.updateTodo}
              deps={[]}
            >
              <TodoItemComponent
                onDelete={todosActions.deleteTodo}
                className='mt-2'
                key={todo.id}
              />
            </TodoItemStore.Provider>
          );
        })}
      </div>
      <AddTodoModal
        visible={createTodoVisible}
        onCancel={() => {
          setCreateTodoVisible(false);
        }}
        onOk={(title) => {
          todosActions.addTodo(title);
          setCreateTodoVisible(false);
        }}
      />
    </div>
  );
};

TodosRoot.defaultProps = new TodosRootProps();
