'use client';

import WordCard from '../word-card';

import s from './styles.module.css';

export default function WordsLayout({ words = [] }) {
  if (words?.length === 0) {
    return (
      <div className={s.noWordsContainer}>
        <div className={s.noWordsContent}>
          <h2 className={s.noWordsTitle}>Просто нет слов</h2>
          <div className={s.noWordsDescription}>
            <p>
              ситуация, когда по вашему поисковому запросу ничего не нашлось или случилась какая-то
              проблема с сетью.
            </p>
            <p>Измените запрос или перезагрузите страницу.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={s.layout}>
      {words.map(({ id, images: [{ responsiveImage }] }) => (
        <WordCard key={id} image={responsiveImage} />
      ))}
    </div>
  );
}
