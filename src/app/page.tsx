import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="items bg-background/40 flex h-screen w-full justify-center bg-[url('/newmodely.webp')] bg-cover bg-center bg-blend-overlay">
      <Navigation />
      <div className="-mt-60 flex flex-col justify-center gap-y-12 text-center">
        <div>
          <h2 className="text-7xl font-bold">Launch Engineering</h2>
          {/* <h3 className="text-2xl text-muted-foreground"></h3> */}
        </div>
        {/* <div className="space-x-6">
          <Link href={'/toolbox'}><Button className="w-25 h-10 bg-[#3E6BE2] hover:bg-[#3E6BE2]/80 hover:cursor-pointer transition-all text-white">Toolbox</Button></Link>
          <Link href={'/tracker'}><Button className="w-25 h-10 transition-all hover:cursor-pointer">Tracker</Button></Link>
        </div> */}
      </div>
    </main>
  );
}
