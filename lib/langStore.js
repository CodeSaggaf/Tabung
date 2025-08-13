import { create } from 'zustand'

export const useLang = create((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang })
}))

export const t = (lang, key) => {
  const en = {
    appName: 'Tabung',
    beta: 'Beta',
    login: 'Login',
    logout: 'Logout',
    signup: 'Sign Up',
    email: 'Email',
    password: 'Password',
    or: 'or',
    toDashboard: 'Go to Dashboard',
    savings: 'Savings Goal',
    target: 'Target Amount',
    current: 'Current Amount',
    add: 'Add',
    update: 'Update',
    delete: 'Delete',
    export: 'Export CSV',
    balance: 'Balance',
    language: 'Language',
    english: 'English',
    malay: 'BM',
    feedback: 'Feedback',
    summary: 'Summary',
    goals: 'Goals',
    noGoals: 'No goals yet.'
  }
  const bm = {
    appName: 'Tabung',
    beta: 'Beta',
    login: 'Log Masuk',
    logout: 'Log Keluar',
    signup: 'Daftar',
    email: 'Emel',
    password: 'Kata Laluan',
    or: 'atau',
    toDashboard: 'Ke Papan Pemuka',
    savings: 'Matlamat Simpanan',
    target: 'Jumlah Sasaran',
    current: 'Jumlah Terkini',
    add: 'Tambah',
    update: 'Kemas Kini',
    delete: 'Padam',
    export: 'Muat Turun CSV',
    balance: 'Baki',
    language: 'Bahasa',
    english: 'English',
    malay: 'BM',
    feedback: 'Maklum Balas',
    summary: 'Ringkasan',
    goals: 'Matlamat',
    noGoals: 'Belum ada matlamat.'
  }
  return (lang === 'bm' ? bm : en)[key] || key
}
