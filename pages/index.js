import { useMemo, useState } from 'react';
import _uniqBy from 'lodash/uniqBy';
import _debounce from 'lodash/debounce';
import cn from 'classnames';

import WordsLayout from '@/components/words-layout';
import SearchInput from '@/components/search-input';

import { getWords, searchInWords } from '@/lib/datocms';

import { INITIAL_PAGES_COUNT, WORDS_PER_PAGE } from '@/lib/constants';

import s from './styles.module.css';

export default function Page({ words: initialWords, wordsCount }) {
  const [words, setWords] = useState(initialWords);
  const [isLoading, setLoading] = useState(false);
  const [findedWords, setFindedWords] = useState([]);
  const [query, setQuery] = useState('');

  const handleSearchInputChange = async ({ target: { value } }) => {
    setQuery(value);
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setFindedWords([]);
      return;
    }

    setLoading(true);

    const searchedWords = await searchInWords(trimmedValue);

    setLoading(false);

    if (searchedWords?.length > 0) {
      setFindedWords(searchedWords);
    } else {
      setFindedWords([]);
    }
  };

  const debauncedSearchInputChangeHandler = useMemo(
    () => _debounce(handleSearchInputChange, 400),
    []
  );

  const handleLoadMoreClick = async () => {
    setLoading(true);

    const { words: newWords } = await getWords(
      WORDS_PER_PAGE,
      WORDS_PER_PAGE * Math.ceil(words?.length / WORDS_PER_PAGE)
    );

    setLoading(false);
    setWords((currentWords) => [...currentWords, ...newWords]);
  };

  const showLoadMoreButton = words?.length < wordsCount;

  const renderWords = () => {
    if (query) {
      return <WordsLayout words={findedWords} />;
    } else {
      return (
        <>
          <WordsLayout words={words} />
          {showLoadMoreButton && (
            <button
              className={s.loadMoreButton}
              type="button"
              onClick={debauncedSearchInputChangeHandler}
              disabled={isLoading}
            >
              Загрузить еще
            </button>
          )}
        </>
      );
    }
  };

  return (
    <>
      <header className={cn(s.header, { [s.loading]: isLoading })}>
        <div className={s.content}>
          <h1 className={s.title}>MnogoSlovDna</h1>
          <SearchInput query={query} onChange={handleSearchInputChange} />
        </div>
      </header>

      {renderWords()}
    </>
  );
}

export async function getStaticProps() {
  try {
    const wordsData = await getWords(WORDS_PER_PAGE * INITIAL_PAGES_COUNT);
    return {
      props: wordsData,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}
