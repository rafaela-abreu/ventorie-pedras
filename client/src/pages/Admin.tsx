import { useState } from "react";
import { ExternalLink, Image as ImageIcon, Loader2, LogOut, Music2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { LOGO_EMBLEM } from "@/lib/site";
import AdminLogin from "@/components/admin/AdminLogin";
import CatalogManager from "@/components/admin/CatalogManager";
import MusicManager from "@/components/admin/MusicManager";
import SecurityManager from "@/components/admin/SecurityManager";

type Tab = "catalogo" | "musica" | "seguranca";

const TABS: Array<{ id: Tab; label: string; icon: typeof ImageIcon }> = [
  { id: "catalogo", label: "Catálogo", icon: ImageIcon },
  { id: "musica", label: "Música", icon: Music2 },
  { id: "seguranca", label: "Segurança", icon: ShieldCheck },
];

export default function Admin() {
  const utils = trpc.useUtils();
  const status = trpc.admin.status.useQuery(undefined, { retry: false });
  const [tab, setTab] = useState<Tab>("catalogo");

  const logout = trpc.admin.logout.useMutation({
    onSuccess: async () => {
      await utils.admin.status.invalidate();
      toast.success("Sessão encerrada.");
    },
  });

  if (status.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={28} />
      </div>
    );
  }

  if (!status.data?.authenticated) {
    return <AdminLogin onSuccess={() => void status.refetch()} />;
  }

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-gold/25 bg-[#3b0522]/80 backdrop-blur">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_EMBLEM}
              alt="Ventorié Pedras"
              className="h-11 w-auto rounded-xl ring-1 ring-gold/40"
            />
            <div>
              <p className="font-display text-lg font-extrabold tracking-[0.14em] text-gold">
                PAINEL VENTORIÉ PEDRAS
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-soft/80">
                Catálogo · Música · Segurança
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a href="/" className="btn-outline-gold !px-5 !py-2.5 text-sm">
              <ExternalLink size={15} />
              Ver site
            </a>
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="btn-light !px-5 !py-2.5 text-sm"
            >
              {logout.isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <LogOut size={15} />
              )}
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mt-8">
        <div className="flex flex-wrap gap-2">
          {TABS.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-display text-sm font-extrabold transition-all ${
                  active
                    ? "border-white bg-white text-[#12000a]"
                    : "border-gold/40 bg-[#3b0522]/50 text-gold hover:border-gold hover:bg-[#5c0838]/70"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-7">
          {tab === "catalogo" && <CatalogManager />}
          {tab === "musica" && <MusicManager />}
          {tab === "seguranca" && <SecurityManager />}
        </div>

        <p className="mt-10 text-center text-xs font-semibold text-gold-soft/60">
          Ventorié Pedras · Márcia Júlia, idealizadora da marca · pedrasventorie@gmail.com
        </p>
      </div>
    </div>
  );
}
