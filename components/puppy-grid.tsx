"use client"

import { useState } from "react"
import { type Puppy } from "@/lib/puppies"
import { PuppyCard } from "@/components/puppy-card"
import { AdoptionDialog } from "@/components/adoption-dialog"

export function PuppyGrid({ puppies }: { puppies: Puppy[] }) {
  const [selected, setSelected] = useState<Puppy | null>(null)

  return (
    <section id="filhotes" className="mx-auto max-w-6xl px-6 pb-16">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {puppies.map((puppy) => (
          <PuppyCard key={puppy.id} puppy={puppy} onSelect={setSelected} />
        ))}
      </div>

      <AdoptionDialog puppy={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
