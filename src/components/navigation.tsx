import Link from "next/link";
import UserMenu from "./user-menu";
import { getUserCookie } from "@/lib/auth";

interface NavLinkProps {
  title: string;
  destination: string;
}

export default async function Navigation() {
  const navLinks: NavLinkProps[] = [
    { title: "Home", destination: "/" },
    { title: "Toolbox", destination: "/toolbox" },
    { title: "Tracker", destination: "/tracker" },
  ];

  const cookie = await getUserCookie();

  return (
    <div className="absolute mt-6 w-full">
      <div className="sticky m-auto flex w-1/2 flex-row items-center justify-center rounded-lg bg-black/60 py-3">
        <h1 className="absolute left-6 text-lg">LE</h1>

        <nav className="flex flex-row gap-x-4 text-lg">
          {navLinks.map((link) => {
            return (
              <Link key={link.title} href={link.destination}>
                {link.title}
              </Link>
            );
          })}
        </nav>

        <div className="absolute right-6">
          <UserMenu username={cookie?.username as string} />
        </div>
      </div>
    </div>
  );
}
