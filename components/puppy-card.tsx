"use client"

import Image from "next/image"
import { PawPrint, Heart } from "lucide-react"
import { ShineBorder } from "@/components/ui/shine-border"
import { STATUS_LABELS, type Puppy } from "@/lib/puppies"

interface PuppyCardProps {
  puppy: Puppy
  onSelect: (puppy: Puppy) => void
}

export function PuppyCard({ puppy, onSelect }: PuppyCardProps) {
  const isAdopted = puppy.status === "adotado"
  const isReserved = puppy.status === "reservado"
  const isFemale = puppy.sex === "Fêmea"

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      {!isAdopted && (
        <ShineBorder
          borderWidth={2}
          duration={10}
          shineColor={["var(--primary)", "var(--secondary)"]}
          className="z-20"
        />
      )}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={puppy.image || "/placeholder.svg"}
          alt={`Filhote ${puppy.name} para adoção`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            isAdopted ? "grayscale" : ""
          }`}
        />
        <span
          className={`absolute left-3 top-3 z-30 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isFemale ? "bg-pink-500 text-white" : "bg-secondary text-secondary-foreground"
          }`}
        >
          <PawPrint className="size-3" />
          {puppy.sex}
        </span>
        {isAdopted && (
          <span className="absolute right-3 top-3 rounded-full bg-foreground/80 px-3 py-1 text-xs font-bold text-background">
            {STATUS_LABELS.adotado}
          </span>
        )}
        {isReserved && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
            {STATUS_LABELS.reservado}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl font-bold text-secondary">{puppy.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{puppy.blurb}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
          <PawPrint className="size-3.5" />
          Nascimento: {puppy.birth}
        </div>

        {isAdopted ? (
          <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-muted px-4 py-2.5 font-bold text-muted-foreground">
            <Heart className="size-4" />
            Já encontrou um lar 🎉
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSelect(puppy)}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Heart className="size-4" />
            Quero adotar
          </button>
        )}
      </div>
    </article>
  )
}
