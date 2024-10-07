"use client";
import { trpc } from "@/app/_trpc/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { AuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileVerifier = z.object({
  username: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileInputs = z.infer<typeof profileVerifier>;

export const Profile = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileVerifier),
  });
  const user = trpc.get_me.useQuery().data;
  const [file, setFile] = useState<File | null>(null);
  const update_me = trpc.update_me.useMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;
    const d: ProfileInputs = {};
    Object.entries(user).map(([k, v]) => {
      if (v) {
        d[k as keyof ProfileInputs] = v;
      }
    });
    reset({
      ...d,
    });
  }, [user, reset]);

  const uploadPicture = async () => {
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    const supabase = createClient();
    setValue("avatar", tempUrl);

    const upload = await supabase.storage
      .from("avatars")
      .upload(file.name, file, { upsert: true });

    const url = supabase.storage.from("avatars").getPublicUrl(file.name);
    setValue("avatar", url.data.publicUrl);
    return url.data.publicUrl;
  };

  const onSubmit = async () => {
    handleSubmit(async (data) => {
      let avatar: string | undefined = data.avatar ?? "";
      if (avatar?.startsWith("blob:")) {
        const url = await uploadPicture();
        avatar = url;
      }
      const success = await update_me.mutateAsync({
        ...data,
        ...(avatar && { avatar }),
      });
    })();
  };

  return (
    <div className="w-full flex flex-col gap-4 p-4 pl-16">
      <div className="text-2xl font-medium">Profile</div>
      <Separator />
      <div className="w-full mt-4 flex justify-between gap-16 items-start">
        <div className="w-1/2 flex flex-col gap-8">
          <div>
            <div className="text-base mb-2 ">Username</div>
            <Input {...register("username")} />
          </div>
          <div>
            <div className="text-base mb-2 ">Email</div>
            <Input disabled={true} value={user?.email ?? ""} />
          </div>
          <div>
            <div className="text-base mb-2 ">Bio</div>
            <Textarea {...register("bio")} />
          </div>
        </div>
        <Avatar className="w-1/4 flex justify-center h-full mx-4 aspect-square">
          <input
            type="file"
            className="hidden"
            id="avatar"
            accept="image/*"
            onChange={async (e) => {
              if (e.target.files && e.target.files?.length > 0) {
                const f = e.target.files[0];

                if (f.size > 1024 * 1024 * 2) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "File size should be less than 2MB",
                  });
                  return;
                }
                setFile(f);
                await uploadPicture();
              }
            }}
          />
          <label htmlFor="avatar">
            <AvatarImage
              className="object-cover w-full bg-gray-300 cursor-pointer"
              src={watch("avatar") || user?.avatar || "./avatar.jpg"}
            />
          </label>
        </Avatar>
      </div>
      <div className="mt-8">
        <Button onClick={onSubmit} disabled={update_me.isPending}>
          Save
        </Button>
      </div>
    </div>
  );
};
