import { FunctionComponent, useCallback, useState, memo } from "react";
import clsx from "clsx";
import { format } from "date-fns/fp";

import { useAppDispatch, useAppSelector } from "@store/index";
import { deleteTodo, editTodo, selectTodoById, toggleTodo } from "@store/slices/todoSlice";

interface EditTodoInputProps {
  content?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const EditTodoInput: FunctionComponent<EditTodoInputProps> = (props) => {
  const { content, onChange } = props;
  return (
    <textarea
      className="textarea rounded-none"
      placeholder={"Edit Todo Description"}
      defaultValue={content}
      onChange={onChange}
    />
  );
};

interface EmptyTodoCardProps {}

const EmptyTodoCard: FunctionComponent<EmptyTodoCardProps> = () => {
  return (
    <div className="card bg-primary text-primary-content w-full">
      <div className="card-body">
        <h2 className="card-title">No Todo Found</h2>
      </div>
    </div>
  );
};

interface TodoCardProps {
  todoId: string;
  className?: string;
}

const TodoCard: FunctionComponent<TodoCardProps> = (props) => {
  const { todoId, className } = props;
  const todo = useAppSelector((state) => selectTodoById(state, todoId));

  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState(todo?.description || "");

  const dispatch = useAppDispatch();

  const handleActionButtonClick = useCallback(() => {
    if (editMode && todo) {
      dispatch(
        editTodo({
          title: todo.title,
          description: editDescription,
          todoId,
        }),
      );
    }

    setEditMode((prev) => !prev);
  }, [dispatch, editDescription, editMode, todo, todoId]);

  const handleDescriptionChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditDescription(event.target.value);
  }, []);

  const handleComplete = useCallback(() => {
    dispatch(toggleTodo(todoId));
  }, [dispatch, todoId]);

  const handleDelete = useCallback(() => {
    dispatch(deleteTodo(todoId));
  }, [dispatch, todoId]);

  if (!todo) {
    return <EmptyTodoCard />;
  }

  const { title, description, completed, createdAt } = todo;
  return (
    <div className={clsx(className, "card bg-primary text-primary-content w-full")}>
      <div className="card-body">
        <div className="flex justify-start items-center gap-x-4">
          <input
            type="checkbox"
            defaultChecked={completed}
            className="checkbox"
            onClick={handleComplete}
          />
          {editMode ? (
            <input type="text" className="input input-bordered w-full max-w-xs" />
          ) : (
            <h2 className="card-title">{title}</h2>
          )}
        </div>

        {editMode ? (
          <EditTodoInput content={description} onChange={handleDescriptionChange} />
        ) : (
          <p className="break-words">{description}</p>
        )}

        <div className="card-actions grid md:grid-cols-2 grid-cols-1 mt-2">
          <div className="self-center">createdAt: {format("MM/dd HH:mm:ss", createdAt)}</div>

          <div className="flex justify-end">
            <button className="btn mr-4 w-24" onClick={handleActionButtonClick}>
              {editMode ? "Save" : "Edit"}
            </button>
            <button className="btn btn-secondary w-24" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoizedTodoCard = memo(TodoCard);

export default MemoizedTodoCard;
