import { GraphQLClient, gql } from 'graphql-request';

export function request({ query, variables }) {
  const client = new GraphQLClient(`https://graphql.datocms.com/`, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_API_TOKEN}`,
    },
  });

  return client.request(query, variables);
}

const wordsQuery = gql`
  query WordsQuery($limit: IntType, $offset: IntType) {
    allWords(first: $limit, skip: $offset) {
      id
      word
      images {
        id
        responsiveImage(imgixParams: { fit: crop, w: 500, h: 500, auto: format }) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          base64
        }
      }
    }
    _allWordsMeta {
      count
    }
  }
`;

export const getWords = async (limit, offset) => {
  const data = await request({
    query: wordsQuery,
    variables: { limit, offset },
  });

  return { words: data.allWords, wordsCount: data._allWordsMeta.count };
};

const searchWordsQuery = gql`
  query SearchWordsQuery($pattern: String!) {
    allWords(filter: { word: { matches: { pattern: $pattern } } }) {
      id
      word
      images {
        id
        responsiveImage(imgixParams: { fit: crop, w: 500, h: 500, auto: format }) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          base64
        }
      }
    }
  }
`;

export const searchInWords = async (pattern) => {
  const data = await request({
    query: searchWordsQuery,
    variables: { pattern: `^${pattern}` },
  });

  return data.allWords;
};
