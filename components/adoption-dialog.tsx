"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { X, PawPrint } from "lucide-react"
import { contact, type Puppy } from "@/lib/puppies"

interface AdoptionDialogProps {
  puppy: Puppy | null
  onClose: () => void
}

export function AdoptionDialog({ puppy, onClose }: AdoptionDialogProps) {
  const [name, setName] = useState("")
  const [city, setCity] = useState("")

  useEffect(() => {
    if (puppy) {
      setName("")
      setCity("")
    }
  }, [puppy])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (puppy) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [puppy, onClose])

  if (!puppy) return null

  const message = `Olá, Sofia! Vi o anúncio de adoção responsável e me apaixonei pelo(a) ${puppy.name} (${puppy.sex}). ${
    name ? `Meu nome é ${name}` : ""
  }${city ? `, sou de ${city}` : ""}. Gostaria de saber mais sobre a adoção. 🐾`

  const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`

  // Persist who showed interest (fire-and-forget; keepalive so it survives the
  // navigation to WhatsApp). Never block the user's flow if it fails.
  function saveLead() {
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          puppyId: puppy!.id,
          puppyName: puppy!.name,
          name: name.trim() || undefined,
          city: city.trim() || undefined,
        }),
      }).catch(() => {})
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Adotar ${puppy.name}`}
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-card/80 text-foreground transition-colors hover:bg-card"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-4 bg-secondary p-5 text-secondary-foreground">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl border-2 border-primary-foreground/30">
            <Image
              src={puppy.image || "/placeholder.svg"}
              alt={`Filhote ${puppy.name}`}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold opacity-80">Você escolheu</p>
            <h2 className="font-display text-3xl font-bold leading-tight">{puppy.name}</h2>
            <p className="flex items-center gap-1 text-sm opacity-90">
              <PawPrint className="size-3.5" />
              {puppy.sex} · nasc. {puppy.birth}
            </p>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Preencha seus dados para enviar uma mensagem pronta para a {contact.name} pelo WhatsApp.
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="adopt-name" className="mb-1 block text-sm font-bold text-foreground">
                Seu nome
              </label>
              <input
                id="adopt-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos te chamar?"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
              />
            </div>
            <div>
              <label htmlFor="adopt-city" className="mb-1 block text-sm font-bold text-foreground">
                Sua cidade
              </label>
              <input
                id="adopt-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Onde você mora?"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-foreground outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
              />
            </div>
          </div>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={saveLead}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <WhatsAppIcon className="size-5" />
            Falar com a {contact.name}
          </a>

          <a
            href={`https://instagram.com/${contact.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <InstagramIcon className="size-4" />
            @{contact.instagram}
          </a>
        </div>
      </div>
    </div>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
