import { toast } from 'react-toastify';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export function showToast(message: string, type: ToastType = 'info', duration: number = 3000) {
  toast[type](message, {
    position: 'top-right',
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export function showSuccessToast(message: string) {
  showToast(message, 'success');
}

export function showErrorToast(message: string) {
  showToast(message, 'error');
}

export function showInfoToast(message: string) {
  showToast(message, 'info');
}

export function showWarningToast(message: string) {
  showToast(message, 'warning');
}

export function showLoadingToast(message: string): void {
  toast.loading(message, {
    position: 'top-right',
  });
}
