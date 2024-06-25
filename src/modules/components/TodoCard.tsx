import { FunctionComponent, useCallback, useState } from "react";
import clsx from "clsx";
import { format } from "date-fns/fp";

import { useAppDispatch } from "@store/index";
import { deleteTodo, editTodo, toggleTodo } from "@store/slices/todosSlice";

interface EditTodoInputProps {
  content: string;
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

interface TodoCardProps {
  title: string;
  description: string;
  completed: boolean;
  todoId: string;
  createdAt: number;
  className?: string;
}

const TodoCard: FunctionComponent<TodoCardProps> = (props) => {
  const { title, description, completed, todoId, className, createdAt } = props;

  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(description);

  const dispatch = useAppDispatch();

  const handleEdit = useCallback(() => {
    setEditMode((prev) => !prev);
  }, []);

  const handleSave = useCallback(() => {
    dispatch(
      editTodo({
        title,
        description: editContent,
        todoId,
      })
    );
    setEditMode(false);
  }, [dispatch, editContent, title, todoId]);

  const handleDescriptionChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditContent(event.target.value);
    },
    []
  );

  const handleComplete = useCallback(() => {
    dispatch(toggleTodo(todoId));
  }, [dispatch, todoId]);

  const handleDelete = useCallback(() => {
    dispatch(deleteTodo(todoId));
  }, [dispatch, todoId]);

  return (
    <div
      className={clsx(className, "card bg-primary text-primary-content w-full")}
    >
      <div className="card-body">
        <div className="flex justify-start items-center gap-x-4">
          <input
            type="checkbox"
            defaultChecked={completed}
            className="checkbox"
            onClick={handleComplete}
          />
          <h2 className="card-title">{title}</h2>
        </div>

        {editMode ? (
          <EditTodoInput
            content={description}
            onChange={handleDescriptionChange}
          />
        ) : (
          <p className="break-words">{description}</p>
        )}

        <div className="card-actions grid grid-cols-2">
          <div className="self-center">
            createdAt: {format("MM/dd HH:mm:ss", createdAt)}
          </div>

          <div className="flex justify-end">
            <button
              className="btn mr-4 w-24"
              onClick={() => {
                if (editMode) {
                  handleSave();
                } else {
                  handleEdit();
                }
              }}
            >
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

export default TodoCard;
