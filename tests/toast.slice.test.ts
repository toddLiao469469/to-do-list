import { expect, describe, it, vi } from "vitest";

import toastSlice, { addToast, deleteToast, ToastState } from "@store/toast.slice";

vi.useFakeTimers();

const fixedId = "fixed-id";

vi.mock("@reduxjs/toolkit", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("@reduxjs/toolkit")>();
  return {
    ...originalModule,
    nanoid: vi.fn(() => fixedId),
  };
});

describe("toast reducer", () => {
  it("should return initial state", () => {
    expect(toastSlice(undefined, { type: "unknown" })).toEqual({
      toasts: [],
    });
  });

  it("should add new toast", () => {
    const previousState = {
      toasts: [],
    };

    const newToast = {
      type: "success" as const,
      message: "message",
    };

    expect(toastSlice(previousState, addToast(newToast))).toEqual({
      toasts: [{ ...newToast, toastId: fixedId }],
    });
  });

  it("should delete toast", () => {
    const previousState: ToastState = {
      toasts: [{ toastId: fixedId, type: "success", message: "message" }],
    };

    expect(toastSlice(previousState, deleteToast(fixedId))).toEqual({
      toasts: [],
    });
  });
});
