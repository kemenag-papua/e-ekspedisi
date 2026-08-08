/**
 * RateLimitService.gs
 *
 * Simple rate limiting berbasis session token.
 * Menggunakan PropertiesService sebagai storage counter.
 *
 * Limit default: 60 request per 60 detik per token.
 * Menghasilkan response 429 jika melebihi limit.
 */

var RateLimitService = (function () {
  var LIMIT = 60;
  var WINDOW_SECONDS = 60;
  var PREFIX = 'RL:';

  /**
   * Cek apakah request diizinkan berdasarkan token
   * @param {string} token - Session token (atau IP/string kosong untuk public)
   * @returns {boolean} true jika diizinkan, false jika melebihi limit
   */
  function isAllowed(token) {
    var key = buildKey(token);
    var store = PropertiesService.getScriptProperties();
    var now = Math.floor(Date.now() / 1000);
    var currentWindow = Math.floor(now / WINDOW_SECONDS);

    var raw = store.getProperty(key);
    var counter = { window: currentWindow, count: 0 };

    if (raw) {
      try {
        counter = JSON.parse(raw);
      } catch (e) {
        counter = { window: currentWindow, count: 0 };
      }
    }

    // Reset jika window berbeda
    if (counter.window !== currentWindow) {
      counter = { window: currentWindow, count: 0 };
    }

    counter.count++;

    // Simpan counter (dengan TTL via properties - GAS tidak support TTL,
    // tapi key akan ter-reset otomatis saat window berubah)
    try {
      store.setProperty(key, JSON.stringify(counter));
    } catch (e) {
      Logger.warn('RateLimitService', 'Gagal simpan counter', e.message);
    }

    return counter.count <= LIMIT;
  }

  /**
   * Menghitung sisa waktu sebelum window reset
   * @returns {number} Detik tersisa
   */
  function windowResetInSeconds() {
    var now = Math.floor(Date.now() / 1000);
    return WINDOW_SECONDS - (now % WINDOW_SECONDS);
  }

  /**
   * Membangun key untuk storage
   * @param {string} token - Token atau identitas
   * @returns {string} Key yang aman
   */
  function buildKey(token) {
    var id = token || 'anonymous';
    // Batasi panjang key (PropertiesService limit key 250 char)
    if (id.length > 64) {
      id = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        id,
        Utilities.Charset.UTF_8
      )
        .map(function (b) {
          return (b & 0xff).toString(16);
        })
        .join('');
    }
    return PREFIX + id;
  }

  /**
   * Membersihkan semua counter rate limit (untuk maintenance)
   */
  function resetAll() {
    var store = PropertiesService.getScriptProperties();
    var keys = store.getKeys();
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(PREFIX) === 0) {
        store.deleteProperty(keys[i]);
      }
    }
  }

  return {
    isAllowed: isAllowed,
    windowResetInSeconds: windowResetInSeconds,
    resetAll: resetAll,
    LIMIT: LIMIT,
    WINDOW_SECONDS: WINDOW_SECONDS,
  };
})();
