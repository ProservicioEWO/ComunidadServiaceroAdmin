import { theme } from '@chakra-ui/react';

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getFirstDay() {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), 1)
}

export function hexFromColorScheme(colorScheme: string) {
  const cs = colorScheme as keyof typeof theme.colors
  return theme.colors[cs][500]
}

export function getRndScheme() {
  const colorSchemes: (keyof typeof theme.colors)[] = Object.keys(theme.colors).filter(
    e => !/^(transparent|white|current|black|([a-z]+\.\d+))/.test(e)
  ).map(e => e as keyof typeof theme.colors)
  const randomIndex = Math.floor(Math.random() * colorSchemes.length)
  return colorSchemes[randomIndex]
}

export function formatDateString(date: string) {
  return new Date(date).toISOString().slice(0, 10)
}

export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}