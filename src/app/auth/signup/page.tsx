"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <AuthForm onSubmit={handleSignup} title="Sign Up" />
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SignupPage;
