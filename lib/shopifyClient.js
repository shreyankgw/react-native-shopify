import Client from "shopify-buy/index.unoptimized.umd";

export const shopifyClient = Client.buildClient({
    domain: 'greenworks-tools-dev.myshopify.com',
    storefrontAccessToken: '7d0be6369786f7c87ab8bff733cbdb26'
});

export const shopifyFrenchClient = Client.buildClient({
    domain: 'greenworks-tools-dev.myshopify.com',
    storefrontAccessToken: '7d0be6369786f7c87ab8bff733cbdb26',
    language: 'fr'
});