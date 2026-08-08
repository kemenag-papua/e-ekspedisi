/**
 * Helper untuk export data ke file CSV.
 * Mengikuti standar RFC 4180 (escape koma, quote, newline).
 */

/**
 * Escape nilai agar aman untuk CSV
 * @param {*} value - Nilai
 * @returns {string} Nilai yang di-escape
 */
export function csvEscape(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Konversi array of objects ke CSV string
 * @param {Array<string>} headers - Header kolom
 * @param {Array<Array>} rows - Baris data
 * @returns {string} CSV string
 */
export function toCsvString(headers, rows) {
  const headerLine = headers.map(csvEscape).join(',')
  const body = rows
    .map((row) => row.map((cell) => csvEscape(cell)).join(','))
    .join('\n')
  return `${headerLine}\n${body}`
}

/**
 * Download data sebagai file CSV
 * @param {Array<string>} headers - Header kolom
 * @param {Array<Array>} rows - Baris data
 * @param {string} filename - Nama file (tanpa ekstensi)
 */
export function exportToCsv(headers, rows, filename) {
  const csv = toCsvString(headers, rows)
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
