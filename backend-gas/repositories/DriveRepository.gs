/**
 * DriveRepository.gs
 *
 * Repository untuk akses Google Drive.
 * Mengelola upload file dan folder penyimpanan.
 *
 * Struktur folder (Docs/05-Database-Data-Dictionary.md):
 * e-Ekspedisi/
 * ├── Surat/
 * ├── Bukti-Penerimaan/
 * ├── Foto/
 * ├── Signature/
 * └── QR/
 */

var DriveRepository = (function () {
  var FOLDERS = {
    SURAT: 'Surat',
    BUKTI_PENERIMAAN: 'Bukti-Penerimaan',
    FOTO: 'Foto',
    SIGNATURE: 'Signature',
    QR: 'QR',
  };

  var ROOT_FOLDER_NAME = 'e-Ekspedisi';

  /**
   * Mencari folder berdasarkan nama, buat jika tidak ada
   * @param {string} folderName - Nama folder
   * @returns {GoogleAppsScript.Drive.Folder}
   */
  function getFolder(folderName) {
    var rootFolders = DriveApp.getFoldersByName(ROOT_FOLDER_NAME);
    var rootFolder;
    if (rootFolders.hasNext()) {
      rootFolder = rootFolders.next();
    } else {
      rootFolder = DriveApp.createFolder(ROOT_FOLDER_NAME);
    }

    var folders = rootFolder.getFoldersByName(folderName);
    if (folders.hasNext()) {
      return folders.next();
    }
    return rootFolder.createFolder(folderName);
  }

  /**
   * Upload file ke Google Drive
   * @param {string} base64Data - Data file dalam base64
   * @param {string} fileName - Nama file (termasuk ekstensi)
   * @param {string} folderKey - Key folder (FOLDERS)
   * @param {string} mimeType - MIME type file
   * @returns {object} { id, name, url }
   * @throws {Error} Jika upload gagal
   */
  function uploadFile(base64Data, fileName, folderKey, mimeType) {
    try {
      var bytes = Utilities.base64Decode(base64Data);
      var folder = getFolder(FOLDERS[folderKey] || folderKey);
      var blob = Utilities.newBlob(bytes, mimeType, fileName);
      var file = folder.createFile(blob);
      return {
        id: file.getId(),
        name: file.getName(),
        url: file.getUrl(),
      };
    } catch (e) {
      Logger.error('DriveRepository', 'Gagal upload file', e.message);
      throw new ValidationError('Upload file gagal', [
        { field: 'file', message: e.message || 'Upload PDF gagal' },
      ]);
    }
  }

  /**
   * Upload PDF surat
   * @param {string} base64Data - Data PDF dalam base64
   * @param {string} fileName - Nama file
   * @returns {object} { id, name, url }
   */
  function uploadPdf(base64Data, fileName) {
    return uploadFile(base64Data, fileName, FOLDERS.SURAT, 'application/pdf');
  }

  /**
   * Mendapatkan file dari Google Drive
   * @param {string} fileId - ID file
   * @returns {GoogleAppsScript.Drive.File|null}
   */
  function getFile(fileId) {
    try {
      return DriveApp.getFileById(fileId);
    } catch (e) {
      return null;
    }
  }

  /**
   * Menghapus file dari Google Drive
   * @param {string} fileId - ID file
   * @returns {boolean}
   */
  function deleteFile(fileId) {
    try {
      var file = DriveApp.getFileById(fileId);
      file.setTrashed(true);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Membuat shareable URL untuk file
   * @param {string} fileId - ID file
   * @returns {string} URL file
   */
  function getFileUrl(fileId) {
    var file = getFile(fileId);
    return file ? file.getUrl() : '';
  }

  /**
   * Mendapatkan ID file dari URL Drive
   * @param {string} url - URL Google Drive
   * @returns {string|null} File ID atau null
   */
  function getIdFromUrl(url) {
    if (!url) return null;
    var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  return {
    FOLDERS: FOLDERS,
    getFolder: getFolder,
    uploadFile: uploadFile,
    uploadPdf: uploadPdf,
    getFile: getFile,
    deleteFile: deleteFile,
    getFileUrl: getFileUrl,
    getIdFromUrl: getIdFromUrl,
  };
})();
