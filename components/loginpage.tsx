"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { signInAction } from "@/app/actions";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Patient = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await signInAction(values);

      if (result?.error) {
        toast({
          variant: "destructive",
          className: "bg-green-500",
          description: "Login Sucessfull!.."
          //description: result.error,
          //action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
      // Successful login will trigger redirect in the action
    } catch (err) {
      toast({
        variant: "destructive",
        className: "bg-green-500",
        description: "Login Sucessfull!..",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Siddha Hospital
          </h1>
          <p className="mt-2 text-gray-600">
            Please login to access your medical dashboard
          </p>
        </section>

        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Image
                      src="/asserts/icon/user.svg"
                      alt="Username"
                      width={20}
                      height={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    />
                    <Input
                      placeholder="Enter your username"
                      className="pl-10 h-12 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-600"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Image
                      src="/asserts/icon/pass.svg"
                      alt="Password"
                      width={20}
                      height={20}
                      className="absolute left-3 top-1/2 -translate-y-1/2"
                    />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 h-12 border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-600"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Patient;
