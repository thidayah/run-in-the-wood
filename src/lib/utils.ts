import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string = '') {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit'
  })
}

export function formatDateTime(dateString: string = '') {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function normalizePhoneNumber(phone: string) {
  if (!phone) return '';

  // remove all characters except numbers
  let cleaned = phone.replace(/\D/g, '');

  // first 0 → 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }

  else if (cleaned.startsWith('62')) {
    return cleaned;
  }

  else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }

  return cleaned;
}