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

export const refreshTokenQuery = graphql(`
  query refreshToken {
    refreshToken {
      message
      refresh_token
    }
  }
`);

export const getMerchantStatusQuery = graphql(`
  query getBookEPubContent($bookId: String!) {
    getBookEPubContent(bookId: $bookId) {
      content {
        id
        title
      }
    }
}
`);

export const getSignupActionURLQuery = graphql(`
  query getSignupActionURL {
    getSignupActionURL {
      actionURL
    }
  }
`);

export const getSellerOnboardingStatusQuery = graphql(`
  query getSellerOnboardingStatus($trackingId: String!) {
    getSellerOnboardingStatus(trackingId: $trackingId) {
      merchantId
      trackingId
      links {
        href
        rel
        method
      }
    }
  }
`);
