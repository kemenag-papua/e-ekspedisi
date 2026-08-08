/**
 * DashboardService.gs
 *
 * Service untuk business logic dashboard.
 * Menyediakan KPI summary dan data grafik bulanan.
 *
 * Mengacu pada:
 * - Docs/03A-Functional-Specification-Detail.md Modul 1 (Dashboard)
 * - Docs/06-API-Specification.md §7 (Dashboard endpoints)
 * - Docs/03-PRD.md FR-301, FR-302
 */

var DashboardService = (function () {
  var MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  /**
   * Mendapatkan ringkasan KPI dashboard
   * Cache 60 detik (Sprint 9 - performa)
   * @returns {object} { totalSurat, menungguPengambilan, diterimaHariIni, diterimaBulanIni, auditHariIni }
   */
  function getSummary() {
    return CacheHelper.getCached('dashboard_summary', function () {
      var surats = SuratRepository.getAll();
      var penerimaan = PenerimaanRepository.getAll();
      var audit = AuditService.getAll({});

      var now = DateUtils.now();
      var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      var startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      var totalSurat = surats.length;
      var menungguPengambilan = surats.filter(function (s) {
        return s.status === 'menunggu_pengambilan';
      }).length;

      var diterimaHariIni = penerimaan.filter(function (p) {
        var d = new Date(p.diterima_pada);
        return d.getTime() >= startOfToday.getTime();
      }).length;

      var diterimaBulanIni = penerimaan.filter(function (p) {
        var d = new Date(p.diterima_pada);
        return d.getTime() >= startOfMonth.getTime();
      }).length;

      var auditHariIni = audit.filter(function (a) {
        var d = new Date(a.waktu);
        return d.getTime() >= startOfToday.getTime();
      }).length;

      return {
        totalSurat: totalSurat,
        menungguPengambilan: menungguPengambilan,
        diterimaHariIni: diterimaHariIni,
        diterimaBulanIni: diterimaBulanIni,
        auditHariIni: auditHariIni,
      };
    }, 60);
  }

  /**
   * Mendapatkan data grafik 12 bulan terakhir
   * Cache 300 detik (Sprint 9 - performa)
   * @returns {object} { labels, datasets: { dibuat, diterima } }
   */
  function getChart() {
    return CacheHelper.getCached('dashboard_chart', function () {
      var surats = SuratRepository.getAll();
      var penerimaan = PenerimaanRepository.getAll();

      var now = DateUtils.now();
      var labels = [];
      var dibuat = [];
      var diterima = [];

      for (var i = 11; i >= 0; i--) {
        var monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        var nextMonthStart = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

        labels.push(MONTHS_ID[monthStart.getMonth()] + ' ' + String(monthStart.getFullYear()).slice(2));

        var countDibuat = surats.filter(function (s) {
          var d = new Date(s.created_at);
          return d.getTime() >= monthStart.getTime() && d.getTime() < nextMonthStart.getTime();
        }).length;

        var countDiterima = penerimaan.filter(function (p) {
          var d = new Date(p.diterima_pada);
          return d.getTime() >= monthStart.getTime() && d.getTime() < nextMonthStart.getTime();
        }).length;

        dibuat.push(countDibuat);
        diterima.push(countDiterima);
      }

      return {
        labels: labels,
        datasets: {
          dibuat: dibuat,
          diterima: diterima,
        },
      };
    }, 300);
  }

  /**
   * Mendapatkan surat terbaru untuk dashboard
   * @param {number} limit - Jumlah data
   * @returns {Array} Surat terbaru
   */
  function getRecentSurat(limit) {
    var list = SuratService.getAll({});
    return list.slice(0, limit || 5);
  }

  /**
   * Mendapatkan aktivitas terakhir untuk dashboard
   * @param {number} limit - Jumlah data
   * @returns {Array} Audit log terbaru
   */
  function getRecentActivity(limit) {
    return AuditService.getAll({}).slice(0, limit || 5);
  }

  return {
    getSummary: getSummary,
    getChart: getChart,
    getRecentSurat: getRecentSurat,
    getRecentActivity: getRecentActivity,
  };
})();
