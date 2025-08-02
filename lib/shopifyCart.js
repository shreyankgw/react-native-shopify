import { client } from "./shopifyClient";

export async function createCart(lines, buyerIdentity) {

  const mutation = `
    mutation CartCreate($input: CartInput!){
      cartCreate(input: $input){
        cart{
          id
          checkoutUrl
          lines(first: 100){
            edges{
              node{
                id
                quantity
                merchandise{
                  ... on ProductVariant{
                    id
                  }
                }
              }
            }
          }
        }
        userErrors{
          field
          message
        }
      }
    }
  `;

  const variables = { input: { lines, buyerIdentity } };

  const { data, errors } = await client.request(mutation, { variables });

  console.log(errors);

  if (errors || data.cartCreate.userErrors?.length) throw new Error("Failed to create cart");
  return data.cartCreate.cart;
}

export async function addLinesToCart(cartId, lines) {
  const mutation = `
       mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!){
          cartLinesAdd(cartId: $cartId, lines: $lines){
             cart{
                id
                checkoutUrl
                lines(first: 100, reverse: true){
                  edges{
                    node{
                      id
                      quantity
                      merchandise{
                        ...on ProductVariant{
                          id
                        }
                      }
                    }
                  }
                }
             }
            userErrors{
              field
              message
            }
          }
       }
    `;

  const variables = {
    cartId,
    lines
  }

  const { data, errors } = await client.request(mutation, { variables });
  if (errors || data.cartLinesAdd.userErrors?.length) throw new Error("Failed to add lines");
  return data.cartLinesAdd.cart;
}

export async function removeLinesFromCart(cartId, lineIds) {
  const mutation = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!){
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds){
        cart{
          id
          checkoutUrl
          lines(first: 100, reverse: true){
           edges{
              node{
                id
                quantity
                merchandise{
                  ... on ProductVariant{
                   id
                  }
                }
              }
            }
          }
        }
        userErrors{
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineIds]
  }

  const { data, errors } = await client.request(mutation, { variables });

  if (errors || data.cartLinesRemove.userErrors?.length) throw new Error("Failed to remove lines");
  return data.cartLinesRemove.cart;

}


export async function updateLinesFromCart(cartId, lineIds) {
  const mutation = `
       mutation updateLinesFromCart($cartId: ID!, $lines: [CartLineUpdateInput!]!){
         cartLinesUpdate(cartId: $cartId, lines: $lines){
           cart{
             id
             checkoutUrl
             lines(first: 100, reverse: true){
               edges{
                 node{
                   id
                   quantity
                   merchandise{
                     ... on ProductVariant{
                      id
                     }
                   }
                 }
               }
             }
           }
           userErrors{
            field
            message
           }
         }
       }
     `;

     const variables = {
      cartId: cartId,
      lines: lineIds
     }

  const { data, errors } = await client.request(mutation, { variables });
  if (errors || data.cartLinesUpdate.userErrors?.length) throw new Error("Failed to update line");
  return data.cartLinesUpdate.cart;
}

export async function cartBuyerIdentityUpdate(cartId, buyerIdentity) {
  const mutation = `
       mutation CartBuyerIdentityUpdate($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!){
         cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId){
           cart{
             id
             checkoutUrl
           }
           userErrors{
             field
             message
           }
         }
       }
    `;

  const { data, errors } = await client.request(mutation, { cartId, buyerIdentity });
  if (errors || data.cartBuyerIdentityUpdate.userErrors?.length) throw new Error("Failed to update buyer");
  return data.cartBuyerIdentityUpdate.cart;
}


export async function fetchCart(cartId) {
  const query = `
    query CartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost{
          subtotalAmount{
            amount
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise { 
              ... on ProductVariant { 
                id
                product{
                  title
                  featuredImage{
                    url
                  }
                }
                price{
                 amount
                }
                compareAtPrice{
                  amount
                }
                } 
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId
  };

  const { data, errors } = await client.request(query, { variables });
  if (errors) throw new Error("Failed to fetch cart");

  return data.cart;
}


export async function cartUpsell(cartId) {
  console.log('cart id is', cartId);
  const query = `
      query cartUpsell($cartId: ID!){
        cart(id: $cartId){
          lines(first: 1){
            edges{
              node{
                id
                merchandise{
                  ...on ProductVariant{
                    id
                    product{
                      metafield(namespace: "custom", key: "cart_upsell"){
                        references(first: 20){
                          nodes{
                            ...on Product{
                              id
                              title
                              handle
                              rating: metafield(namespace: "reviews", key: "rating"){
                                value
                              }
                              rating_count: metafield(namespace: "reviews", key: "rating_count"){
                                value
                              }
                              featuredImage{
                                url
                              }
                              priceRange{
                                minVariantPrice{
                                  amount
                                  currencyCode
                                }
                              }
                              compareAtPriceRange{
                                minVariantPrice{
                                  amount
                                  currencyCode
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
   `;

  const variables = {
    cartId
  };

  const { data, errors } = await client.request(query, { variables });
  if (errors) throw new Error("Failed to fetch cart upsells");

  const firstLine = data.cart.lines.edges?.[0]?.node;
  const cartUpsells =
    firstLine?.merchandise?.product?.metafield?.references?.nodes ?? [];
  return cartUpsells;
}