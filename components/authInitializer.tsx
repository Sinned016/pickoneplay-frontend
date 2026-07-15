"use client";

import { useAuth } from "@/store/useAuth";
import { useEffect } from "react";
import { User } from "@/types/User";

// This should be a server component

type Props = {
  user: User | null;
};

export default function AuthInitializer({ user }: Props) {
  useEffect(() => {
    if (user) {
      useAuth.setState({ user });
    }
  }, [user]);

  return null;
}
