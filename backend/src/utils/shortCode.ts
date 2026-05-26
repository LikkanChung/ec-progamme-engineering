/**
 * Generates a random alphanumeric short code of specified length
 * @param length - Length of the short code (default: 5)
 * @returns Random alphanumeric string
 */
export function generateShortCode(length: number = 5): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.length);
    result += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[randomIndex];
  }
  return result;
}
