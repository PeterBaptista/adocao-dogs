import { Phone, PawPrint } from "lucide-react"
import { contact } from "@/lib/puppies"

export function ContactFooter() {
  return (
    <footer className="relative mx-auto max-w-4xl px-6 pb-16">
      <div className="overflow-hidden rounded-3xl bg-secondary px-6 py-8 text-center text-secondary-foreground">
        <PawPrint className="mx-auto mb-3 size-8 text-primary" />
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Entre em contato com a {contact.name}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed opacity-90">
          Ainda com dúvidas? Fale diretamente com a responsável pelos filhotes.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="size-4" />
            {contact.phoneDisplay}
          </a>
          <a
            href={`https://instagram.com/${contact.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-5 py-3 font-bold text-secondary-foreground ring-1 ring-primary-foreground/20 transition-colors hover:bg-primary-foreground/20"
          >
            <InstagramIcon className="size-4" />
            @{contact.instagram}
          </a>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Adote com amor e responsabilidade.
      </p>
    </footer>
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
