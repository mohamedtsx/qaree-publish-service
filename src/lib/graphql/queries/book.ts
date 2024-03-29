import { graphql } from "gql.tada";

export const userInfoQuery = graphql(`
  query userInfo {
    userInfo {
        name,
        email,
        avatar {
          size,
          path
        }
    }
  }
`);

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
