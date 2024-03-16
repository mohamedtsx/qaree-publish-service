import { graphql } from "gql.tada";

export const signUpMutation = graphql(`
  mutation signup ($email: String!, $name: String!, $password: String!) {
    signup(userData: { email: $email, name: $name, password: $password }) {
      message
    }
  }
`);
