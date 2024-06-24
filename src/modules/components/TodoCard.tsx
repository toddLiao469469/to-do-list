import { FunctionComponent, useCallback } from "react";
import clsx from "clsx";
import { useAppDispatch } from "@store/index";
import { toggleTodo } from "@store/slices/todosSlice";

interface TodoCardProps {
  title: string;
  description: string;
  completed: boolean;
  todoId: string;
  className?: string;
}

const TodoCard: FunctionComponent<TodoCardProps> = (props) => {
  const { title, description, completed, todoId, className } = props;

  const dispatch = useAppDispatch();

  const handleComplete = useCallback(() => {
    dispatch(toggleTodo(todoId));
  }, [dispatch, todoId]);

  return (
    <div
      className={clsx(className, "card bg-primary text-primary-content w-full")}
    >
      <div className="card-body">
        <div className="flex justify-start items-center gap-x-4">
          <input
            type="checkbox"
            checked={completed}
            className="checkbox"
            onClick={handleComplete}
          />
          <h2 className="card-title">{title}</h2>
        </div>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button className="btn">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
