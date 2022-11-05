import WordsLayout from '@/components/words-layout';

import wordsData from '@/lib/words-data.json';

import s from './styles.module.css';

const initialWordIds = wordsData.word_ids;

export default function Page() {
  return (
    <>
      <header className={s.header}>
        <div className={s.content}>
          <h1 className={s.title}>MnogoSlovDna</h1>
        </div>
      </header>
      <WordsLayout words={initialWordIds} />
    </>
  );
}
