/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Stats Card Component
   ═══════════════════════════════════════════════════════════ */

class StatsCard {
  /**
   * Build a single stats card
   */
  static build(options) {
    const { label, value, icon, color = 'accent', trend = null } = options;

    const el = document.createElement('div');
    el.className = 'stat-card';
    
    let trendHtml = '';
    if (trend) {
      const isUp = trend > 0;
      trendHtml = `
        <div class="stat-card-trend ${isUp ? 'up' : 'down'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${isUp 
              ? '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>' 
              : '<polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/>'}
          </svg>
          ${Math.abs(trend)}%
        </div>
      `;
    }

    el.innerHTML = `
      <div class="stat-card-icon ${color}">
        ${icon}
      </div>
      <div class="stat-card-content">
        <div class="stat-card-value">${window.helpers.formatNumber(value)}</div>
        <div class="stat-card-label">${label}</div>
        ${trendHtml}
      </div>
    `;

    return el;
  }
}

window.StatsCard = StatsCard;
