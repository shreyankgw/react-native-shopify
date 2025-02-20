import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import * as Crypto from 'expo-crypto';
import { Buffer } from "buffer";

// Polyfill Buffer for environments that do not support it
if (typeof global.Buffer === 'undefined') {
    global.Buffer = Buffer;
}

export const client = createStorefrontApiClient({
    storeDomain: 'https://greenworks-tools-dev.myshopify.com',
    apiVersion: '2024-10',
    publicAccessToken: '7d0be6369786f7c87ab8bff733cbdb26'
});


// config and helper functions for the customer account API
 const CONFIG = {
    SHOP_ID: '63263310018',
    SCOPES: 'openid email customer-account-api:full',
    CLIENT_ID: 'shp_4897dfd3-4082-4208-9e38-dcec06955c54',
    REDIRECT_URI: 'shop.63263310018.app://callback'
}

function generateState(){
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2);
    return timestamp + randomString;
  } 

async function encodeBase64(bytes){
    return Buffer.from(await bytes).toString('base64');
}

export async function generateCodeVerifier(){
    const bytes = await Crypto.getRandomBytesAsync(32);
    return encodeBase64(bytes);
}

function generateCodeChallenge(codeVerifier){
    const digestString = Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA512, codeVerifier);

    return encodeBase64(digestString);
}

export function buildAuthorizationUrl(codeVerifier){
    const codeChallenge = generateCodeChallenge(codeVerifier);
    console.log('build authorization url');

    const url = new URL(`https://shopify.com/authentication/${CONFIG.SHOP_ID}/oauth/authorize`);
    url.searchParams.append('scope', CONFIG.SCOPES);
    url.searchParams.append('client_id', CONFIG.CLIENT_ID);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('redirect_uri', CONFIG.REDIRECT_URI);
    url.searchParams.append('state', generateState());
    url.searchParams.append('code_challenge', codeChallenge);
    url.searchParams.append('code_challenge_method', 'S256');

    return {  url: url.toString(), codeverifier: codeVerifier };
}

export async function requestAccessToken(code, codeVerifier){
    const requestBody = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CONFIG.CLIENT_ID,
        redirect_uri: CONFIG.REDIRECT_URI,
        code: code,
        code_verifier: codeVerifier
    });

    const response = await fetch(`https://shopify.com/authentication/${CONFIG.SHOP_ID}/oauth/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: requestBody.toString()
    });

    return response.json();
}