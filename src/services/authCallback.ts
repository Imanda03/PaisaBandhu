/**
 * Registry for auth logout callback.
 * apiClient uses this to trigger logout on 401/400 without depending on React hooks.
 */
let logoutCallback: (() => void | Promise<void>) | null = null;

export const registerLogoutCallback = (cb: () => void | Promise<void>) => {
  logoutCallback = cb;
};

export const triggerLogout = async () => {
  if (logoutCallback) {
    try {
      await logoutCallback();
    } catch (e) {
      console.error('Logout callback error:', e);
    }
  }
};
