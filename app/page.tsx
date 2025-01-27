import Patient from "@/components/loginpage";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";


export default async function Home() {
  return (
    <div className="flex h-screen max-h-screen ">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px] float-left">
          <Image
            src={"/asserts/hosipital.svg"}          
            alt="Hospital"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          /> 
          <Patient />
          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
            2025 Made By Maheshwar with ❤️
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
            
           

          </div>

        </div>

      </section>

      <Image
        src={"/asserts/image.png"}
        alt="Doctor"
        width={1000}
        height={1000}
        className="side-img max-w-[50%]"
      ></Image>

    </div>
    
  );
}
