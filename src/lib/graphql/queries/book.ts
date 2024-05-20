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
          level
        }

    }
  }
`);

export const getMyBooksQuery = graphql(`
  query getBooks($page: Int, $limit: Int, $filterBy: String, $sortBy: String, $keyword: String){
    getBooks(page: $page, limit: $limit, filterBy: $filterBy, sortBy: $sortBy, keyword: $keyword) {
      books {
        _id,
        cover {
          path
        }
        name,
        price,
        categories {
          _id
          name_en
          background
        },
        status,
        createdAt,
        avgRate,
        updatedAt,
        isbn,
        description,
        language,
        publishingRights,
        edition,
      },
      currentPage,
      numberOfPages,
      total
    }
  }
`);

export const getBooksFromRecycleBinQuery = graphql(`
  query getBooksFromRecycleBin {
    getBooksFromRecycleBin {
      books {
        _id,
        name,
        price,
        categories {
          _id
          name_en
          background
        },
        status,
        createdAt,
        avgRate,
        updatedAt,
        isbn,
        description,
        language,
        publishingRights,
        edition,
      },
      currentPage,
      numberOfPages,
      total
    }
  }
`);

export const getDraftBookQuery = graphql(`
  query getBook($bookId: String!) {
    getBook(bookId: $bookId) {
      _id
      sample
      cover {
        path
      }
      file {
        name
        path
      }
      name
      description
      isbn
      edition
      categories {
        _id
        name_en
      }
      price
      language
      publishingRights
      previousPublishingData
    }
  }
`);
