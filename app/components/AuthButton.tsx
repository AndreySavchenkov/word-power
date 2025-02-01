"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        {session?.user?.image && (
          <Image
            src={session?.user?.image}
            alt="user"
            className="rounded-full"
            width={32}
            height={32}
          />
        )}
        <button onClick={() => signOut()}>Выйти</button>
      </div>
    );
  }
  return <button onClick={() => signIn("google")}>Войти через Google</button>;
}
