import { useEffect } from "react";

import TodoCard from "@components/TodoCard";

import { useAppDispatch, useAppSelector } from "@store/index";
import { fetchTodoList } from "@store/slices/todosSlice";

function TodoListPage() {
  const todosState = useAppSelector((state) => state.todos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [dispatch]);

  console.log("todosState", todosState);

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
      {todosState.loading && <div>Loading...</div>}
      <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8">
        {todosState.todos.map(({ todoId, title, description, completed }) => (
          <TodoCard
            key={todoId}
            title={title}
            todoId={todoId}
            description={description}
            completed={completed}
            className="justify-self-center"
          />
        ))}
      </div>
    </div>
  );
}

export default TodoListPage;
