// Dados de contato da loja, usados no botão flutuante e no rodapé.
export const WHATSAPP_NUMBER = "559392470918"; // +55 93 9247-0918

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
