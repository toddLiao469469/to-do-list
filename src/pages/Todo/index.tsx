import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import Select from "@/components/common/Select";
import TodoCard from "@/components/TodoCard";
import { useAppDispatch, useAppSelector } from "@/store/index";
import { addToast } from "@/store/toast.slice";
import { addTodo, fetchTodoList } from "@/store/todo.slice";
import { sortDirectionMap } from "@/utils/constants";
import { SortDirection } from "@/utils/types";
import { CreateTodoInput, createTodoInputSchema } from "@/utils/validator";

import {
  CompletedStatus,
  completedStatusOptionMap,
  filterCompleted,
  filterSearchText,
} from "./utils";

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
      <div className={clsx(className, "my-8 grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-3")}>
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
        <button className="btn btn-primary w-full max-w-36" type="submit">
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
    <div className={clsx(className, "grid grid-cols-2 gap-x-6 gap-y-1 xl:grid-cols-4")}>
      <Select
        label="Filter by Completed Status"
        value={filter.completedStatus}
        onChange={onFilerOptionChange("completedStatus")}
      >
        {Object.values(CompletedStatus).map((status) => (
          <option key={status} value={status}>
            {completedStatusOptionMap[status]}
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
        {Object.values(SortDirection).map((direction) => (
          <option key={direction} value={direction}>
            {sortDirectionMap[direction]}
          </option>
        ))}
      </Select>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Search</span>
        </div>
        <input
          type="text"
          placeholder="Search by title or description"
          onChange={onFilerOptionChange("searchText")}
          value={filter.searchText}
          className="input input-bordered input-primary w-full max-w-xs"
        />
      </label>
    </div>
  );
};

const TodoListPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<TodoFilterOptions>({
    completedStatus: CompletedStatus.All,
    searchText: "",
  });
  const [sort, setSort] = useState<TodoSortOptions>({
    field: "createdAt",
    direction: SortDirection.Asc,
  });

  const todoState = useAppSelector((state) => {
    return {
      todos: state.todo.todos
        .filter(filterCompleted(filter.completedStatus))
        .filter(filterSearchText(filter.searchText))
        .sort((a, b) => {
          const aItem = a[sort.field];
          const bItem = b[sort.field];
          const direction = sort.direction === SortDirection.Asc ? 1 : -1;

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
      <div className="mx-auto px-8 md:w-full xl:w-3/4 ">
        <progress className="progress my-2 w-full"></progress>

        <div className="grid grid-flow-row-dense grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-32 w-full justify-self-center"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-8 md:w-full lg:w-4/5 ">
      <NewTodoForm />

      <FilterTodoPanel
        className="my-4"
        filter={filter}
        sorter={sort}
        onFilerOptionChange={handleFilterOptionChange}
        onSortOptionChange={handleSortOptionChange}
      />

      <div className="mt-12 grid grid-flow-row-dense grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-2">
        {todoState.todos.map(({ todoId }) => (
          <TodoCard key={todoId} todoId={todoId} className="justify-self-center" />
        ))}
      </div>
    </div>
  );
};

export default TodoListPage;
