import { getTodoList } from "@api/todo";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Todo } from "@utils/types";

export interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: Error | null;
}

const initialState: TodoState = {
  todos: [],
  loading: true,
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
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodoList(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError(state, action: PayloadAction<Error>) {
      state.error = action.payload;
      state.loading = false;
    },
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.todoId === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    }
  },
  extraReducers: (builder) => {
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
  }
});


export const { setTodoList, setError, addTodo, toggleTodo } = todosSlice.actions;

export { fetchTodoList };

export default todosSlice.reducer;