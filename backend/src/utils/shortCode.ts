const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const SHORT_CODE_LENGTH = 5;

/**
 * Generates a random alphanumeric short code of specified length
 * @param length - Length of the short code (default: 5)
 * @returns Random alphanumeric string
 */
export function generateShortCode(length: number = SHORT_CODE_LENGTH): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * ALPHANUMERIC.length);
    result += ALPHANUMERIC[randomIndex];
  }
  return result;
}
