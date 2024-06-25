import { expect, describe, it, vi } from 'vitest'

import todosReducer, { addTodo, deleteTodo, toggleTodo } from "@store/slices/todosSlice"


vi.useFakeTimers()
vi.setSystemTime(new Date(2024, 6, 24))

const fixedId = 'fixed-id'


vi.mock('@reduxjs/toolkit', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('@reduxjs/toolkit')>()
  return {
    ...originalModule,
    nanoid: vi.fn(() => fixedId)
  };
});

describe('todo reducer', () => {

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
    }
  ]

  it('should handle initial state', () => {
    expect(todosReducer(undefined, { type: 'unknown' })).toEqual({
      todos: [],
      loading: false,
      error: null
    });
  });

  it('should handle addTodo', () => {
    const now = Date.now()
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null
    }

    const newTodo = {
      title: "title3",
      description: "description3",
      completed: false,
    }
    expect(todosReducer(previousState, addTodo(
      newTodo
    ))).toEqual({
      ...previousState,
      todos: [
        ...previousState.todos,
        { ...newTodo, todoId: fixedId, createdAt: now }
      ],
    });
  });

  it('should handle toggleTodo', () => {
    const now = Date.now()
    const todoId = "todoId1"
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null
    }
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
        }
      ],
      loading: false,
      error: null
    });
  });

  it('should handle deleteTodo', () => {


    const todoId = "todoId1"
    const previousState = {
      todos: initialTodos,
      loading: false,
      error: null
    }
    expect(todosReducer(previousState, deleteTodo(todoId))).toEqual({
      todos: initialTodos.filter(todo => todo.todoId !== todoId),
      loading: false,
      error: null
    });
  });
});