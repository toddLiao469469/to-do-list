import { describe, expect, it, vi } from "vitest";

import { CompletedStatus, filterCompleted, filterSearchText } from "@/pages/Todo/utils";

vi.useFakeTimers();
vi.setSystemTime(new Date(2024, 6, 24));

const fixedId = "fixed-id";

vi.mock("@reduxjs/toolkit", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("@reduxjs/toolkit")>();
  return {
    ...originalModule,
    nanoid: vi.fn(() => fixedId),
  };
});

describe("Todo page", () => {
  describe("filterCompleted", () => {
    it("should always return true if completedStatus is All", () => {
      const completedStatus = CompletedStatus.All;
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterCompleted(completedStatus)(todo)).toBe(true);
    });

    it("should return false if CompletedStatus.Completed with uncompleted todo", () => {
      const completedStatus = CompletedStatus.Completed;
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterCompleted(completedStatus)(todo)).toBe(false);
    });

    it("should return true if CompletedStatus.Completed with completed todo", () => {
      const completedStatus = CompletedStatus.Completed;
      const todo = {
        title: "title1",
        description: "description1",
        completed: true,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterCompleted(completedStatus)(todo)).toBe(true);
    });

    it("should return true if CompletedStatus.Uncompleted with uncompleted todo", () => {
      const completedStatus = CompletedStatus.Uncompleted;
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterCompleted(completedStatus)(todo)).toBe(true);
    });

    it("should return false if CompletedStatus.Uncompleted with completed todo", () => {
      const completedStatus = CompletedStatus.Uncompleted;
      const todo = {
        title: "title1",
        description: "description1",
        completed: true,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterCompleted(completedStatus)(todo)).toBe(false);
    });
  });

  describe("filterSearchText", () => {
    it("should return true if searchText is not provided", () => {
      const searchText = undefined;
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterSearchText(searchText)(todo)).toBe(true);
    });

    it("should return true if searchText is empty", () => {
      const searchText = "";
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterSearchText(searchText)(todo)).toBe(true);
    });

    it("should return true if searchText is found in title", () => {
      const searchText = "title1";
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterSearchText(searchText)(todo)).toBe(true);
    });

    it("should return true if searchText is found in description", () => {
      const searchText = "description1";
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterSearchText(searchText)(todo)).toBe(true);
    });

    it("should return true if searchText is found in title or description", () => {
      const searchText = "title1";
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterSearchText(searchText)(todo)).toBe(true);
    });

    it("should return false if searchText is not found in title or description", () => {
      const searchText = "not found";
      const todo = {
        title: "title1",
        description: "description1",
        completed: false,
        todoId: "todoId1",
        createdAt: Date.now(),
      };
      expect(filterSearchText(searchText)(todo)).toBe(false);
    });
  });
});
