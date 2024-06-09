import { graphql } from "gql.tada";

export const userInfoQuery = graphql(`
  query userInfo {
    userInfo {
        _id
        name,
        email,
        avatar {
          size,
          path
        }
    }
  }
`);

export const getMerchantIdQuery = graphql(`
query userInfo {
   userInfo {
    merchantId
  }
}`);

export const refreshTokenQuery = graphql(`
  query refreshToken {
    refreshToken {
      message
      refresh_token
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

export const getMerchantStatusQuery = graphql(`
  query getMerchantStatus {
    getMerchantStatus {
      merchantId
      trackingId
      products {
        name
        status
        vettingStatus
        capabilities
      }
      capabilities {
        name
        status
      }
      paymentsReceivable
      legalName
      primaryEmailConfirmed
      oauthIntegrations {
        integrationType
        integrationMethod
        oauthThirdParty {
          partnerClientId
          merchantClientId
          scopes 
        }
      }
    }
  }
`);

export const getAccountInfo = graphql(`
  query userInfo {
    userInfo {
      _id
      name,
      bio
      email,
      avatar {
        path
      }
      updatedAt
      createdAt
    }
  }
`);
