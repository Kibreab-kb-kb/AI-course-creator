"use client";
import valid from "card-validator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import clsx from "clsx";
import { ChevronLeftIcon } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

const PaymentVerification = z.object({
  amount: z.number().min(5).max(100),
  cardNumber: z.string().length(16),
  name: z.string(),
  expiration: z.string(),
  cvv: z.string().length(3),
  address: z.object({
    address_1: z.string(),
    address_2: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
});

type PaymentVerification = z.infer<typeof PaymentVerification>;
export const Credit = () => {
  const [cardOpen, setCardOpen] = useState(true);
  const { setValue, watch } = useForm<PaymentVerification>({
    resolver: zodResolver(PaymentVerification),
  });

  return (
    <div className="w-full text-neutral-700 flex flex-col gap-4 p-4 pl-16">
      <div className="text-3xl font-medium">Credits</div>
      <Separator />
      <div className="flex mt-8 gap-8 flex-col items-start">
        <div className="flex gap-2 items-start mb-2 flex-col ">
          <div className="mb-1">credit balance</div>
          <div className="text-7xl font-medium ">$55.00</div>
        </div>
        <div>
          {watch("amount") ? (
            <CardInfoDialog open={cardOpen} setOpen={setCardOpen} />
          ) : (
            <PaymentButton set={setValue} />
          )}
        </div>
        <div className="flex flex-col mt-4 gap-2 w-full">
          <div className="text-2xl text-neutral-500">Billing History</div>
          <Separator />
        </div>
      </div>
    </div>
  );
};

const creditVerifier = z.object({
  credit: z.number().min(5).max(100),
});
type CreditVerifier = z.infer<typeof creditVerifier>;

const PaymentButton: React.FC<{ set: any }> = ({ set }) => {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreditVerifier>({
    resolver: zodResolver(creditVerifier),
  });
  const { toast } = useToast();

  useEffect(() => {
    if (errors.credit?.message)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an amount between $5 and $100",
      });
  }, [errors.credit?.message]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">Add credit to balance</Button>
      </DialogTrigger>
      <DialogContent className="w-80">
        <DialogHeader>
          <DialogTitle>Add to credit balance</DialogTitle>
          <DialogDescription>
            <div className="flex mb-4 mt-4 flex-col gap-2">
              <div className="text-neutral-700">Amount to Add</div>
              <Input
                className="focus-visible:ring-0"
                onChange={(e) => {
                  setValue("credit", Number(e.target.value));
                }}
              />
              <div className="text-xs">
                {" "}
                Enter an amount between $5 and $100
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={handleSubmit((data) => {
                set("amount", data.credit);
              })}
              size="sm"
              className=""
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const CardInfoDialog: React.FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const [validNum, setValidNum] = useState<boolean | null>(null);
  const [cardType, setCardType] = useState<string>("");
  const { setValue, watch, register } = useForm<PaymentVerification>({
    resolver: zodResolver(PaymentVerification),
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[460px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <span
              onClick={() => {
                console.log("clicked");
              }}
            >
              <ChevronLeftIcon className="h-6 w-6 mr-2" />
            </span>
            Payment Information
          </DialogTitle>
          <DialogDescription>
            <div className="flex mb-8 mt-8 gap-4 flex-col">
              <div className="text-neutral-700 font-medium">Card Details</div>
              <span className="flex justify-between gap-4 items-center">
                <Input
                  className={clsx("focus-visible:ring-0", {
                    "border-red-500 border": validNum === false,
                  })}
                  value={watch("cardNumber")?.replace(/(\d{4})/g, "$1 ")}
                  placeholder="Card Number"
                  onChange={(e) => {
                    setValue("cardNumber", e.target.value.replace(/\s/g, ""));
                    if (e.target.value.length < 16) return;
                    const v = valid.number(e.target.value);

                    if (!v.isPotentiallyValid) {
                      setValidNum(false);
                    }
                    setValidNum(v.isValid);
                    setCardType(v.card?.niceType || "");
                  }}
                />
                <span className=" w-20 text-neutral-500 text-xs">
                  {cardType}
                </span>
              </span>

              <span className="flex justify-between gap-4 items-center">
                <Input
                  {...register("expiration")}
                  className="focus-visible:ring-0"
                  placeholder="Expiration Date"
                />
                <Input
                  {...register("cvv")}
                  className="focus-visible:ring-0"
                  placeholder="CVV"
                />
              </span>
              <Input
                {...register("name")}
                className="focus-visible:ring-0"
                placeholder="Name on Card"
              />
              <div className="text-neutral-700 mt-4 font-medium">
                Billing Address
              </div>
              <Input
                {...register("address.address_1")}
                className="focus-visible:ring-0"
                placeholder="Address 1"
              />
              <Input
                {...register("address.address_2")}
                className="focus-visible:ring-0"
                placeholder="Address 2"
              />
              <Input
                {...register("address.city")}
                className="focus-visible:ring-0"
                placeholder="City"
              />
              <span className="flex justify-between gap-4 items-center">
                <Input className="focus-visible:ring-0" placeholder="State" />
                <Input className="focus-visible:ring-0" placeholder="Zip" />
              </span>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button size="sm">Add Card</Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
