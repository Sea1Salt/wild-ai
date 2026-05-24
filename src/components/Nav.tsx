import { Leaf } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-cream/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-900 text-cream shadow-soft">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-normal text-forest-900">
              AWiSBA
            </p>
            <p className="hidden text-xs font-medium text-stone-500 sm:block">
              AI-Based Wildlife Sound Classification for Biodiversity Assessment
            </p>
          </div>
        </div>
      </nav>
    </header>
  );
}
