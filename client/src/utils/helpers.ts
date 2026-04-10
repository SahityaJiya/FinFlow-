import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const categoryIcons: Record<string, string> = {
  Food: 'UtensilsCrossed',
  Transport: 'Car',
  Shopping: 'ShoppingBag',
  Entertainment: 'Film',
  Bills: 'Receipt',
  Health: 'Heart',
  Education: 'GraduationCap',
  Travel: 'Plane',
  Groceries: 'Apple',
  Pets: 'PawPrint',
  Salary: 'Banknote',
  Freelance: 'Laptop',
  Investment: 'TrendingUp',
  Gift: 'Gift',
  Other: 'CreditCard',
};

export const categories = [
  { name: 'Food', color: 'text-orange-500' },
  { name: 'Transport', color: 'text-blue-500' },
  { name: 'Shopping', color: 'text-pink-500' },
  { name: 'Entertainment', color: 'text-purple-500' },
  { name: 'Bills', color: 'text-yellow-500' },
  { name: 'Health', color: 'text-red-500' },
  { name: 'Education', color: 'text-indigo-500' },
  { name: 'Travel', color: 'text-cyan-500' },
  { name: 'Groceries', color: 'text-green-500' },
  { name: 'Pets', color: 'text-amber-500' },
  { name: 'Salary', color: 'text-emerald-500' },
  { name: 'Freelance', color: 'text-teal-500' },
  { name: 'Investment', color: 'text-violet-500' },
  { name: 'Gift', color: 'text-rose-500' },
  { name: 'Other', color: 'text-slate-500' },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
