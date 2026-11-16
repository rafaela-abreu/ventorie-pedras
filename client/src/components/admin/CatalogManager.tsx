import { useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Pencil, Star, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { CATEGORY_SUGGESTIONS } from "@/lib/site";
import { formatBytes, readFileAsBase64, type UploadPayload } from "@/lib/files";

type CatalogItem = {
  id: number;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  featured: number;
  sortOrder: number;
};

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export default function CatalogManager() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.listItems.useQuery();
  const items = (data ?? []) as CatalogItem[];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORY_SUGGESTIONS[0]);
  const [featured, setFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");

  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<CatalogItem | null>(null);

  const refresh = async () => {
    await Promise.all([utils.admin.listItems.invalidate(), utils.catalog.list.invalidate()]);
  };

  const createItem = trpc.admin.createItem.useMutation({
    onSuccess: async () => {
      toast.success("Foto publicada no catálogo do site.");
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      setFeatured(false);
      setSortOrder("0");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await refresh();
    },
    onError: error => toast.error(error.message || "Não foi possível publicar a foto."),
  });

  const updateItem = trpc.admin.updateItem.useMutation({
    onSuccess: async () => {
      toast.success("Informações atualizadas.");
      setEditing(null);
      await refresh();
    },
    onError: error => toast.error(error.message || "Não foi possível atualizar."),
  });

  const deleteItem = trpc.admin.deleteItem.useMutation({
    onSuccess: async () => {
      toast.success("Foto removida do catálogo.");
      setConfirmDelete(null);
      await refresh();
    },
    onError: error => toast.error(error.message || "Não foi possível excluir."),
  });

  const handleFile = (selected: File | null) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      toast.error("Envie uma imagem JPG, PNG ou WEBP.");
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      toast.error("A imagem deve ter no máximo 8 MB.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    if (!title) {
      setTitle(selected.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const submit = async () => {
    if (!file) {
      toast.error("Escolha a foto que deseja publicar.");
      return;
    }
    if (title.trim().length < 2) {
      toast.error("Informe um título para a foto.");
      return;
    }
    let payload: UploadPayload;
    try {
      payload = await readFileAsBase64(file);
    } catch {
      toast.error("Não foi possível ler a imagem.");
      return;
    }
    createItem.mutate({
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || "Pedras Naturais",
      featured,
      sortOrder: Number(sortOrder) || 0,
      image: {
        fileName: payload.fileName,
        mimeType: payload.mimeType,
        dataBase64: payload.dataBase64,
      },
    });
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-[1.6rem] border border-gold/30 bg-[#3b0522]/60 p-5 sm:p-6">
        <h2 className="font-display text-2xl font-extrabold text-gold">Nova foto do catálogo</h2>
        <p className="mt-1.5 text-sm font-semibold text-gold-soft/85">
          Envie a imagem, escreva o título e publique. Ela aparece no site imediatamente.
        </p>

        <div className="mt-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={event => handleFile(event.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-gold/45 bg-[#2a0317]/50 transition-colors hover:border-gold hover:bg-[#2a0317]/70"
            style={{ minHeight: 220 }}
          >
            {preview ? (
              <img src={preview} alt="Prévia da foto" className="h-56 w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <ImagePlus size={30} className="text-gold" />
                <span className="font-display text-sm font-extrabold text-gold">
                  Clique para escolher a foto
                </span>
                <span className="text-xs font-semibold text-gold-soft/75">
                  JPG, PNG ou WEBP · até 8 MB
                </span>
              </span>
            )}
          </button>
          {file && (
            <p className="mt-2 text-xs font-semibold text-gold-soft/75">
              {file.name} · {formatBytes(file.size)}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="field-label">Título</span>
            <input
              className="field-input mt-2"
              value={title}
              onChange={event => setTitle(event.target.value)}
              placeholder="Ex.: Mármore Verde Imperial"
              maxLength={180}
            />
          </label>

          <label className="block">
            <span className="field-label">Descrição</span>
            <textarea
              className="field-input mt-2 min-h-[92px] resize-y"
              value={description}
              onChange={event => setDescription(event.target.value)}
              placeholder="Acabamento, aplicação, tonalidade..."
              maxLength={2000}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Categoria</span>
              <input
                className="field-input mt-2"
                value={category}
                onChange={event => setCategory(event.target.value)}
                list="categorias-sugeridas"
                maxLength={80}
              />
              <datalist id="categorias-sugeridas">
                {Array.from(
                  new Set([...CATEGORY_SUGGESTIONS, ...items.map(item => item.category)])
                ).map(option => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </label>

            <label className="block">
              <span className="field-label">Ordem de exibição</span>
              <input
                type="number"
                min={0}
                max={9999}
                className="field-input mt-2"
                value={sortOrder}
                onChange={event => setSortOrder(event.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => setFeatured(prev => !prev)}
            className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
              featured
                ? "border-gold bg-gold/15"
                : "border-gold/30 bg-[#2a0317]/40 hover:border-gold/60"
            }`}
          >
            <span className="flex items-center gap-2 font-display text-sm font-bold text-gold">
              <Star size={16} className={featured ? "fill-gold text-gold" : "text-gold"} />
              Destacar no catálogo
            </span>
            <span className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-gold-soft/80">
              {featured ? "Ativado" : "Desativado"}
            </span>
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={createItem.isPending}
            className="btn-light w-full"
          >
            {createItem.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Upload size={18} />
            )}
            Publicar no catálogo
          </button>
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-gold/30 bg-[#3b0522]/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-extrabold text-gold">Fotos publicadas</h2>
            <p className="mt-1 text-sm font-semibold text-gold-soft/85">
              {items.length} {items.length === 1 ? "foto no catálogo" : "fotos no catálogo"}
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-gold-soft">
            <Loader2 size={16} className="animate-spin" />
            Carregando catálogo...
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <p className="mt-6 rounded-2xl border border-gold/20 bg-[#2a0317]/40 p-5 text-sm font-semibold text-gold-soft/85">
            Nenhuma foto publicada ainda. Envie a primeira ao lado para o catálogo aparecer no
            site.
          </p>
        )}

        <div className="mt-5 grid gap-3">
          {items.map(item => (
            <article
              key={item.id}
              className="flex gap-3 rounded-2xl border border-gold/20 bg-[#2a0317]/45 p-3"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-24 w-20 shrink-0 rounded-xl object-cover ring-1 ring-gold/25"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-extrabold text-gold">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-gold-soft/75">
                      {item.category}
                      {item.featured === 1 ? " · Destaque" : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      aria-label="Editar foto"
                      onClick={() => setEditing(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 text-gold transition-colors hover:bg-gold hover:text-[#2a0317]"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      aria-label="Excluir foto"
                      onClick={() => setConfirmDelete(item)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 text-gold transition-colors hover:bg-white hover:text-[#12000a]"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {item.description && (
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug text-gold-soft/80">
                    {item.description}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a000d]/85 p-4 backdrop-blur">
          <div className="w-full max-w-lg rounded-[1.6rem] border border-gold/40 bg-[#2a0317] p-6">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-xl font-extrabold text-gold">Editar foto</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35 text-gold hover:bg-white hover:text-[#12000a]"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
            </div>

            <form
              className="mt-4 space-y-4"
              onSubmit={event => {
                event.preventDefault();
                updateItem.mutate({
                  id: editing.id,
                  title: editing.title,
                  description: editing.description ?? "",
                  category: editing.category,
                  featured: editing.featured === 1,
                  sortOrder: editing.sortOrder,
                });
              }}
            >
              <label className="block">
                <span className="field-label">Título</span>
                <input
                  className="field-input mt-2"
                  value={editing.title}
                  onChange={event => setEditing({ ...editing, title: event.target.value })}
                />
              </label>
              <label className="block">
                <span className="field-label">Descrição</span>
                <textarea
                  className="field-input mt-2 min-h-[88px]"
                  value={editing.description ?? ""}
                  onChange={event => setEditing({ ...editing, description: event.target.value })}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Categoria</span>
                  <input
                    className="field-input mt-2"
                    value={editing.category}
                    onChange={event => setEditing({ ...editing, category: event.target.value })}
                  />
                </label>
                <label className="block">
                  <span className="field-label">Ordem</span>
                  <input
                    type="number"
                    className="field-input mt-2"
                    value={editing.sortOrder}
                    onChange={event =>
                      setEditing({ ...editing, sortOrder: Number(event.target.value) || 0 })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditing({ ...editing, featured: editing.featured === 1 ? 0 : 1 })
                }
                className={`flex w-full items-center gap-2 rounded-2xl border px-4 py-3 font-display text-sm font-bold text-gold ${
                  editing.featured === 1
                    ? "border-gold bg-gold/15"
                    : "border-gold/30 bg-[#3b0522]/60"
                }`}
              >
                <Star size={16} className={editing.featured === 1 ? "fill-gold" : ""} />
                {editing.featured === 1 ? "Em destaque" : "Sem destaque"}
              </button>

              <button type="submit" disabled={updateItem.isPending} className="btn-light w-full">
                {updateItem.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Check size={18} />
                )}
                Salvar alterações
              </button>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a000d]/85 p-4 backdrop-blur">
          <div className="w-full max-w-sm rounded-[1.6rem] border border-gold/40 bg-[#2a0317] p-6 text-center">
            <Trash2 className="mx-auto text-gold" size={26} />
            <h3 className="mt-3 font-display text-xl font-extrabold text-gold">
              Excluir esta foto?
            </h3>
            <p className="mt-2 text-sm font-semibold text-gold-soft/85">
              “{confirmDelete.title}” será removida do catálogo do site.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="btn-outline-gold flex-1 !py-3"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => deleteItem.mutate({ id: confirmDelete.id })}
                disabled={deleteItem.isPending}
                className="btn-light flex-1 !py-3"
              >
                {deleteItem.isPending ? <Loader2 size={16} className="animate-spin" /> : null}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
