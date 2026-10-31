import styles from './SplitText.module.css';

interface SplitTextProps {
  text: string;
}

/**
 * Splits text into per-character spans for animation (target them with [data-char]).
 * Screen readers get the sentence once, from the hidden copy, and never the letters.
 */
export function SplitText({ text }: SplitTextProps) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, wordIndex) => (
          <span className={styles.word} key={`${word}-${wordIndex}`}>
            {Array.from(word).map((char, charIndex) => (
              <span className={styles.char} data-char="" key={charIndex}>
                {char}
              </span>
            ))}{' '}
          </span>
        ))}
      </span>
    </>
  );
}
