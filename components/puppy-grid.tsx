"use client"

import { useState } from "react"
import { type Puppy } from "@/lib/puppies"
import { PuppyCard } from "@/components/puppy-card"
import { AdoptionDialog } from "@/components/adoption-dialog"

export function PuppyGrid({ puppies }: { puppies: Puppy[] }) {
  const [selected, setSelected] = useState<Puppy | null>(null)

  return (
    <section id="filhotes" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {puppies.map((puppy) => (
          <PuppyCard key={puppy.id} puppy={puppy} onSelect={setSelected} />
        ))}
      </div>

      <AdoptionDialog puppy={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
