import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen overflow-hidden lg:grid lg:min-h-[600px] lg:grid-cols-5 xl:min-h-[800px]">
      <div className="flex h-screen items-center justify-center lg:col-span-2">
        {children}
      </div>
      <div className="hidden h-full bg-muted lg:block lg:col-span-3">
        <Image
          src="/main_pic.webp"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-fit dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
