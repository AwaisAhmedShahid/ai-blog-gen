"use client";

import * as React from "react";
import { toast } from "sonner";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  message: string;
  type: ToastType;
  link?: string;
};

type ToastAction = {
  id: string;
  dismiss: () => void;
};

type ToastState = {
  toasts: Array<{ id: string; type: ToastType; message: string }>;
};

type AddToastPayload = {
  id: string;
  type: ToastType;
  message: string;
};

type Action = { type: "ADD_TOAST"; payload: AddToastPayload } | { type: "REMOVE_TOAST"; id: string };

const toastReducer = (state: ToastState, action: Action): ToastState => {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.payload, ...state.toasts] };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.id),
      };
    default:
      return state;
  }
};

const generateId = () => Math.random().toString(36).substring(2, 10);

const useSonner = () => {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  const addToast = (options: ToastOptions): ToastAction => {
    const id = generateId();
    const dismiss = () => dispatch({ type: "REMOVE_TOAST", id });

    dispatch({
      type: "ADD_TOAST",
      payload: {
        id,
        type: options.type,
        message: options.message,
      },
    });

    if (options.type === "info") {
      if (options.link) {
        toast(options.message, {
          action: {
            label: "Go to Link",
            onClick: () => window.open(options.link, "_blank"),
          },
        });
      } else {
        toast.info(options.message);
      }
    } else if (options.type === "success") {
      toast.success(options.message);
    } else if (options.type === "error") {
      toast.error(options.message);
    }

    return { id, dismiss };
  };

  const dismissToast = (id: string) => {
    dispatch({ type: "REMOVE_TOAST", id });
  };

  return { addToast, dismissToast, state };
};

export default useSonner;
