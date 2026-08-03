/* ═══════════════════════════════════════════════════════════
   Alvion Admin — Data Table Builder
   Mobile-first: CRUD actions ALWAYS visible
   ═══════════════════════════════════════════════════════════ */

class DataTable {
  /**
   * Build a data table
   * @param {Object} options
   * @param {Array}    options.columns       Column definitions
   * @param {Array}    options.data          Data rows
   * @param {Function} options.onEdit        Edit click handler
   * @param {Function} options.onDelete      Delete click handler
   * @param {Array}    options.customActions Extra action buttons [{type,title,icon,onClick,show}]
   * @param {String}   options.emptyText     Empty state text
   */
  static build(options) {
    const {
      columns    = [],
      data       = [],
      onEdit     = null,
      onDelete   = null,
      customActions = [],
      emptyText  = "Ma'lumot topilmadi"
    } = options;

    const container = document.createElement('div');
    container.className = 'table-container';

    // ── Empty state ──
    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="table-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
            <path d="m9 16 2 2 4-4"/>
          </svg>
          <p>${emptyText}</p>
        </div>
      `;
      return container;
    }

    const hasActions = onEdit || onDelete || customActions.length > 0;

    const table = document.createElement('table');
    table.className = 'data-table striped';

    // ── Desktop: thead ──
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');

    columns.forEach(col => {
      const th = document.createElement('th');
      th.textContent = col.label;
      if (col.width) th.style.width = col.width;
      if (col.align) th.style.textAlign = col.align;
      trHead.appendChild(th);
    });

    if (hasActions) {
      const th = document.createElement('th');
      th.textContent = 'Amallar';
      th.style.width = '1%';         // Shrink to content
      th.style.whiteSpace = 'nowrap';
      th.style.textAlign = 'right';
      trHead.appendChild(th);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    // ── tbody ──
    const tbody = document.createElement('tbody');

    data.forEach(row => {
      const tr = document.createElement('tr');

      // Data cells
      columns.forEach(col => {
        const td = document.createElement('td');
        td.setAttribute('data-label', col.label);
        if (col.align) td.style.textAlign = col.align;

        let value = row[col.key];

        if (col.format === 'date')     value = window.helpers.formatDate(value);
        if (col.format === 'datetime') value = window.helpers.formatDateTime(value);
        if (col.format === 'price')    value = window.helpers.formatPrice(value);

        if (col.render) {
          td.innerHTML = col.render(row[col.key], row);
        } else {
          td.textContent = (value !== null && value !== undefined) ? value : '—';
        }

        tr.appendChild(td);
      });

      // Action cell
      if (hasActions) {
        const td = document.createElement('td');
        td.setAttribute('data-label', 'Amallar');
        td.style.textAlign = 'right';

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'table-actions';

        // Custom actions first
        customActions.forEach(action => {
          if (action.show && !action.show(row)) return;

          const btn = document.createElement('button');
          btn.className = `btn btn-sm btn-${action.type || 'secondary'} table-action-btn`;
          btn.title = action.title || '';
          btn.setAttribute('aria-label', action.title || '');

          // Mobile: icon + text, Desktop: icon only in icon mode
          btn.innerHTML = `${action.icon}<span class="btn-action-label">${action.title || ''}</span>`;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            action.onClick(row);
          });
          actionsDiv.appendChild(btn);
        });

        // Edit
        if (onEdit) {
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm btn-ghost table-action-btn';
          btn.title = 'Tahrirlash';
          btn.setAttribute('aria-label', 'Tahrirlash');
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
            <span class="btn-action-label">Tahrirlash</span>
          `;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onEdit(row);
          });
          actionsDiv.appendChild(btn);
        }

        // Delete
        if (onDelete) {
          const btn = document.createElement('button');
          btn.className = 'btn btn-sm btn-ghost text-danger table-action-btn';
          btn.title = "O'chirish";
          btn.setAttribute('aria-label', "O'chirish");
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
            <span class="btn-action-label">O'chirish</span>
          `;
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onDelete(row);
          });
          actionsDiv.appendChild(btn);
        }

        td.appendChild(actionsDiv);
        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    return container;
  }
}

window.DataTable = DataTable;
