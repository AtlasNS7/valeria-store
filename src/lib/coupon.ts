// Geração de código de cupom pro sistema de captura de lead (popup da home).
// Formato: BEMVINDA-XXXX (4 caracteres alfanuméricos maiúsculos aleatórios,
// sem caracteres ambíguos tipo 0/O e 1/I).

export const LEAD_COUPON_PREFIX = "BEMVINDA";
export const LEAD_COUPON_DISCOUNT_PERCENT = 10;

const COUPON_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const COUPON_SUFFIX_LENGTH = 4;

export function generateCouponCode(): string {
  let suffix = "";
  for (let i = 0; i < COUPON_SUFFIX_LENGTH; i++) {
    suffix += COUPON_CHARS[Math.floor(Math.random() * COUPON_CHARS.length)];
  }
  return `${LEAD_COUPON_PREFIX}-${suffix}`;
}
