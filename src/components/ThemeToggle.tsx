import { content } from '../content/content';
import { useTheme } from '../providers/ThemeProvider';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label = theme === 'dark' ? content.nav.themeToLight : content.nav.themeToDark;

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={label}
      data-theme-state={theme}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <mask id="theme-toggle-moon">
          <rect width="24" height="24" fill="#fff" />
          <circle className={styles.bite} cx="24" cy="4" r="8" fill="#000" />
        </mask>
        <circle
          className={styles.body}
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask="url(#theme-toggle-moon)"
        />
        <g className={styles.rays} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </g>
      </svg>
    </button>
  );
}
