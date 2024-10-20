/**
 * @author
 * @description
 */
import * as React from "react";
import moment from "moment";
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Modal,
} from "@arco-design/web-react";
import { IconEdit, IconDelete } from "@arco-design/web-react/icon";
import { TodoItem, TodoItemStore } from "./TodoItem.model";
import { useActions, useStore } from "zustand-fractal";

export class TodoItemComponentProps {
  onDelete?: (id: string) => void;
  className?: string;
}

export const TodoItemComponent: React.FC<TodoItemComponentProps> = React.memo(
  (props) => {
    const todoItem = useStore(TodoItemStore);
    const todoItemActions = useActions(TodoItemStore);

    return (
      <div className={`todo-item flex ${props.className || ""} border p-3`}>
        <div className='todo-content text-left flex-1 mr-3 flex items-center'>
          <Checkbox
            checked={todoItem.completed}
            onChange={(checked) => {
              todoItemActions.setCompleted(checked);
            }}
          />
          <Input
            value={todoItem?.title}
            className='ml-2'
            onChange={todoItemActions.updateTodoTitle}
          />
        </div>
        <div className='todo-deadline w-[150px] flex items-center'>
          <DatePicker
            value={todoItem.deadline}
            format={"YYYY-MM-DD"}
            showTime
            onChange={todoItemActions.updateTodoDeadline}
          ></DatePicker>
        </div>
        <div className='sepline w-[1px] bg-[#e0e0e0] mx-2'></div>
        <div className='ops w-[30px] flex'>
          <Button
            className='px-2'
            onClick={() => {
              props.onDelete(todoItem.id);
            }}
          >
            <IconDelete />
          </Button>
        </div>
      </div>
    );
  }
);

TodoItemComponent.defaultProps = new TodoItemComponentProps();
