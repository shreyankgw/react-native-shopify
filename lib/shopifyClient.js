import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const client = createStorefrontApiClient({
    storeDomain: 'https://greenworks-tools-dev.myshopify.com',
    apiVersion: '2024-10',
    publicAccessToken: '7d0be6369786f7c87ab8bff733cbdb26'
})