/**
 * BaseRepository.gs
 *
 * Repository base untuk akses Google Spreadsheet.
 * Semua repository harus mewarisi kelas ini (Repository Pattern).
 *
 * Aturan (Docs/09-Development-Guide.md):
 * - Repository menangani akses Spreadsheet dan Drive.
 * - Tidak boleh mengakses Spreadsheet langsung dari Controller.
 */

var BaseRepository = (function () {
  /**
   * @param {string} spreadsheetId - ID Google Spreadsheet
   */
  function BaseRepository(spreadsheetId) {
    this.spreadsheetId = spreadsheetId;
  }

  /**
   * Mendapatkan instance Spreadsheet
   * @returns {SpreadsheetApp.Spreadsheet}
   */
  function getSpreadsheet() {
    return SpreadsheetApp.openById(this.spreadsheetId);
  }

  /**
   * Mendapatkan sheet berdasarkan nama
   * @param {string} sheetName - Nama sheet
   * @returns {SpreadsheetApp.Sheet}
   */
  function getSheet(sheetName) {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      throw new Error('Sheet "' + sheetName + '" tidak ditemukan di Spreadsheet');
    }
    return sheet;
  }

  /**
   * Mendapatkan seluruh data sheet sebagai array of objects
   * @param {string} sheetName - Nama sheet
   * @returns {Array} Data objects
   */
  function getAll(sheetName) {
    var sheet = getSheet(sheetName);
    var values = sheet.getDataRange().getValues();
    if (values.length <= 1) return [];
    var headers = values[0];
    var result = [];
    for (var i = 1; i < values.length; i++) {
      var row = {};
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = values[i][j];
      }
      result.push(row);
    }
    return result;
  }

  /**
   * Mencari data berdasarkan kolom
   * @param {string} sheetName - Nama sheet
   * @param {string} columnName - Nama kolom
   * @param {*} value - Nilai yang dicari
   * @returns {object|null} Row data atau null
   */
  function findByColumn(sheetName, columnName, value) {
    var all = getAll(sheetName);
    for (var i = 0; i < all.length; i++) {
      if (String(all[i][columnName]) === String(value)) {
        return all[i];
      }
    }
    return null;
  }

  /**
   * Mencari semua data yang cocok dengan filter
   * @param {string} sheetName - Nama sheet
   * @param {object} filter - { kolom: nilai }
   * @returns {Array} Data yang cocok
   */
  function findWhere(sheetName, filter) {
    var all = getAll(sheetName);
    return all.filter(function (row) {
      for (var key in filter) {
        if (String(row[key]) !== String(filter[key])) return false;
      }
      return true;
    });
  }

  /**
   * Mendapatkan row number berdasarkan ID
   * @param {string} sheetName - Nama sheet
   * @param {string} id - UUID
   * @returns {number} Row number (1-indexed) atau -1
   */
  function getRowByUuid(sheetName, id) {
    var sheet = getSheet(sheetName);
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][0]) === String(id)) {
        return i + 1;
      }
    }
    return -1;
  }

  /**
   * Menyimpan data baru ke sheet
   * @param {string} sheetName - Nama sheet
   * @param {object} data - Data yang disimpan (keys = headers)
   * @returns {object} Data yang disimpan
   */
  function insert(sheetName, data) {
    var sheet = getSheet(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = [];
    for (var i = 0; i < headers.length; i++) {
      row.push(data[headers[i]] !== undefined ? data[headers[i]] : '');
    }
    sheet.appendRow(row);
    return data;
  }

  /**
   * Memperbarui data berdasarkan ID (kolom pertama)
   * @param {string} sheetName - Nama sheet
   * @param {string} id - UUID
   * @param {object} data - Data yang diperbarui
   * @returns {object|null} Data yang diperbarui atau null
   */
  function update(sheetName, id, data) {
    var row = getRowByUuid(sheetName, id);
    if (row === -1) return null;
    var sheet = getSheet(sheetName);
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    for (var i = 0; i < headers.length; i++) {
      if (data[headers[i]] !== undefined) {
        sheet.getRange(row, i + 1).setValue(data[headers[i]]);
      }
    }
    return findById(sheetName, id);
  }

  /**
   * Mencari data berdasarkan ID (kolom pertama)
   * @param {string} sheetName - Nama sheet
   * @param {string} id - UUID
   * @returns {object|null} Row data atau null
   */
  function findById(sheetName, id) {
    return findByColumn(sheetName, 'id', id);
  }

  /**
   * Menghapus data berdasarkan ID (soft delete untuk master data)
   * @param {string} sheetName - Nama sheet
   * @param {string} id - UUID
   * @returns {boolean} true jika berhasil
   */
  function remove(sheetName, id) {
    var row = getRowByUuid(sheetName, id);
    if (row === -1) return false;
    getSheet(sheetName).deleteRow(row);
    return true;
  }

  return {
    getSpreadsheet: getSpreadsheet,
    getSheet: getSheet,
    getAll: getAll,
    findByColumn: findByColumn,
    findWhere: findWhere,
    findById: findById,
    getRowByUuid: getRowByUuid,
    insert: insert,
    update: update,
    remove: remove,
  };
})();
