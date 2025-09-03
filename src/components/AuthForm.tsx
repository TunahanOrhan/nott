"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AuthFormProps {
  onSubmit: (email: string, password: string) => void;
  title: string;
}

const AuthForm = ({ onSubmit, title }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm p-6 rounded-xl shadow-md 
                 bg-card text-card-foreground 
                 border border-border
                 dark:bg-card dark:text-card-foreground dark:border-border
                 space-y-4 transition-colors duration-300"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="bg-input text-foreground border-border dark:bg-input dark:text-foreground dark:border-border"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full bg-primary text-primary-foreground hover:bg-primary-foreground hover:text-primary 
                   dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-foreground dark:hover:text-primary 
                   transition-colors duration-300"
      />
      <Button type="submit" className="w-full">
        {title}
      </Button>
    </form>
  );
};

export default AuthForm;
