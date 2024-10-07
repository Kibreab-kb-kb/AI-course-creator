"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { AuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/app/_trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";
import { Info } from "lucide-react";
import { Alert } from "@/components/ui/alert";

const loginVerifier = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
});

interface LoginInputs {
  email: string;
}

export default function Page() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginVerifier),
  });
  const { setUserEmail } = AuthStore((state) => ({
    setUserEmail: state.setUserEmail,
  }));
  const send_otp = trpc.send_otp.useMutation();
  const { toast } = useToast();
  const router = useRouter();

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        try {
          await send_otp.mutateAsync(
            {
              email: data.email,
            },
            {
              onSuccess: (output) => {
                // Error is returned as an output
                if (output.error) {
                  throw new Error(output.error);
                }
                setUserEmail(data.email);
                toast({
                  variant: "default",
                  title: "OTP sent",
                  description: "Please check your email for the OTP",
                });
                router.push("/otp");
              },
            },
          );
        } catch (e: unknown) {
          console.error(e);
          toast({
            variant: "destructive",
            title: "Error",
            description: e instanceof Error ? e.message : "An error occurred",
          });
        }
      })}
    >
      <div className="mx-auto grid w-[350px] gap-6">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-balance text-muted-foreground">
            Enter your email below to receive an OTP
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="m@example.com"
              required
              className={clsx("focus-visible:ring-0", {
                "border-red-500 border-2": errors.email?.message,
              })}
            />
            {errors.email && (
              <Alert
                className="p-2 bg-red-500 text-white"
                variant={"destructive"}
              >
                <div className="flex justify-start items-center gap-2  text-sm">
                  <Info className="h-4 w-4" />
                  {errors.email?.message}
                </div>
              </Alert>
            )}
          </div>
          <Button
            disabled={send_otp.isPending}
            type="submit"
            className="w-full bg-primary"
          >
            Send verification code
          </Button>
          <Button
            disabled={send_otp.isPending}
            variant="outline"
            className="w-full"
          >
            Login with Google
          </Button>
        </div>
      </div>
    </form>
  );
}
