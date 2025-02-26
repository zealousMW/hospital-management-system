"use server";

import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const signInAction = async (values: { name: string; password: string }) => {
  const supabase = await createClient();
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.name,
      password: values.password,
    });

    if (error) {
      return { error: error.message };
    }

    // Successful login - redirect to protected route
    redirect("/dashboard");
    
  } catch (err) {
    return { error: "An unexpected error occurred" };
  }
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export async function logoutAction() {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: any) {
          cookieStore.set(name, "", options);
        },
      },
    }
  );

  await supabase.auth.signOut();
  redirect('/');
}
