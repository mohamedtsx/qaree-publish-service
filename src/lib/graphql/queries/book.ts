import { graphql } from "gql.tada";

export const getAllCategoriesQuery = graphql(`
  query getAllCategories {
    getAllCategories {
      categories {
        _id,
        name_en,
      }
    }
  }
`);

export const getBookEPubContentQuery = graphql(`
  query getBookEPubContent($bookId: String!){
    getBookEPubContent(bookId: $bookId) {
        content {
          id
          title
        }
    }
  }
`);

export const getMyBooksQuery = graphql(`
  query getBooks{
    getBooks {
      books {
          _id,
          name,
          price,
          categories {
            _id
            name_en
          },
          status,
      },
      currentPage,
      numberOfPages,
      total
    }
  }
`);
