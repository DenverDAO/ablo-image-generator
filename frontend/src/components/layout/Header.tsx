import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex gap-6 md:gap-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Ablo Image Generator
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button>Connect Wallet</Button>
        </div>
      </div>
    </header>
  );
}
