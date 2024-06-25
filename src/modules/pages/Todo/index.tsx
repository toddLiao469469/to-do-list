import { FunctionComponent, useCallback, useEffect, useState } from "react";

import TodoCard from "@components/TodoCard";

import { useAppDispatch, useAppSelector } from "@store/index";
import { addTodo, fetchTodoList } from "@store/slices/todosSlice";

const NewTodoForm: FunctionComponent = () => {
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();

  const handleAddTodo = useCallback(() => {
    dispatch(addTodo({ title, description: "" }));
    setTitle("");
  }, [dispatch, title]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleAddTodo();
      }
    },
    [handleAddTodo]
  );

  const handleButtonClick = useCallback(() => {
    handleAddTodo();
  }, [handleAddTodo]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };

  return (
    <div className="grid grid-cols-[9fr_3fr] gap-8 my-8">
      <input
        type="text"
        placeholder="New Todo Title"
        className="input input-bordered input-primary w-full"
        onKeyDown={handleKeyDown}
        value={title}
        onChange={handleChange}
      />
      <button className="btn btn-primary w-full" onClick={handleButtonClick}>
        Add Todo
      </button>
    </div>
  );
};

const TodoListPage: FunctionComponent = () => {
  const todosState = useAppSelector((state) => state.todos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [dispatch]);

  if (todosState.loading) {
    return (
      <div className="mx-auto px-8 xl:w-2/3 md:w-full ">
        <div>Loading...</div>
        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="skeleton h-32 justify-self-center w-full"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-8 xl:w-2/3 md:w-full ">
      <NewTodoForm />
      <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8">
        {todosState.todos.map(
          ({ todoId, title, description, completed, createdAt }) => (
            <TodoCard
              key={todoId}
              title={title}
              todoId={todoId}
              description={description}
              createdAt={createdAt}
              completed={completed}
              className="justify-self-center"
            />
          )
        )}
      </div>
    </div>
  );
};

export default TodoListPage;
