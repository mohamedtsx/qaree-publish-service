import { graphql } from "gql.tada";

export const userInfo = graphql(`
  query userInfo{
    userInfo {
        _id,
        name,
        email,
        avatar,
        updatedAt,
        createdAt
    }
  }
`);
