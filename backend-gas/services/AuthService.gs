/**
 * AuthService.gs
 *
 * Service untuk business logic autentikasi.
 * - Password hashing (SHA-256 via Utilities.computeDigest)
 * - Token generation dan session management
 * - Verifikasi credential
 *
 * Mengacu pada:
 * - Docs/06-API-Specification.md (Auth endpoints)
 * - Docs/08-Security-Compliance.md (RBAC, BR-SEC-002)
 */

var AuthService = (function () {
  var SALT = 'e-ekspedisi-salt-2026';

  /**
   * Hash password menggunakan SHA-256
   * @param {string} password - Password plain text
   * @returns {string} Hash hex string
   */
  function hashPassword(password) {
    var bytes = Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      SALT + password,
      Utilities.Charset.UTF_8
    );
    return bytes
      .map(function (byte) {
        var val = byte & 0xff;
        return (val < 16 ? '0' : '') + val.toString(16);
      })
      .join('');
  }

  /**
   * Generate session token
   * @returns {string} UUID token
   */
  function generateToken() {
    return Utilities.getUuid() + Utilities.getUuid().replace(/-/g, '');
  }

  /**
   * Login: verifikasi credential dan buat session
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {object} { token, user }
   * @throws {AuthError} Jika credential tidak valid
   */
  function login(username, password) {
    if (!username || !password) {
      throw new ValidationError('Username dan password wajib diisi');
    }

    var user = AuthRepository.findByUsername(username);
    if (!user) {
      Logger.warn('AuthService', 'Login gagal - username tidak ditemukan', username);
      throw new AuthError('Username atau password salah', 401);
    }

    if (String(user.is_active) === 'false') {
      Logger.warn('AuthService', 'Login gagal - akun nonaktif', username);
      throw new AuthError('Akun Anda dinonaktifkan', 401);
    }

    var hashedPassword = hashPassword(password);
    if (hashedPassword !== String(user.password)) {
      Logger.warn('AuthService', 'Login gagal - password salah', username);
      throw new AuthError('Username atau password salah', 401);
    }

    var token = generateToken();
    var session = AuthRepository.createSession(user.id, token);

    Logger.info('AuthService', 'Login berhasil', username);
    AuditService.log(username, 'LOGIN', 'auth', 'Success');

    return {
      token: token,
      token_expires_at: session.expires_at,
      user: sanitizeUser(user),
    };
  }

  /**
   * Logout: hapus session
   * @param {string} token - Session token
   * @returns {boolean}
   */
  function logout(token) {
    if (!token) return false;
    var session = AuthRepository.findSessionByToken(token);
    if (session) {
      var user = AuthRepository.findById(session.user_id);
      var username = user ? user.username : 'unknown';
      AuditService.log(username, 'LOGOUT', 'auth', 'Success');
    }
    return AuthRepository.deleteSession(token);
  }

  /**
   * Mendapatkan user dari token
   * @param {string} token - Session token
   * @returns {object|null} User data (tanpa password) atau null
   */
  function getUserFromToken(token) {
    if (!token) return null;
    maybeCleanupExpiredSessions();
    var session = AuthRepository.findSessionByToken(token);
    if (!session) return null;
    if (String(session.is_active) !== 'true') return null;

    var expiresAt = new Date(session.expires_at);
    if (expiresAt.getTime() < new Date().getTime()) {
      AuthRepository.deleteSession(token);
      return null;
    }

    var user = AuthRepository.findById(session.user_id);
    return user ? sanitizeUser(user) : null;
  }

  /**
   * Cleanup session expired secara berkala (setiap 100 request)
   * untuk menghindari scan session penuh di setiap request (performa).
   */
  function maybeCleanupExpiredSessions() {
    try {
      var props = PropertiesService.getScriptProperties();
      var count = parseInt(props.getProperty('REQ_COUNT') || '0', 10) + 1;
      if (count >= 100) {
        props.setProperty('REQ_COUNT', '0');
        AuthRepository.cleanupExpiredSessions();
      } else {
        props.setProperty('REQ_COUNT', String(count));
      }
    } catch (e) {
      Logger.warn('AuthService', 'Gagal cleanup session berkala', e.message);
    }
  }

  /**
   * Validasi token dan return user
   * @param {string} token - Session token
   * @returns {object} User data
   * @throws {AuthError} Jika token tidak valid
   */
  function validateToken(token) {
    var user = getUserFromToken(token);
    if (!user) {
      throw new AuthError('Sesi tidak valid atau kedaluwarsa', 401);
    }
    return user;
  }

  /**
   * Menghilangkan field sensitif dari user
   * @param {object} user - Data pegawai dari DB
   * @returns {object} User tanpa password
   */
  function sanitizeUser(user) {
    var result = {};
    for (var key in user) {
      if (key !== 'password') {
        result[key] = user[key];
      }
    }
    return result;
  }

  return {
    hashPassword: hashPassword,
    generateToken: generateToken,
    login: login,
    logout: logout,
    getUserFromToken: getUserFromToken,
    maybeCleanupExpiredSessions: maybeCleanupExpiredSessions,
    validateToken: validateToken,
    sanitizeUser: sanitizeUser,
  };
})();
