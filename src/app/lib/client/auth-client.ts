import { createAuthClient } from "better-auth/react";

let origin = "";

if (typeof window !== "undefined") {
  origin = window.location.origin;
}

export const authClient = createAuthClient({
  baseURL: origin,
});