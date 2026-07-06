import { PawPrint, Heart } from "lucide-react"

export function PawBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <PawPrint className="absolute left-4 top-10 size-24 rotate-12 text-primary/10 sm:size-32" />
      <PawPrint className="absolute right-8 top-40 size-16 -rotate-12 text-secondary/10 sm:size-24" />
      <Heart className="absolute right-6 top-6 size-20 fill-primary/10 text-primary/10 sm:size-28" />
      <Heart className="absolute left-10 bottom-24 size-16 fill-secondary/10 text-secondary/10" />
      <PawPrint className="absolute right-16 bottom-10 size-28 rotate-45 text-primary/10 sm:size-40" />
      <PawPrint className="absolute left-1/3 bottom-1/3 size-14 -rotate-6 text-primary/[0.07]" />
    </div>
  )
}
