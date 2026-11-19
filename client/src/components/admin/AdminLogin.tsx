import { useState } from "react";
import { ArrowLeft, KeyRound, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { LOGO_EMBLEM } from "@/lib/site";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const utils = trpc.useUtils();

  const login = trpc.admin.login.useMutation({
    onSuccess: async () => {
      await utils.admin.status.invalidate();
      await utils.admin.listItems.invalidate();
      toast.success("Bem-vinda ao painel da VentoriÊ Pedras.");
      onSuccess();
    },
    onError: error => {
      toast.error(error.message || "Não foi possível entrar.");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <a
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-display text-sm font-bold text-gold/80 transition-colors hover:text-gold"
        >
          <ArrowLeft size={16} />
          Voltar para o site
        </a>

        <div className="rounded-[1.8rem] border border-gold/35 bg-[linear-gradient(165deg,rgba(120,10,70,0.75),rgba(42,3,23,0.95))] p-7 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.95)] sm:p-9">
          <div className="flex items-center gap-3">
            <img
              src={LOGO_EMBLEM}
              alt="VentoriÊ Pedras"
              className="h-12 w-auto rounded-xl ring-1 ring-gold/40"
            />
            <div>
              <p className="font-display text-lg font-extrabold tracking-[0.14em] text-gold">
                VENTORIÊ PEDRAS
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-soft/80">
                Painel administrativo
              </p>
            </div>
          </div>

          <h1 className="mt-7 font-display text-3xl font-extrabold text-gold">
            Acesso restrito
          </h1>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-gold-soft/90">
            Informe a senha do painel para gerenciar as fotos do catálogo e a música do site.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={event => {
              event.preventDefault();
              if (!password) {
                toast.error("Digite a senha do painel.");
                return;
              }
              login.mutate({ password });
            }}
          >
            <label className="block">
              <span className="field-label">Senha</span>
              <div className="relative mt-2">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold/70"
                />
                <input
                  type="password"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="field-input !pl-11"
                />
              </div>
            </label>

            <button type="submit" disabled={login.isPending} className="btn-light w-full">
              {login.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <KeyRound size={18} />
              )}
              Entrar no painel
            </button>
          </form>

          <p className="mt-6 rounded-2xl border border-gold/20 bg-[#2a0317]/50 p-3 text-center text-[11px] font-semibold leading-relaxed text-gold-soft/75">
            Acesso exclusivo da VentoriÊ Pedras. Guarde a senha em local seguro e altere-a em
            “Segurança” sempre que precisar.
          </p>
        </div>
      </div>
    </div>
  );
}
