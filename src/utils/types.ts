export interface Todo {
  title: string;
  description?: string;
  completed: boolean;
  todoId: string;
  createdAt: number;
}

export interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
  toastId: string;
  duration?: number;
}

export enum SortDirection {
  asc = "ASC",
  desc = "DESC",
}
