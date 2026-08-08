/**
 * Helper validasi dan sanitasi input di sisi frontend.
 * Defense-in-depth (backend juga melakukan sanitasi).
 */

/**
 * Strip pola berbahaya dari string (anti XSS)
 * @param {string} value - Input
 * @returns {string} String yang aman
 */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value
  return value
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*script[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
}

/**
 * Validasi panjang string
 * @param {string} value - Input
 * @param {number} max - Panjang maksimal
 * @returns {boolean} true jika valid
 */
export function isWithinLength(value, max) {
  return String(value || '').length <= max
}

/**
 * Validasi format email sederhana
 * @param {string} email - Email
 * @returns {boolean} true jika valid
 */
export function isValidEmail(email) {
  if (!email) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validasi format nomor telepon (08xxxxxxxxxx)
 * @param {string} phone - No HP
 * @returns {boolean} true jika valid
 */
export function isValidPhone(phone) {
  if (!phone) return true
  return /^(\+62|62|0)[0-9]{8,13}$/.test(phone)
}
