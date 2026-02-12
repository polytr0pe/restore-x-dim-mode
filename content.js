(() => {
  const STORAGE_KEY = 'restore-x-dim-mode-enabled';
  const ROOT_CLASS = 'rxd-dim-enabled';
  const BUTTON_ID = 'rxd-dim-option';

  const root = document.documentElement;

  const applyDimClass = (enabled) => {
    root.classList.toggle(ROOT_CLASS, enabled);
    root.dataset.rxdDimEnabled = enabled ? '1' : '0';
  };

  const saveState = async (enabled) => {
    localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0');

    if (!chrome?.storage?.local) {
      return;
    }

    await chrome.storage.local.set({ [STORAGE_KEY]: enabled });
  };

  const loadState = async () => {
    if (chrome?.storage?.local) {
      const stored = await chrome.storage.local.get(STORAGE_KEY);
      if (typeof stored[STORAGE_KEY] === 'boolean') {
        return stored[STORAGE_KEY];
      }
    }

    return localStorage.getItem(STORAGE_KEY) === '1';
  };

  const setDimEnabled = async (enabled) => {
    applyDimClass(enabled);
    await saveState(enabled);
    syncButtonState(enabled);
  };

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
      void setDimEnabled(true);
    });

    return button;
  };

  const injectDimOption = async () => {
    const picker =
      document.querySelector('[data-testid="themeColorPicker"]') ||
      document.querySelector('[aria-label="Background"]');

    if (!picker || document.getElementById(BUTTON_ID)) {
      return;
    }

    const existingButtons = picker.querySelectorAll('[role="radio"]');
    if (existingButtons.length === 0) {
      return;
    }

    const template = existingButtons[existingButtons.length - 1];
    const dimButton = createDimButton(template);
    const parent = template.parentElement;
    if (!parent) {
      return;
    }

    parent.appendChild(dimButton);
    syncButtonState(await loadState());
  };

  const init = async () => {
    applyDimClass(await loadState());

    if (chrome?.storage?.onChanged) {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local' || !changes[STORAGE_KEY]) {
          return;
        }
        applyDimClass(Boolean(changes[STORAGE_KEY].newValue));
        syncButtonState(Boolean(changes[STORAGE_KEY].newValue));
      });
    }

    document.addEventListener(
      'click',
      async (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
          return;
        }

        const nativeThemeButton = target.closest('[role="radio"]');
        const insidePicker = nativeThemeButton?.closest('[data-testid="themeColorPicker"], [aria-label="Background"]');
        if (!nativeThemeButton || !insidePicker || nativeThemeButton.id === BUTTON_ID) {
          return;
        }

        await setDimEnabled(false);
      },
      true
    );

    const observer = new MutationObserver(() => {
      void injectDimOption();
      if (root.dataset.rxdDimEnabled === '1') {
        root.classList.add(ROOT_CLASS);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    void injectDimOption();
  };

  void init();
})();
