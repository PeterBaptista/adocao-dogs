"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut, PawPrint } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { PUPPY_STATUSES, STATUS_LABELS, type Puppy, type PuppyStatus } from "@/lib/puppies"

async function fetchPuppies(): Promise<Puppy[]> {
  const res = await fetch("/api/puppies")
  if (!res.ok) throw new Error("Falha ao carregar filhotes")
  return res.json()
}

async function updateStatus({ id, status }: { id: string; status: PuppyStatus }): Promise<Puppy> {
  const res = await fetch(`/api/puppies/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error("Falha ao atualizar status")
  return res.json()
}

const statusStyles: Record<PuppyStatus, string> = {
  disponivel: "bg-primary/10 text-primary",
  reservado: "bg-secondary/15 text-secondary",
  adotado: "bg-muted text-muted-foreground",
}

export function AdminDashboard({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: puppies, isLoading, isError } = useQuery({
    queryKey: ["puppies"],
    queryFn: fetchPuppies,
  })

  const mutation = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["puppies"] }),
  })

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <main className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <PawPrint className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold leading-tight text-secondary">
                Painel de adoção
              </h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-4 font-display text-2xl font-bold text-secondary">Filhotes</h2>

        {isLoading && <p className="text-muted-foreground">Carregando...</p>}
        {isError && <p className="text-destructive">Não foi possível carregar os filhotes.</p>}

        <ul className="space-y-3">
          {puppies?.map((puppy) => (
            <li
              key={puppy.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-3"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={puppy.image || "/placeholder.svg"}
                  alt={puppy.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold text-foreground">
                  {puppy.name}
                </p>
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${statusStyles[puppy.status]}`}
                >
                  {STATUS_LABELS[puppy.status]}
                </span>
              </div>

              <select
                aria-label={`Status de ${puppy.name}`}
                value={puppy.status}
                disabled={mutation.isPending && mutation.variables?.id === puppy.id}
                onChange={(e) =>
                  mutation.mutate({ id: puppy.id, status: e.target.value as PuppyStatus })
                }
                className="rounded-xl border border-input bg-background px-3 py-2 text-sm font-semibold text-foreground outline-none ring-primary/40 focus:ring-2 disabled:opacity-60"
              >
                {PUPPY_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

        {mutation.isError && (
          <p className="mt-4 text-sm text-destructive">Erro ao salvar. Tente novamente.</p>
        )}
      </div>
    </main>
  )
}
