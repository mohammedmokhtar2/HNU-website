import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const toast = ({
    title,
    description,
    variant = 'default',
    duration = 4000,
    action,
  }: ToastOptions) => {
    const message =
      title && description
        ? `${title}: ${description}`
        : title || description || '';

    const toastOptions = {
      duration,
      ...(action && {
        action: {
          label: action.label,
          onClick: action.onClick,
        },
      }),
    };

    switch (variant) {
      case 'destructive':
        sonnerToast.error(message, toastOptions);
        break;
      case 'success':
        sonnerToast.success(message, toastOptions);
        break;
      case 'warning':
        sonnerToast.warning(message, toastOptions);
        break;
      case 'info':
        sonnerToast.info(message, toastOptions);
        break;
      default:
        sonnerToast(message, toastOptions);
        break;
    }
  };

  // Convenience methods
  const success = (
    message: string,
    options?: Omit<ToastOptions, 'variant'>
  ) => {
    toast({ title: message, variant: 'success', ...options });
  };

  const error = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
    toast({ title: message, variant: 'destructive', ...options });
  };

  const warning = (
    message: string,
    options?: Omit<ToastOptions, 'variant'>
  ) => {
    toast({ title: message, variant: 'warning', ...options });
  };

  const info = (message: string, options?: Omit<ToastOptions, 'variant'>) => {
    toast({ title: message, variant: 'info', ...options });
  };

  const loading = (message: string, promise?: Promise<any>) => {
    if (promise) {
      return sonnerToast.promise(promise, {
        loading: message,
        success: data => {
          return data?.message || 'Operation completed successfully';
        },
        error: error => {
          return error?.message || 'Operation failed';
        },
      });
    } else {
      return sonnerToast.loading(message);
    }
  };

  return {
    toast,
    success,
    error,
    warning,
    info,
    loading,
  };
};
