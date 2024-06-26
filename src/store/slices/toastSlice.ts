import { createListenerMiddleware, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { Toast } from '@utils/types';

export interface ToastState {
  toasts: Toast[];

}

const initialState: ToastState = {
  toasts: []
};



const toastSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
      },
      prepare(toast: Omit<Toast, 'toastId'>) {
        return {
          payload: {
            ...toast,
            toastId: nanoid()
          }
        };
      }
    },
    deleteToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.toastId !== action.payload);
    }
  }
});


export const { addToast, deleteToast } = toastSlice.actions;


export const toastListenerMiddleware = createListenerMiddleware();

toastListenerMiddleware.startListening({
  actionCreator: addToast,
  effect: async (action, listenerApi) => {
    const { toastId, duration = 5000 } = action.payload;
    await new Promise(resolve => setTimeout(resolve, duration));
    listenerApi.dispatch(deleteToast(toastId));
  }
});


export default toastSlice.reducer;