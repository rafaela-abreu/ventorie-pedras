import { useRef, useState } from "react";
import { Loader2, Music2, Power, Trash2, Upload, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { formatBytes } from "@/lib/files";

const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

export default function MusicManager() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.musicSettings.useQuery();

  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const refresh = async () => {
    await Promise.all([utils.admin.musicSettings.invalidate(), utils.music.get.invalidate()]);
  };

  const toggleEnabled = trpc.admin.setMusicEnabled.useMutation({
    onSuccess: async () => {
      toast.success("Configuração de música atualizada.");
      await refresh();
    },
    onError: error => toast.error(error.message || "Não foi possível atualizar."),
  });

  const remove = trpc.admin.removeMusic.useMutation({
    onSuccess: async () => {
      toast.success("Música removida do site.");
      setConfirmRemove(false);
      await refresh();
    },
    onError: error => toast.error(error.message || "Não foi possível remover."),
  });

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    if (!selected.type.startsWith("audio/")) {
      toast.error("Envie um arquivo de áudio (MP3, M4A, WAV ou OGG).");
      return;
    }
    if (selected.size > MAX_AUDIO_BYTES) {
      toast.error("O áudio deve ter no máximo 20 MB.");
      return;
    }
    setFile(selected);
    if (!title) setTitle(selected.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const submit = async () => {
    if (!file) {
      toast.error("Escolha o arquivo de música.");
      return;
    }
    setIsUploading(true);
    try {
      const response = await fetch("/api/uploads/music", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": file.type,
          "X-File-Name": encodeURIComponent(file.name),
          "X-Upload-Title": encodeURIComponent(title.trim()),
        },
        body: file,
      });
      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Não foi possível enviar a música.");
      }
      toast.success("Música publicada no site. Já está tocando a 50% do volume.");
      setFile(null);
      setTitle("");
      if (inputRef.current) inputRef.current.value = "";
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível enviar a música.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-2">
      <section className="rounded-[1.6rem] border border-gold/30 bg-[#3b0522]/60 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#12000a]">
            <Music2 size={20} />
          </span>
          <div>
            <h2 className="font-display text-2xl font-extrabold text-gold">Música do site</h2>
            <p className="text-sm font-semibold text-gold-soft/85">
              Troque a trilha quando quiser, em poucos cliques.
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-gold/25 bg-[#2a0317]/50 p-4">
          <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold/80">
            Música atual
          </p>
          {isLoading ? (
            <p className="mt-2 text-sm font-semibold text-gold-soft">Carregando...</p>
          ) : data?.url ? (
            <>
              <p className="mt-2 font-display text-lg font-extrabold text-gold">{data.title}</p>
              <audio controls src={data.url} className="mt-3 w-full" preload="none" />
              <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-gold-soft/80">
                <Volume2 size={14} className="text-gold" />
                Volume fixo em 50% no site ·{" "}
                {data.enabled ? "ativa para os visitantes" : "desativada"}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => toggleEnabled.mutate({ enabled: !data.enabled })}
                  disabled={toggleEnabled.isPending}
                  className="btn-outline-gold flex-1 !py-3"
                >
                  <Power size={16} />
                  {data.enabled ? "Desativar no site" : "Ativar no site"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRemove(true)}
                  className="btn-light flex-1 !py-3"
                >
                  <Trash2 size={16} />
                  Remover
                </button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm font-semibold leading-relaxed text-gold-soft/85">
              Nenhuma música cadastrada. Envie o arquivo ao lado para a trilha tocar
              automaticamente quando alguém abrir o site.
            </p>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <input
            ref={inputRef}
            type="file"
            accept="audio/mpeg,audio/mp3,audio/mp4,audio/x-m4a,audio/wav,audio/ogg"
            className="hidden"
            onChange={event => handleFile(event.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-2xl border border-dashed border-gold/45 bg-[#2a0317]/50 px-4 py-8 text-center transition-colors hover:border-gold hover:bg-[#2a0317]/70"
          >
            <Upload size={26} className="text-gold" />
            <span className="font-display text-sm font-extrabold text-gold">
              {data?.url ? "Escolher nova música" : "Escolher arquivo de música"}
            </span>
            <span className="text-xs font-semibold text-gold-soft/75">
              MP3, M4A, WAV ou OGG · até 20 MB
            </span>
          </button>

          {file && (
            <p className="text-xs font-semibold text-gold-soft/80">
              {file.name} · {formatBytes(file.size)}
            </p>
          )}

          <label className="block">
            <span className="field-label">Nome da música (opcional)</span>
            <input
              className="field-input mt-2"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Ex.: Ventorié — Ambiente"
              maxLength={160}
            />
          </label>

          <button
            type="button"
            onClick={submit}
            disabled={isUploading}
            className="btn-light w-full"
          >
            {isUploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            {data?.url ? "Substituir música do site" : "Publicar música no site"}
          </button>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-gold/30 bg-[#3b0522]/60 p-5 sm:p-6">
        <h2 className="font-display text-2xl font-extrabold text-gold">Como funciona</h2>
        <div className="mt-4 space-y-3 text-sm font-semibold leading-relaxed text-gold-soft/90">
          <p>
            A música toca em loop, a <strong className="text-gold">50% do volume</strong>, assim
            que o visitante abre o site.
          </p>
          <p>
            Navegadores de celular e computador podem bloquear o som automático até o primeiro
            toque na tela. Quando isso acontece, o site mostra um botão branco discreto no canto
            inferior esquerdo — “Ativar música” — e o som começa no primeiro toque, rolagem ou
            clique da página.
          </p>
          <p>
            O visitante também pode pausar ou retomar a trilha pelo mesmo botão, sem atrapalhar a
            navegação.
          </p>
          <p className="rounded-2xl border border-gold/25 bg-[#2a0317]/50 p-4 text-gold-soft/85">
            Dica: use músicas instrumentais e leves, em MP3 de até 20 MB, para carregar rápido no
            celular.
          </p>
        </div>
      </section>

      {confirmRemove && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a000d]/85 p-4 backdrop-blur">
          <div className="w-full max-w-sm rounded-[1.6rem] border border-gold/40 bg-[#2a0317] p-6 text-center">
            <Trash2 className="mx-auto text-gold" size={26} />
            <h3 className="mt-3 font-display text-xl font-extrabold text-gold">
              Remover a música?
            </h3>
            <p className="mt-2 text-sm font-semibold text-gold-soft/85">
              O site volta a ficar em silêncio até você enviar outra trilha.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmRemove(false)}
                className="btn-outline-gold flex-1 !py-3"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => remove.mutate()}
                disabled={remove.isPending}
                className="btn-light flex-1 !py-3"
              >
                {remove.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
