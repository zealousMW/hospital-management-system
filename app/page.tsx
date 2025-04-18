import Patient from "@/components/loginpage";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="flex w-full max-w-7xl rounded-2xl bg-white shadow-2xl">
          <div className="flex-1 p-8 md:p-12">
            <div className="flex items-center gap-3">
              <Image
                src={"/asserts/College.jpg"}
                alt="Hospital"
                width={40}
                height={40}
                className="mb-8"
              />
              <h1 className="mb-8 text-2xl font-bold text-gray-900">
                Govt. Siddha Medical College - Palayamkottai
              </h1>
            </div>
            <Patient />
            <div className="mt-8 flex flex-col gap-4">
              <Link
                href="/?admin=true"
                className="text-blue-600 hover:text-blue-700 font-medium self-end"
              >
                Admin Login
              </Link>
              <div className="text-center text-xs text-gray-500">
                <p>© 2024 Siddha Hospital. All rights reserved.</p>
                <p>Licensed </p>
              </div>
            </div>
          </div>

          <div className="hidden md:block md:w-1/2">
            <Image
              src={"/asserts/image.png"}
              alt="Doctor"
              width={1000}
              height={1000}
              className="h-full w-full rounded-r-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
