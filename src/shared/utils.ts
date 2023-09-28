import { theme } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';

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

export async function getBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    var reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function (e) {
      if (e.target?.result) {
        resolve(e.target?.result as string)
      }
    }
    reader.onerror = function (error) {
      reject(error)
    }
  })
}

export function getSimpleId() {
  const currentDate = new Date()
  const time = String(currentDate.getTime())
  const numeric = time.slice(time.length - 5, time.length - 1)
  const unique = uuidv4().slice(0, 4)

  return numeric + unique
}

export function tiempo(date: string | Date) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + 1)
  return newDate
}

export function getUNIX() {
  return new Date().getTime() / 1000
}