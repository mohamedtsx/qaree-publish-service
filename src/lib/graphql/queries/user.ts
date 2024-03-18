import { graphql } from "gql.tada";

export const userInfoQuery = graphql(`
  query userInfo {
    userInfo {
        _id,
        name,
        email,
        avatar {
          size,
          path
        }
    }
  }
`);
