import Image from "next/image";

export default function Toolbox() {
  return (
    <main className="bg-background/25 flex h-screen w-full flex-col items-center justify-center space-y-6 bg-[url('/semitruck1.webp')] bg-cover bg-center bg-blend-overlay">
      <Image
        src="/clubpenguin-rory.webp"
        alt="Club Penguin mascot Rory"
        width={175}
        height={175}
      />

      <h2 className="text-2xl">
        This page is still under construction! Come back later!
      </h2>
    </main>
  );
}
