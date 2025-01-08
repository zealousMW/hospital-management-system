"use server";

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const signInAction = async (values: { name: string; password: string }) => {
  const email = values.name;
  const password = values.password;
  const supabase = await createClient(); // Ensure createClient is properly configured

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Signed in successfully");
    return { success: true };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: "Unexpected error occurred. Please try again later." };
  }
};



export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};
