/**
 * PegawaiService.gs
 *
 * Service untuk business logic data pegawai (pengguna).
 *
 * Business Rules yang diterapkan:
 * - BR-USR-001: Peran sistem (super_admin, admin, penerima, pimpinan).
 * - Username wajib unik.
 * - Password wajib saat create, di-hash dengan SHA-256.
 * - Password tidak pernah dikembalikan ke client.
 */

var PegawaiService = (function () {
  var VALID_ROLES = [
    AuthMiddleware.ROLES.SUPER_ADMIN,
    AuthMiddleware.ROLES.ADMIN,
    AuthMiddleware.ROLES.PENERIMA,
    AuthMiddleware.ROLES.PIMPINAN,
  ];

  /**
   * Mendapatkan seluruh pegawai (tanpa password)
   * @returns {Array}
   */
  function getAll() {
    var rows = PegawaiRepository.getAll();
    return rows.map(function (row) {
      return AuthService.sanitizeUser(row);
    });
  }

  /**
   * Mendapatkan pegawai berdasarkan ID
   * @param {string} id - UUID pegawai
   * @returns {object} Data pegawai (tanpa password)
   * @throws {NotFoundError}
   */
  function getById(id) {
    var pegawai = PegawaiRepository.findById(id);
    if (!pegawai) {
      throw new NotFoundError('Pegawai tidak ditemukan');
    }
    return AuthService.sanitizeUser(pegawai);
  }

  /**
   * Membuat pegawai baru
   * @param {object} data - Data pegawai
   * @returns {object} Pegawai yang dibuat (tanpa password)
   */
  function create(data) {
    var errors = [];
    if (!data.nama || String(data.nama).trim() === '') {
      errors.push({ field: 'nama', message: 'Nama wajib diisi' });
    }
    if (!data.username || String(data.username).trim() === '') {
      errors.push({ field: 'username', message: 'Username wajib diisi' });
    }
    if (!data.password || String(data.password).length < 6) {
      errors.push({ field: 'password', message: 'Password minimal 6 karakter' });
    }
    if (!data.role || VALID_ROLES.indexOf(data.role) === -1) {
      errors.push({ field: 'role', message: 'Role tidak valid' });
    }
    if (errors.length > 0) {
      throw new ValidationError('Validasi gagal', errors);
    }

    var existing = PegawaiRepository.findByUsername(data.username);
    if (existing) {
      throw new ConflictError('Username sudah digunakan');
    }

    var pegawaiData = {
      nama: data.nama,
      username: data.username,
      password: AuthService.hashPassword(data.password),
      role: data.role,
      unit_id: data.unit_id || '',
      no_hp: data.no_hp || '',
      email: data.email || '',
      is_active: data.is_active !== false,
    };

    var created = PegawaiRepository.insert(pegawaiData);
    return AuthService.sanitizeUser(created);
  }

  /**
   * Memperbarui pegawai
   * @param {string} id - UUID pegawai
   * @param {object} data - Data yang diperbarui
   * @returns {object} Pegawai yang diperbarui
   */
  function update(id, data) {
    getById(id);

    if (data.username) {
      var existing = PegawaiRepository.findByUsername(data.username);
      if (existing && existing.id !== id) {
        throw new ConflictError('Username sudah digunakan');
      }
    }
    if (data.role && VALID_ROLES.indexOf(data.role) === -1) {
      throw new ValidationError('Role tidak valid');
    }

    var updateData = {};
    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.unit_id !== undefined) updateData.unit_id = data.unit_id;
    if (data.no_hp !== undefined) updateData.no_hp = data.no_hp;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.password) {
      updateData.password = AuthService.hashPassword(data.password);
    }

    var updated = PegawaiRepository.update(id, updateData);
    return AuthService.sanitizeUser(updated);
  }

  /**
   * Menghapus pegawai
   * @param {string} id - UUID pegawai
   * @returns {boolean}
   */
  function remove(id) {
    getById(id);
    return PegawaiRepository.remove(id);
  }

  return {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    remove: remove,
  };
})();
