import { PawPrint } from "lucide-react"
import { Highlighter } from "@/components/ui/highlighter"

export function Hero() {
  return (
    <header className="relative mx-auto max-w-4xl px-6 pt-16 pb-10 text-center sm:pt-24">
      <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full bg-secondary/10 px-4 py-1.5 text-sm font-bold text-secondary">
        <PawPrint className="size-4" />
        <span>7 filhotes esperando por você</span>
      </div>

      <h1 className="font-display text-5xl font-extrabold leading-none tracking-tight text-secondary text-balance sm:text-7xl">
        Adoção
        <span className="mt-1 block text-3xl font-bold text-primary sm:text-5xl">
          responsável
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
        Cada um desses cachorrinhos está pronto para{" "}
        <Highlighter action="highlight" color="#f28c28" strokeWidth={2}>
          <span className="text-foreground">encher a sua casa de amor</span>
        </Highlighter>
        . Escolha o seu favorito e dê o primeiro passo para uma nova amizade.
      </p>
    </header>
  )
}
