export type Sex = "Macho" | "Fêmea"

export type PuppyStatus = "disponivel" | "reservado" | "adotado"

export const PUPPY_STATUSES: PuppyStatus[] = ["disponivel", "reservado", "adotado"]

export const STATUS_LABELS: Record<PuppyStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  adotado: "Adotado",
}

export interface Puppy {
  id: string
  name: string
  sex: Sex
  birth: string
  image: string
  blurb: string
  status: PuppyStatus
}

// Static seed data (no status) — used to seed the DB and as an offline fallback
// when Postgres is unreachable. The DB is the source of truth once seeded.
export type PuppySeed = Omit<Puppy, "status">

export const puppies: PuppySeed[] = [
  {
    id: "bolinho",
    name: "Bolinho",
    sex: "Macho",
    birth: "05/06/26",
    image: "/puppies/bolinho.jpeg",
    blurb: "Carinhoso e brincalhão, adora um colo quentinho.",
  },
  {
    id: "pudim",
    name: "Pudim",
    sex: "Macho",
    birth: "05/06/26",
    image: "/puppies/pudim.jpeg",
    blurb: "Curioso e cheio de energia para explorar o mundo.",
  },
  {
    id: "cookie",
    name: "Cookie",
    sex: "Macho",
    birth: "05/06/26",
    image: "/puppies/cookie.jpeg",
    blurb: "Calminho e dócil, o companheiro perfeito para relaxar.",
  },
  {
    id: "scoobinha",
    name: "Scoobinha",
    sex: "Fêmea",
    birth: "05/06/26",
    image: "/puppies/scoobinha.jpeg",
    blurb: "Doce e observadora, conquista todo mundo com o olhar.",
  },
  {
    id: "safirinha",
    name: "Safirinha",
    sex: "Fêmea",
    birth: "05/06/26",
    image: "/puppies/safirinha.jpeg",
    blurb: "Esperta e cheia de personalidade, uma joia rara.",
  },
  {
    id: "pandinha",
    name: "Pandinha",
    sex: "Fêmea",
    birth: "05/06/26",
    image: "/puppies/pandinha.jpeg",
    blurb: "Fofa e sociável, ama fazer novos amigos.",
  },
  {
    id: "pretinha",
    name: "Pretinha",
    sex: "Fêmea",
    birth: "05/06/26",
    image: "/puppies/pretinha.jpeg",
    blurb: "Meiga e tranquila, pura fofura de olhos brilhantes.",
  },
]

export const contact = {
  name: "7 Patinhas Recife",
  phoneDisplay: "(81) 9 8108-3781",
  whatsapp: "5581981083781",
  instagram: "7patinhasrecife",
}
