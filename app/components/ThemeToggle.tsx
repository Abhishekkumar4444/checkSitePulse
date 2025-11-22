'use client'

import { useTheme } from '../contexts/ThemeContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (theme !== newTheme) {
      setTheme(newTheme)
    }
  }

  return (
    <div className={styles.themeToggle}>
      <button
        onClick={() => handleThemeChange('light')}
        className={`${styles.themeButton} ${theme === 'light' ? styles.active : ''}`}
        title="Light mode"
        aria-label="Light mode"
        aria-pressed={theme === 'light'}
      >
        <span className={styles.themeIcon}>☀️</span>
        <span className={styles.themeLabel}>Light</span>
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`${styles.themeButton} ${theme === 'dark' ? styles.active : ''}`}
        title="Dark mode"
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
      >
        <span className={styles.themeIcon}>🌙</span>
        <span className={styles.themeLabel}>Dark</span>
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={`${styles.themeButton} ${theme === 'system' ? styles.active : ''}`}
        title="System preference"
        aria-label="System preference"
        aria-pressed={theme === 'system'}
      >
        <span className={styles.themeIcon}>💻</span>
        <span className={styles.themeLabel}>System</span>
      </button>
    </div>
  )
}

