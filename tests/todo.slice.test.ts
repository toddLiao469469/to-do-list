import { describe, expect, it, vi } from "vitest";

import todosReducer, { addTodo, deleteTodo, editTodo, toggleTodo } from "@/store/todo.slice";

vi.useFakeTimers();
vi.setSystemTime(new Date(2024, 6, 24));

const fixedId = "fixed-id";

vi.mock("@reduxjs/toolkit", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("@reduxjs/toolkit")>();
  return {
    ...originalModule,
    nanoid: vi.fn(() => fixedId),
  };
});

describe("todo reducer", () => {
  const initialTodos = [
    {
      title: "title1",
      description: "description1",
      completed: false,
      todoId: "todoId1",
      createdAt: Date.now(),
    },
    {
      title: "title2",
      description: "description2",
      completed: false,
      todoId: "todoId2",
      createdAt: Date.now(),
    },
  ];

  it("should return initial state", () => {
    expect(todosReducer(undefined, { type: "unknown" })).toEqual({
      todos: [],
      loading: false,
      error: null,
    });
  });

  it("should add new todo", () => {
    const now = Date.now();
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null,
    };

    const newTodo = {
      title: "title3",
      description: "description3",
      completed: false,
    };
    expect(todosReducer(previousState, addTodo(newTodo))).toEqual({
      ...previousState,
      todos: [...previousState.todos, { ...newTodo, todoId: fixedId, createdAt: now }],
    });
  });

  it("should toggle todo completed ", () => {
    const now = Date.now();
    const todoId = "todoId1";
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null,
    };
    expect(todosReducer(previousState, toggleTodo(todoId))).toEqual({
      todos: [
        {
          title: "title1",
          description: "description1",
          completed: true,
          todoId: todoId,
          createdAt: now,
        },
        {
          title: "title2",
          description: "description2",
          completed: false,
          todoId: "todoId2",
          createdAt: now,
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("should edit todo", () => {
    const todoId = "todoId1";
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null,
    };

    expect(
      todosReducer(
        previousState,
        editTodo({
          todoId: todoId,
          title: "new title",
          description: "new description",
        }),
      ),
    ).toEqual({
      todos: [
        {
          title: "new title",
          description: "new description",
          completed: false,
          todoId: todoId,
          createdAt: Date.now(),
        },
        {
          title: "title2",
          description: "description2",
          completed: false,
          todoId: "todoId2",
          createdAt: Date.now(),
        },
      ],
      loading: false,
      error: null,
    });
  });

  it("should delete todo", () => {
    const todoId = "todoId1";
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null,
    };
    expect(todosReducer(previousState, deleteTodo(todoId))).toEqual({
      todos: initialTodos.filter((todo) => todo.todoId !== todoId),
      loading: false,
      error: null,
    });
  });
});
