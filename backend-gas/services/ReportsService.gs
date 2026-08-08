/**
 * ReportsService.gs
 *
 * Service untuk business logic laporan surat keluar.
 * Menyediakan data laporan dengan filter dan ringkasan statistik.
 *
 * Mengacu pada:
 * - Docs/03-PRD.md Modul Laporan
 * - Docs/07-UI-UX-User-Journey.md Sitemap (Laporan)
 */

var ReportsService = (function () {
  /**
   * Mendapatkan laporan surat keluar dengan filter
   * @param {object} filters - { status, unitId, dateFrom, dateTo, search }
   * @returns {object} { items, summary }
   */
  function getSuratReport(filters) {
    var surats = SuratService.getAll({});
    filters = filters || {};

    if (filters.status) {
      surats = surats.filter(function (s) {
        return s.status === filters.status;
      });
    }
    if (filters.unitId) {
      surats = surats.filter(function (s) {
        return s.unit_id === filters.unitId;
      });
    }
    if (filters.dateFrom) {
      var from = new Date(filters.dateFrom + 'T00:00:00');
      surats = surats.filter(function (s) {
        return new Date(s.tanggal_surat).getTime() >= from.getTime();
      });
    }
    if (filters.dateTo) {
      var to = new Date(filters.dateTo + 'T23:59:59');
      surats = surats.filter(function (s) {
        return new Date(s.tanggal_surat).getTime() <= to.getTime();
      });
    }
    if (filters.search) {
      var q = String(filters.search).toLowerCase();
      surats = surats.filter(function (s) {
        return (
          String(s.nomor_surat).toLowerCase().indexOf(q) !== -1 ||
          String(s.perihal).toLowerCase().indexOf(q) !== -1
        );
      });
    }

    // Hitung ringkasan
    var summary = buildSummary(surats);

    return {
      items: surats,
      summary: summary,
    };
  }

  /**
   * Membangun ringkasan statistik dari daftar surat
   * @param {Array} surats - Daftar surat terfilter
   * @returns {object} Ringkasan
   */
  function buildSummary(surats) {
    var draft = 0;
    var menunggu = 0;
    var diterima = 0;
    var unitCount = {};

    for (var i = 0; i < surats.length; i++) {
      var s = surats[i];
      if (s.status === 'draft') draft++;
      else if (s.status === 'menunggu_pengambilan') menunggu++;
      else if (s.status === 'diterima') diterima++;

      if (s.unit_name) {
        unitCount[s.unit_name] = (unitCount[s.unit_name] || 0) + 1;
      }
    }

    var unitTerbanyak = '';
    var maxCount = 0;
    for (var unit in unitCount) {
      if (unitCount[unit] > maxCount) {
        maxCount = unitCount[unit];
        unitTerbanyak = unit + ' (' + unitCount[unit] + ')';
      }
    }

    return {
      total: surats.length,
      draft: draft,
      menunggu: menunggu,
      diterima: diterima,
      unitTerbanyak: unitTerbanyak,
    };
  }

  return {
    getSuratReport: getSuratReport,
    buildSummary: buildSummary,
  };
})();
