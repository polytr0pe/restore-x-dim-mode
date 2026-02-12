(() => {
  const STORAGE_KEY = 'restore-x-dim-mode-enabled';
  const toggle = document.getElementById('dim-toggle');

  const load = async () => {
    const data = await chrome.storage.local.get(STORAGE_KEY);
    toggle.checked = Boolean(data[STORAGE_KEY]);
  };

  toggle.addEventListener('change', async () => {
    await chrome.storage.local.set({ [STORAGE_KEY]: toggle.checked });
  });

  void load();
})();
