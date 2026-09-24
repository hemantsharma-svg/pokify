import { cn } from "@/lib/utils";
import { Music } from "lucide-react";

interface CoverArtProps {
  gradient: string;
  size?: "sm" | "md" | "lg" | "xl";
  rounded?: "sm" | "full";
  className?: string;
}

const sizes: Record<string, string> = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-40 w-40",
  xl: "h-56 w-56",
};

export function CoverArt({ gradient, size = "md", rounded = "sm", className }: CoverArtProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br shadow-lg",
        gradient,
        sizes[size],
        rounded === "full" ? "rounded-full" : "rounded-md",
        className
      )}
    >
      <Music className="h-1/3 w-1/3 text-white/70" />
    </div>
  );
}
