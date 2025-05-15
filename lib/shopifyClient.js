import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const client = createStorefrontApiClient({
    storeDomain: 'https://greenworks-tools-dev.myshopify.com',
    apiVersion: '2024-10',
    publicAccessToken: '7d0be6369786f7c87ab8bff733cbdb26'
});

// configs for shopify authentication
export const shopConfig = {
    SHOP_ID: '63263310018',
    SCOPES: 'openid email customer-account-api:full',
    CLIENT_ID: 'shp_4897dfd3-4082-4208-9e38-dcec06955c54',
    REDIRECT_URI: 'shop.63263310018.app://callback',
    AUTHORIZATION_ENDPOINT: 'https://shopify.com/authentication/63263310018/oauth/authorize',
    TOKEN_ENDPOINT: 'https://shopify.com/authentication/63263310018/oauth/token',
    LOGOUT_ENDPOINT: 'https://shopify.com/authentication/63263310018/logout'
  }