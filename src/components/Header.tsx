"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "./ThemeSwitch";
import type { User } from "@supabase/supabase-js";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header className="flex justify-between items-center p-4  md:px-10 bg-gray-200 dark:bg-gray-800 text-black dark:text-white shadow-md">
      {/* Marka */}
      <div className="text-xl font-bold text-left flex-1">nott</div>

      {/* Sağ taraf */}
      <div className="flex items-center gap-4">
        {/* Dark/Light Toggle */}
        <ThemeSwitch />

        {user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center text-white">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" onClick={() => router.push("/auth/login")}>
              Login
            </Button>
            <Button size="sm" onClick={() => router.push("/auth/signup")}>
              Signup
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
