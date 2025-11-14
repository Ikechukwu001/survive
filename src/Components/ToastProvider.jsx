// src/Components/ToastProvider.jsx
import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      expand={false}
      richColors
      closeButton
      theme="system"
      toastOptions={{
        style: {
          background: 'var(--toast-bg)',
          color: 'var(--toast-text)',
          border: '1px solid var(--toast-border)',
        },
        className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
      }}
    />
  );
}

// Export toast functions for easy use
export { toast } from 'sonner';