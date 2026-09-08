/**
 * Builds a wa.me deep link that opens WhatsApp with a prefilled message.
 * `number` should be in international format without symbols, e.g. "91XXXXXXXXXX".
 */
export function buildWhatsAppLink(number: string, message: string): string {
  const digits = number.replace(/[^\d]/g, '');
  const base = digits ? `https://wa.me/${digits}` : 'https://wa.me/';
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function formatInr(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}
