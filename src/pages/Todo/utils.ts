import { Todo } from "@/utils/types";

export enum CompletedStatus {
  All = "ALL",
  Completed = "COMPLETED",
  Uncompleted = "UNCOMPLETED",
}
export const completedStatusOptionMap: Record<CompletedStatus, string> = {
  [CompletedStatus.All]: "All Todos",
  [CompletedStatus.Completed]: "Completed Todos",
  [CompletedStatus.Uncompleted]: "Uncompleted Todos",
};

export const filterCompleted =
  (completedStatus: CompletedStatus) =>
  (todo: Todo): boolean => {
    switch (completedStatus) {
      case CompletedStatus.All:
        return true;
      case CompletedStatus.Completed:
        return todo.completed;
      case CompletedStatus.Uncompleted:
        return !todo.completed;
    }
  };

export const filterSearchText =
  (searchText?: string) =>
  (todo: Todo): boolean => {
    if (!searchText) {
      return true;
    }

    const content = todo.title + todo.description;

    return content.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  };
