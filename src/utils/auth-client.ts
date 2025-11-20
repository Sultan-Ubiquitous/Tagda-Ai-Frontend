import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "http://localhost:8008",
});

export const signIn = async () => {
    await authClient.signIn.social({
    provider: "google",
  });
}

export const { useSession } = authClient;