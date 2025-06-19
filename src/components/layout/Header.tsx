import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Zap className="h-8 w-8 mr-2 text-accent" />
        <h1 className="text-2xl font-headline font-semibold">QuakeChat</h1>
      </div>
    </header>
  );
}
