"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import CustomForm from "./customForm"


export enum formF {
  INPUT = "input",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  PASS = "password"

}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const Patient = () =>{
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Login</h1>
          <p className="text-dark-700">
            Welcome back! Please login to your account.
          </p>

        </section>
        <CustomForm
        formFields={formF.INPUT}
        control={form.control}
        name="name"
        label="Username"
        placeholder="Enter Username" 
        iconSrc="/asserts/icon/user.svg"
        iconAlt="Username"
        />
        <CustomForm
          formFields={formF.PASS}

          control={form.control}
          name="password"
          label="Password"
          placeholder="Enter Password"
          iconSrc="/asserts/icon/pass.svg"
          iconAlt="pass"

          

        />
        
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}

export default Patient;
