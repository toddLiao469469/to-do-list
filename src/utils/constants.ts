import { SortDirection } from "./types";

export const sortDirectionMap: Record<SortDirection, string> = {
  [SortDirection.asc]: "Ascending",
  [SortDirection.desc]: "Descending",
};
