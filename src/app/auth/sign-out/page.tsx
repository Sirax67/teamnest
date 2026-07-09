"use client";

import {useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from "../../lib/client/auth-client";

export default function SighOut() {
  const router = useRouter();

  useEffect(() => {
    authClient.signOut({
      fetchOptions: {
        onSuccess() {
          router.push("/");
        },
      },
    });
  }, []);

  return null;
}