(() => {
  const STORAGE_KEY = 'restore-x-dim-mode-enabled';
  const ROOT_CLASS = 'rxd-dim-enabled';
  const BUTTON_ID = 'rxd-dim-option';

  const setDimEnabled = (enabled) => {
    document.documentElement.classList.toggle(ROOT_CLASS, enabled);
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');
    syncButtonState(enabled);
  };

  const isDimEnabled = () => localStorage.getItem(STORAGE_KEY) === '1';

  const syncButtonState = (enabled) => {
    const button = document.getElementById(BUTTON_ID);
    if (!button) {
      return;
    }

    button.setAttribute('aria-checked', enabled ? 'true' : 'false');
    button.style.borderColor = enabled ? 'rgb(29, 155, 240)' : 'transparent';
    button.style.boxShadow = enabled ? '0 0 0 1px rgb(29, 155, 240)' : 'none';

    const label = button.querySelector('[data-rxd-label="true"]');
    if (label) {
      label.style.fontWeight = enabled ? '700' : '500';
    }
  };

  const clearDimIfNativeThemeChosen = (target) => {
    const nativeThemeButton = target.closest('[role="radio"]');
    if (!nativeThemeButton || nativeThemeButton.id === BUTTON_ID) {
      return;
    }

    const picker = nativeThemeButton.closest('[data-testid="themeColorPicker"]');
    if (!picker) {
      return;
    }

    setDimEnabled(false);
  };

  const createDimButton = (templateButton) => {
    const button = templateButton.cloneNode(true);
    button.id = BUTTON_ID;
    button.setAttribute('aria-label', 'Dim');
    button.setAttribute('aria-checked', 'false');

    button.querySelectorAll('[id]').forEach((node) => node.removeAttribute('id'));

    const labelContainer = button.querySelector('span');
    if (labelContainer) {
      labelContainer.textContent = 'Dim';
      labelContainer.setAttribute('data-rxd-label', 'true');
    }

    const preview = button.querySelector('div[style]');
    if (preview) {
      preview.style.background = 'rgb(21, 32, 43)';
      preview.style.border = '1px solid rgb(56, 68, 77)';
    }

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDimEnabled(true);
    });

    return button;
  };

  const injectDimOption = () => {
    const picker = document.querySelector('[data-testid="themeColorPicker"]');
    if (!picker || document.getElementById(BUTTON_ID)) {
      return;
    }

    const existingButtons = picker.querySelectorAll('[role="radio"]');
    if (existingButtons.length === 0) {
      return;
    }

    const dimButton = createDimButton(existingButtons[existingButtons.length - 1]);
    const parent = existingButtons[existingButtons.length - 1].parentElement;
    if (!parent) {
      return;
    }

    parent.appendChild(dimButton);
    syncButtonState(isDimEnabled());
  };

  if (isDimEnabled()) {
    setDimEnabled(true);
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    clearDimIfNativeThemeChosen(target);
  }, true);

  const observer = new MutationObserver(() => {
    injectDimOption();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  injectDimOption();
})();
