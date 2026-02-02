import { cn } from "@/lib/utils";

interface AdSidebarProps {
  position: "left" | "right";
  className?: string;
}

export function AdSidebar({ position, className }: AdSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden xl:flex flex-col gap-6 w-[160px] flex-shrink-0 pt-8", // Width fixed to 160px (standard skyscraper ad width)
        className
      )}
    >
      {/* Ad Slot 1 */}
      <div className="w-full h-[600px] bg-gray-100 border border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 text-xs p-4 text-center sticky top-24">
        <span className="font-semibold mb-1">Ad Space</span>
        <span>160 x 600</span>
        <span className="mt-2 text-[10px] text-gray-300">(Vertical Banner)</span>
      </div>

      {/* Ad Slot 2 (Optional, flows below if content is long) */}
      <div className="w-full h-[250px] bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
         <span>Ad Space</span>
      </div>
    </aside>
  );
}