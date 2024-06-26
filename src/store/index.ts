import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import todosSlice from "./slices/todosSlice";
import toastSlice, { toastListenerMiddleware } from "./slices/toastSlice";

export const store = configureStore({
  reducer: {
    todos: todosSlice,
    toast: toastSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(toastListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
