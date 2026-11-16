# TODO — Site Ventorié Pedras

## 1. Identidade visual aplicada em todo o site — concluído
- Fundo roxo fúcsia/magenta em todas as seções do site (sem áreas brancas de fundo).
- Toda a escrita em dourado bem nítido, com fonte arredondada (Baloo 2 / Nunito), grande, em negrito e destacada.
- Botões brancos com texto preto em todo o site (header, hero, catálogo, contato, painel).
- Logotipo fornecido (VENTORIÉ PEDRAS / Márcia Júlia / Designer de Interiores) no cabeçalho, hero, seção sobre, contato e rodapé.
- Layout moderno, elegante, sofisticado e responsivo (celular, tablet e desktop).

## 2. Cabeçalho, navegação e apresentação — concluído
- Cabeçalho fixo com logotipo, identificação de Márcia Júlia como designer de interiores e navegação pelas seções (Sobre, Serviços, Catálogo, Contato).
- Hero com chamada principal, botão branco "Enviar orçamento" e botão secundário "Explorar o catálogo".
- Seção institucional sobre a Ventorié Pedras e a proposta de atendimento e design de interiores.

## 3. Serviços — concluído
- Seção com Pedras Naturais, Mármores, Granitos, Revestimentos e Design de Interiores, cada um com descrição própria, ícones e cartão de atendimento.

## 4. Catálogo público dinâmico — concluído
- Galeria com fotos vindas do banco de dados, exibindo título, descrição e categoria.
- Filtro por categoria e visualização ampliada da foto (lightbox) com CTA de orçamento.
- Fotos publicadas pelo painel aparecem imediatamente no catálogo do site.

## 5. Área administrativa protegida por senha — concluído
- Rota /admin com login por senha, sessão em cookie httpOnly (SameSite=None; Secure), bloqueio de tentativas excessivas e logout.
- Todas as rotas de gestão exigem sessão válida; alteração de senha disponível na aba "Segurança".

## 6. Gestão do catálogo no painel — concluído
- Upload de fotos com validação de formato e tamanho (JPG/PNG/WEBP até 8 MB), gravadas no armazenamento do projeto.
- Adicionar/editar título, descrição, categoria, destaque e ordem dos itens.
- Excluir itens do catálogo com confirmação.

## 7. Música de fundo gerenciável — concluído
- Painel com envio/troca de música (MP3, M4A, WAV, OGG até 20 MB), nome da faixa, ativar/desativar e remover.
- Reprodução em loop a 50% do volume ao entrar no site, com botão discreto de ativar/pausar quando o navegador bloqueia o áudio automático.

## 8. Contato, WhatsApp e Instagram — concluído
- E-mail pedrasventorie@gmail.com visível e clicável (mailto).
- Instagram @ventoriepedras com link para https://www.instagram.com/ventoriepedras.
- Botão branco "Enviar orçamento" abrindo o WhatsApp +55 61 98573-7591 com a mensagem pré-preenchida "Gostaria de realizar um orçamento com a empresa VentoriÉ Pedras".
- Botão flutuante de WhatsApp em todas as páginas e nome de Márcia Júlia na área de contato.

## 9. Publicação e entrega — em andamento
- Build de produção validado (dist/index.js + dist/public), checkpoint salvo e site publicado.
