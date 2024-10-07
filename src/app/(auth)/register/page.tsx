"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { AuthStore } from "@/store/auth";
import { redirect, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface RegisterInputs {
  email: string;
  password: string;
}
export default function Page() {
  const { handleSubmit, register } = useForm<RegisterInputs>();
  const { signUp, userError, user } = AuthStore((state) => ({
    userError: state.userError,
    user: state.user,
  }));
  const { toast } = useToast();
  const router = useRouter();
  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await signUp(data.email, data.password);
        if (userError) {
          toast({
            variant: "destructive",
            title: "Error registering",
            description: userError.message,
          });
          return;
        }
        if (user) router.push("/home");
      })}
    >
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Register</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to register
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              ></Link>
            </div>
            <Input
              {...register("password")}
              id="password"
              type="password"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-primary">
            Register
          </Button>
          <Button variant="outline" className="w-full">
            Register with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </form>
  );
}
