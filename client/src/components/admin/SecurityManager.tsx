import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function SecurityManager() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePassword = trpc.admin.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: error => toast.error(error.message || "Não foi possível alterar a senha."),
  });

  return (
    <div className="max-w-xl rounded-[1.6rem] border border-gold/30 bg-[#3b0522]/60 p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#12000a]">
          <ShieldCheck size={20} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold text-gold">Segurança do painel</h2>
          <p className="text-sm font-semibold text-gold-soft/85">
            Use pelo menos 12 caracteres e altere a senha quando precisar.
          </p>
        </div>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={event => {
          event.preventDefault();
          if (newPassword.length < 12) {
            toast.error("A nova senha deve ter pelo menos 12 caracteres.");
            return;
          }
          if (newPassword !== confirmPassword) {
            toast.error("A confirmação não confere com a nova senha.");
            return;
          }
          changePassword.mutate({ currentPassword, newPassword });
        }}
      >
        <label className="block">
          <span className="field-label">Senha atual</span>
          <input
            type="password"
            className="field-input mt-2"
            value={currentPassword}
            onChange={event => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
          />
        </label>
        <label className="block">
          <span className="field-label">Nova senha</span>
          <input
            type="password"
            className="field-input mt-2"
            value={newPassword}
            onChange={event => setNewPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className="block">
          <span className="field-label">Confirmar nova senha</span>
          <input
            type="password"
            className="field-input mt-2"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />
        </label>

        <button type="submit" disabled={changePassword.isPending} className="btn-light w-full">
          {changePassword.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ShieldCheck size={18} />
          )}
          Salvar nova senha
        </button>
      </form>
    </div>
  );
}
