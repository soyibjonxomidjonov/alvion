/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Export Utility (SheetJS wrapper)
   ═══════════════════════════════════════════════════════════ */

class ExportService {
  constructor() {
    this.scriptUrl = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    this.isLoaded = false;
    this.isLoading = false;
  }

  async _loadLibrary() {
    if (this.isLoaded) return true;
    if (window.XLSX) {
      this.isLoaded = true;
      return true;
    }

    if (this.isLoading) {
      // Wait until loaded
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.XLSX) {
            clearInterval(check);
            this.isLoaded = true;
            resolve(true);
          }
        }, 100);
      });
    }

    this.isLoading = true;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = this.scriptUrl;
      script.onload = () => {
        this.isLoaded = true;
        this.isLoading = false;
        resolve(true);
      };
      script.onerror = () => {
        this.isLoading = false;
        reject(new Error('Failed to load SheetJS library'));
      };
      document.head.appendChild(script);
    });
  }

  /**
   * Export array of objects to Excel file
   * @param {Array} data - Data to export
   * @param {String} filename - File name without extension
   * @param {Object} columnMapping - Mapping of keys to column headers
   */
  async exportToExcel(data, filename, columnMapping = null) {
    if (!data || !data.length) {
      if (window.toast) {
        window.toast.warning('Eksport qilish uchun ma\'lumot topilmadi');
      }
      return;
    }

    try {
      await this._loadLibrary();

      // Transform data if column mapping is provided
      const exportData = columnMapping
        ? data.map(item => {
            const mapped = {};
            Object.keys(columnMapping).forEach(key => {
              // Handle nested properties if needed, or function transformers
              let value;
              if (typeof columnMapping[key] === 'object' && columnMapping[key].fn) {
                value = columnMapping[key].fn(item[key], item);
              } else {
                value = item[key];
              }
              const header = typeof columnMapping[key] === 'string' 
                ? columnMapping[key] 
                : columnMapping[key].label;
                
              mapped[header] = value;
            });
            return mapped;
          })
        : data;

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");

      // Auto-size columns loosely based on content
      const colWidths = [];
      exportData.forEach(row => {
        Object.keys(row).forEach((key, i) => {
          const val = row[key] ? String(row[key]) : '';
          const len = Math.max(val.length, key.length);
          if (!colWidths[i] || colWidths[i].wch < len) {
            colWidths[i] = { wch: len + 2 }; // Add padding
          }
        });
      });
      ws['!cols'] = colWidths;

      // Save file
      const finalFilename = `${filename}_${window.helpers.formatDate(new Date()).replace(/ /g, '_')}.xlsx`;
      XLSX.writeFile(wb, finalFilename);

      if (window.toast) {
        window.toast.success('Fayl muvaffaqiyatli yuklab olindi');
      }
    } catch (error) {
      console.error('Export error:', error);
      if (window.toast) {
        window.toast.error('Eksport qilishda xatolik yuz berdi');
      }
    }
  }
}

window.exporter = new ExportService();
