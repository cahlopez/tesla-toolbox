import Navigation from "@/components/navigation";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
