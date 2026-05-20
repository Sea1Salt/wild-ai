import { Leaf, Plus } from "lucide-react";

interface NavProps {
  onAddDevice: () => void;
}

export function Nav({ onAddDevice }: NavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-cream/75 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-900 text-cream shadow-soft">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-bold tracking-normal text-forest-900">
              WILD-AI
            </p>
            <p className="hidden text-xs font-medium text-stone-500 sm:block">
              Wildlife Intelligent Listening & Detection using AI
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onAddDevice}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-900 px-4 py-2.5 text-sm font-semibold text-cream shadow-soft transition hover:bg-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Add Device
        </button>
      </nav>
    </header>
  );
}
