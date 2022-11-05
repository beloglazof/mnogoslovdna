import s from './styles.module.css';

export default function SearchInput({ query, onChange }) {
  return (
    <form className={s.form}>
      <input
        className={s.input}
        type="search"
        value={query}
        placeholder="Поиск"
        onChange={onChange}
      />
    </form>
  );
}
