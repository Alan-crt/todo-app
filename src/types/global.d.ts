export {};

declare global {
  interface Window {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  }
}