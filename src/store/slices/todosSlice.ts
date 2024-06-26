import {
  PayloadAction,
  createAsyncThunk,
  createSlice,
  nanoid,
  createSelector,
} from "@reduxjs/toolkit";

import { getTodoList } from "@api/todo";

import { Todo } from "@utils/types";
import { RootState } from "..";

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: Error | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

const fetchTodoList = createAsyncThunk<Todo[], void, { rejectValue: Error }>(
  "todo/fetchTodoList",
  async (_, { rejectWithValue }) => {
    try {
      return await getTodoList();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error);
      }
      return rejectWithValue(new Error("An error occurred"));
    }
  },
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: {
      reducer(state, action: PayloadAction<Todo>) {
        state.todos.push(action.payload);
      },
      prepare(todo: Omit<Todo, "todoId" | "createdAt" | "completed">) {
        return {
          payload: {
            ...todo,
            todoId: nanoid(),
            createdAt: Date.now().valueOf(),
            completed: false,
          },
        };
      },
    },
    editTodo: (state, action: PayloadAction<Omit<Todo, "createdAt" | "completed">>) => {
      const todo = state.todos.find((todo) => todo.todoId === action.payload.todoId);
      if (todo) {
        todo.title = action.payload.title;
        todo.description = action.payload.description;
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.todoId === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter((todo) => todo.todoId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodoList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTodoList.fulfilled, (state, action) => {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchTodoList.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = new Error("An error occurred");
      }
      state.loading = false;
    });
  },
});

export const { addTodo, toggleTodo, editTodo, deleteTodo } = todosSlice.actions;

export { fetchTodoList };

export const selectTodos = createSelector(
  (state: RootState) => state.todos,
  (todos) => todos.todos,
);

export const selectTodoById = createSelector(
  selectTodos,
  (_, todoId: string) => todoId,
  (todos: Todo[], todoId: string) => {
    return todos.find((todo) => todo.todoId === todoId);
  },
);

export default todosSlice.reducer;
