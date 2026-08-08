/**
 * CacheHelper.gs
 *
 * Helper untuk caching menggunakan GAS CacheService.
 * Mengurangi beban baca ke Spreadsheet untuk data yang jarang berubah.
 *
 * Mengacu pada Docs/04A-Google-Apps-Script-Architecture.md:
 * - Gunakan CacheService untuk master data dan konfigurasi.
 */

var CacheHelper = (function () {
  var CACHE = CacheService.getScriptCache();

  /**
   * Mengambil data dari cache, jika tidak ada panggil fetchFn dan simpan
   * @param {string} key - Key cache
   * @param {function} fetchFn - Fungsi untuk mengambil data (jika cache miss)
   * @param {number} ttlSeconds - TTL dalam detik (default 300 = 5 menit)
   * @returns {*} Data dari cache atau fetchFn
   */
  function getCached(key, fetchFn, ttlSeconds) {
    try {
      var cached = CACHE.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      Logger.warn('CacheHelper', 'Cache read error untuk ' + key, e.message);
    }

    var data = fetchFn();
    if (data !== null && data !== undefined) {
      try {
        CACHE.put(key, JSON.stringify(data), ttlSeconds || 300);
      } catch (e) {
        Logger.warn('CacheHelper', 'Cache write error untuk ' + key, e.message);
      }
    }
    return data;
  }

  /**
   * Menghapus data dari cache
   * @param {string} key - Key cache
   */
  function invalidate(key) {
    try {
      CACHE.remove(key);
    } catch (e) {
      Logger.warn('CacheHelper', 'Cache remove error untuk ' + key, e.message);
    }
  }

  /**
   * Menghapus banyak key sekaligus
   * @param {Array<string>} keys - Daftar key
   */
  function invalidateMany(keys) {
    for (var i = 0; i < keys.length; i++) {
      invalidate(keys[i]);
    }
  }

  return {
    getCached: getCached,
    invalidate: invalidate,
    invalidateMany: invalidateMany,
  };
})();
