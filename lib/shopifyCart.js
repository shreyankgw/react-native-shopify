import { client } from "./shopifyClient";

export async function createCart(lines, buyerIdentity){
  const mutation = `
    mutation CartCreate(input: CartInput!){
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

  const input = { lines, buyerIdentity };

  const { data, errors } = await client.request(mutation, {input});

  if (errors || data.cartCreate.userErrors?.length) throw new Error("Failed to create cart");
  return data.cartCreate.cart;
}

export async function addLinesToCart(cartId, lines){
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

    const { data, errors } = await client.request(mutation, { cartId, lines });
    if (errors || data.cartLinesAdd.userErrors?.length) throw new Error("Failed to add lines");
    return data.cartLinesAdd.cart;
}

export async function removeLinesFromCart(cartId, lineIds){
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

  const { data, errors } = await client.request(mutation, {cartId, lineIds});

  if (errors || data.cartLinesRemove.userErrors?.length) throw new Error("Failed to remove lines");
  return data.cartLinesRemove.cart;

}


export async function updateLinesFromCart(cartId, lineIds){
     const mutation = `
       mutation updateLinesFromCart($cartId: ID!, $lineIds: [ID!]!){
         cartLinesUpdate(cartId: $cartId, lineIds: $lineIds){
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
    
      const { data, errors } = await client.request(mutation, { cartId, lineIds });
       if (errors || data.cartLinesUpdate.userErrors?.length) throw new Error("Failed to update line");
       return data.cartLinesUpdate.cart;  
}

export async function cartBuyerIdentityUpdate(cartId, buyerIdentity){
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
  const { data, errors } = await client.request(query, { cartId });
  if (errors) throw new Error("Failed to fetch cart");
  return data.cart;
}