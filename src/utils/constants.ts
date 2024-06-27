import { SortDirection } from "./types";

export const sortDirectionMap: Record<SortDirection, string> = {
  [SortDirection.Asc]: "Ascending",
  [SortDirection.Desc]: "Descending",
};
