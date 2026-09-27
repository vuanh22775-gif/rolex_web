import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
}

export function formatCompactCurrency(value: number): string {
  return `${(value / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} tỷ ₫`;
}

export function initials(name: string): string {
  return name.split(' ').slice(-2).map((part) => part[0] ?? '').join('').toUpperCase();
}

export function adminPath(path: string): string {
  return `${window.location.pathname.startsWith('/admin') ? '/admin' : ''}${path}`;
}