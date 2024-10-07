"use client";

import * as React from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { trpc } from "@/app/_trpc/client";
import { AuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingEllipsis from "@/components/loading/ellipsis";
import { Button } from "@/components/ui/button";

const otpVerifier = z.object({
  otp: z.string().length(6, "OTP must be 6 characters"),
});

interface OTPCode {
  otp: string;
}

export default function Page() {
  const { watch, handleSubmit, setValue } = useForm<OTPCode>({
    resolver: zodResolver(otpVerifier),
  });
  const [loading, setLoading] = useState(false);
  const verify_otp = trpc.verify_otp.useMutation();
  const resend = trpc.send_otp.useMutation();
  const [counter, setCounter] = useState(119);
  const { userEmail, setUser } = AuthStore((state) => ({
    userEmail: state.userEmail,
    setUser: state.setUser,
  }));
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (counter < 120)
        setCounter((prev) => {
          if (prev == 0) return 120000000;
          return prev - 1;
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!userEmail) {
    return router.push("/login");
  }

  const handleVerification = async (value: string) => {
    try {
      setLoading(true);
      const res = await verify_otp.mutateAsync({
        email: userEmail,
        otp: value,
      });

      if (res.error) {
        throw new Error(res.error);
      }
      setUser({
        ...res.data,
        createdAt: new Date(res.data.createdAt),
        updatedAt: new Date(res.data.updatedAt),
      });
      return router.push("/home");
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error",
        description: e instanceof Error ? e.message : "An error occurred",
      });
      setLoading(false);
    } finally {
    }
  };

  return (
    <div className="space-y-2 flex flex-col items-center">
      <span>Please enter the OTP code sent to your email address.</span>
      <InputOTP
        maxLength={6}
        value={watch("otp")}
        onChange={(value) => {
          setValue("otp", value);
          if (watch("otp")?.length === 6) {
            handleSubmit(async (data) => {
              await handleVerification(data.otp);
            })();
          }
        }}
        disabled={loading}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSeparator />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {loading ? (
        <span>
          <LoadingEllipsis />
        </span>
      ) : (
        <span className="text-gray-400">
          <Button
            className=""
            onClick={async () => {
              await resend.mutateAsync({
                email: userEmail,
              });
              setCounter(119);
            }}
            disabled={loading || (counter > 0 && counter < 120)}
          >
            Resend OTP
            {counter > 0 &&
              counter < 120 &&
              ` in 0${Math.floor(counter / 60).toFixed(0)}:${counter % 60 === 0 ? "00" : counter % 60 < 10 ? "0" + (counter % 60) : counter % 60}`}
          </Button>
        </span>
      )}
    </div>
  );
}
