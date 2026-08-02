/* ═══════════════════════════════════════════════════════════
   TaskFlow Admin — Dynamic Form Builder
   ═══════════════════════════════════════════════════════════ */

class FormBuilder {
  /**
   * Render a form dynamically based on schema
   * @param {Array} fields - Form fields schema
   * @param {Object} initialData - Initial values
   * @param {Function} onSubmit - Submit callback (returns Promise)
   * @returns {HTMLElement} Form element
   */
  static build(fields, initialData = {}, onSubmit) {
    const form = document.createElement('form');
    form.className = 'dynamic-form';

    // Group fields if they have `col` property (for 2-column layout)
    let currentRow = null;

    fields.forEach(field => {
      if (field.type === 'hidden') {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field.name;
        input.value = initialData[field.name] || field.value || '';
        form.appendChild(input);
        return;
      }

      const formGroup = document.createElement('div');
      formGroup.className = 'form-group';
      
      // Label
      if (field.label) {
        const label = document.createElement('label');
        label.className = 'form-label';
        label.htmlFor = `field_${field.name}`;
        label.innerHTML = `${field.label}${field.required ? '<span class="required">*</span>' : ''}`;
        formGroup.appendChild(label);
      }

      // Input
      let inputContainer = formGroup;
      let inputEl = null;
      const value = initialData[field.name] !== undefined ? initialData[field.name] : (field.default || '');

      if (field.type === 'textarea') {
        inputEl = document.createElement('textarea');
        inputEl.className = 'form-textarea';
        inputEl.value = value;
      } else if (field.type === 'select') {
        inputEl = document.createElement('select');
        inputEl.className = 'form-select';
        
        if (field.placeholder) {
          const opt = document.createElement('option');
          opt.value = '';
          opt.textContent = field.placeholder;
          opt.disabled = true;
          if (!value) opt.selected = true;
          inputEl.appendChild(opt);
        }

        (field.options || []).forEach(opt => {
          const optionEl = document.createElement('option');
          optionEl.value = opt.value;
          optionEl.textContent = opt.label;
          if (String(value) === String(opt.value)) optionEl.selected = true;
          inputEl.appendChild(optionEl);
        });
      } else if (field.type === 'checkbox') {
        formGroup.classList.remove('form-group');
        formGroup.className = 'form-check';
        
        inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.checked = !!value;
        
        // Re-arrange for checkbox: Input first, then label
        formGroup.innerHTML = '';
        formGroup.appendChild(inputEl);
        
        const label = document.createElement('label');
        label.htmlFor = `field_${field.name}`;
        label.textContent = field.label;
        formGroup.appendChild(label);
      } else {
        inputEl = document.createElement('input');
        inputEl.type = field.type || 'text';
        inputEl.className = 'form-input';
        
        // Special formatting for datetime-local
        if (field.type === 'datetime-local' && value) {
          // Format ISO string to match input format YYYY-MM-DDTHH:MM
          try {
            const date = new Date(value);
            // adjust timezone offset
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            inputEl.value = date.toISOString().slice(0,16);
          } catch(e) {
            inputEl.value = value;
          }
        } else {
          inputEl.value = value;
        }
        
        if (field.placeholder) inputEl.placeholder = field.placeholder;
        if (field.step) inputEl.step = field.step;
        if (field.min) inputEl.min = field.min;
      }

      if (inputEl) {
        inputEl.id = `field_${field.name}`;
        inputEl.name = field.name;
        if (field.required) inputEl.required = true;
        if (field.type !== 'checkbox') inputContainer.appendChild(inputEl);
      }

      // Add to layout
      if (field.col === 2) {
        if (!currentRow) {
          currentRow = document.createElement('div');
          currentRow.className = 'form-row';
          form.appendChild(currentRow);
        }
        currentRow.appendChild(formGroup);
        if (currentRow.children.length === 2) {
          currentRow = null; // Reset for next row
        }
      } else {
        if (currentRow) {
          // Finish previous row if uneven
          currentRow = null;
        }
        form.appendChild(formGroup);
      }
    });

    // Form submit handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!onSubmit) return;

      const formData = new FormData(form);
      const data = {};
      
      fields.forEach(field => {
        if (field.type === 'checkbox') {
          data[field.name] = form.querySelector(`[name="${field.name}"]`).checked;
        } else if (field.type === 'number') {
          data[field.name] = Number(formData.get(field.name));
        } else if (field.type === 'datetime-local') {
          // Ensure it's passed as ISO
          const val = formData.get(field.name);
          data[field.name] = val ? new Date(val).toISOString() : null;
        } else {
          data[field.name] = formData.get(field.name);
        }
      });

      // Submit button state
      const submitBtn = document.getElementById('modal-submit-btn'); // Assuming modal usage
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      
      try {
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.classList.add('btn-loading');
        }
        
        await onSubmit(data);
        
      } catch (err) {
        if (window.toast) window.toast.error(err.message);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('btn-loading');
          submitBtn.innerHTML = originalText;
        }
      }
    });

    return form;
  }
}

window.FormBuilder = FormBuilder;
