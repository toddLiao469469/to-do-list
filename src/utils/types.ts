interface Todo {
  title: string;
  description?: string;
  completed: boolean;
  todoId: string;
  createdAt: number;
}

interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
  toastId: string;
  duration?: number;
}

enum SortDirection {
  asc = "ASC",
  desc = "DESC",
}

export type { Todo, Toast };

export { SortDirection };
