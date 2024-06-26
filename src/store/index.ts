import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import toastSlice, { toastListenerMiddleware } from "@/store/toast.slice";
import todoSlice from "@/store/todo.slice";

export const store = configureStore({
  reducer: {
    todo: todoSlice,
    toast: toastSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(toastListenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
