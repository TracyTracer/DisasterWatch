import { Zap, ShieldAlert } from 'lucide-react'; // Using ShieldAlert for a more generic disaster icon

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <ShieldAlert className="h-8 w-8 mr-3 text-accent" /> {/* Updated Icon and margin */}
        <h1 className="text-2xl font-headline font-semibold">DisasterWatch</h1> {/* Updated Title */}
      </div>
    </header>
  );
}
