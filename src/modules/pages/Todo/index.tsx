import { FunctionComponent, useCallback, useEffect, useState } from "react";

import TodoCard from "@components/TodoCard";

import { useAppDispatch, useAppSelector } from "@store/index";
import { addTodo, fetchTodoList } from "@store/slices/todoSlice";
import { SortDirection, Todo } from "@utils/types";
import Select from "@components/Select";
import clsx from "clsx";
import { CreateTodoInput, createTodoInputSchema } from "@utils/validator";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@store/slices/toastSlice";

enum CompletedStatus {
  All = "ALL",
  Completed = "COMPLETED",
  Uncompleted = "UNCOMPLETED",
}
const CompletedStatusOptionMap: Record<CompletedStatus, string> = {
  [CompletedStatus.All]: "All Todos",
  [CompletedStatus.Completed]: "Completed Todos",
  [CompletedStatus.Uncompleted]: "Uncompleted Todos",
};

interface TodoFilterOptions {
  completedStatus: CompletedStatus;
  searchText?: string;
}

const todoSortField = ["createdAt", "title"] as const;
interface TodoSortOptions {
  field: (typeof todoSortField)[number];
  direction: SortDirection;
}

interface NewTodoFormProps {
  className?: string;
}

const NewTodoForm: FunctionComponent<NewTodoFormProps> = (props) => {
  const { className } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoInputSchema),
  });

  const dispatch = useAppDispatch();

  const handleFormSubmit: SubmitHandler<CreateTodoInput> = useCallback(
    (data) => {
      dispatch(addTodo(data));
      dispatch(addToast({ message: "Todo added", type: "success" }));
      reset();
    },
    [dispatch, reset],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className={clsx(className, "grid grid-cols-3 gap-8 my-8")}>
        <input
          type="text"
          placeholder="New Todo Title"
          className={clsx("input input-bordered input-primary w-full", {
            "input-error": errors.title?.message,
          })}
          {...register("title")}
        />

        <input
          placeholder="New Todo Description"
          className="input input-bordered input-primary w-full"
          {...register("description")}
        />
        <button className="btn btn-primary w-full" type="submit">
          Add Todo
        </button>
      </div>
    </form>
  );
};

interface FilterFormProps {
  className?: string;
  filter: TodoFilterOptions;
  sorter: TodoSortOptions;

  onSortOptionChange: (
    option: "field" | "direction",
  ) => (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onFilerOptionChange: (
    option: "completedStatus" | "searchText",
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const FilterTodoPanel: FunctionComponent<FilterFormProps> = (props) => {
  const { filter, sorter, onFilerOptionChange, onSortOptionChange, className } = props;

  return (
    <div className={clsx(className, "flex")}>
      <Select
        label="Filter by Completed Status"
        value={filter.completedStatus}
        onChange={onFilerOptionChange("completedStatus")}
      >
        {Object.values(CompletedStatus).map((status) => (
          <option key={status} value={status}>
            {CompletedStatusOptionMap[status]}
          </option>
        ))}
      </Select>
      <Select label="Sort by" value={sorter.field} onChange={onSortOptionChange("field")}>
        {todoSortField.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </Select>
      <Select
        label="Sort Direction"
        value={sorter.direction}
        onChange={onSortOptionChange("direction")}
      >
        <option value={SortDirection.asc}>ASC</option>
        <option value={SortDirection.desc}>DESC</option>
      </Select>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Search by title or description</span>
        </div>
        <input
          type="text"
          placeholder="Type here"
          onChange={onFilerOptionChange("searchText")}
          value={filter.searchText}
          className="input input-bordered w-full max-w-xs"
        />
      </label>
    </div>
  );
};

const filterCompleted =
  (completedStatus: CompletedStatus) =>
  (todo: Todo): boolean => {
    switch (completedStatus) {
      case CompletedStatus.All:
        return true;
      case CompletedStatus.Completed:
        return todo.completed;
      case CompletedStatus.Uncompleted:
        return !todo.completed;
    }
  };

const filterSearchText =
  (searchText?: string) =>
  (todo: Todo): boolean => {
    if (!searchText) {
      return true;
    }

    const content = todo.title + todo.description;

    return content.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  };

const TodoListPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<TodoFilterOptions>({
    completedStatus: CompletedStatus.All,
    searchText: "",
  });
  const [sort, setSort] = useState<TodoSortOptions>({
    field: "createdAt",
    direction: SortDirection.asc,
  });

  const todoState = useAppSelector((state) => {
    return {
      todos: state.todo.todos
        .filter(filterCompleted(filter.completedStatus))
        .filter(filterSearchText(filter.searchText))
        .sort((a, b) => {
          console.log(a[sort.field], b[sort.field]);
          const aItem = a[sort.field];
          const bItem = b[sort.field];
          const direction = sort.direction === SortDirection.asc ? 1 : -1;

          if (typeof aItem === "string" && typeof bItem === "string") {
            return aItem.localeCompare(bItem) * direction;
          }

          if (typeof aItem === "number" && typeof bItem === "number") {
            return (aItem - bItem) * direction;
          }

          return 0;
        }),
      loading: state.todo.loading,
      error: state.todo.error,
    };
  });

  useEffect(() => {
    dispatch(fetchTodoList());
  }, [dispatch]);

  const handleSortOptionChange = useCallback(
    (option: "field" | "direction") => (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSort({
        ...sort,
        [option]: event.target.value as (typeof sort)[keyof typeof sort],
      });
    },
    [sort],
  );

  const handleFilterOptionChange = useCallback(
    (option: "completedStatus" | "searchText") =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilter({
          ...filter,
          [option]: event.target.value,
        });
      },
    [filter],
  );

  if (todoState.loading) {
    return (
      <div className="mx-auto px-8 xl:w-3/4 md:w-full ">
        <div>Loading...</div>
        <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-16 gap-x-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-32 justify-self-center w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-8 lg:w-4/5 md:w-full ">
      <NewTodoForm />

      <FilterTodoPanel
        className="my-4"
        filter={filter}
        sorter={sort}
        onFilerOptionChange={handleFilterOptionChange}
        onSortOptionChange={handleSortOptionChange}
      />

      <div className="grid grid-flow-row-dense grid-cols-1 lg:grid-cols-2  gap-y-16 gap-x-8">
        {todoState.todos.map(({ todoId }) => (
          <TodoCard key={todoId} todoId={todoId} className="justify-self-center" />
        ))}
      </div>
    </div>
  );
};

export default TodoListPage;
