import { client } from "./shopifyClient";

export async function storefrontQuery(){
   const query = `
   {
    products(first: 10){
      edges{
        node{
          id
          title
          description
          images(first:1){
            edges{
              node{
                url
              }
            }
          }
        }
      }
    }
  }
   `;

   const {data, errors} = await client.request(query);
    if(errors){
        throw new Error(errors[0].message)
    }
    const products = data.products.edges.map(edge => edge.node);
    return products;
}

export async function heroBanners(){
  const query = `
  {
  metaobjects(type:"app_hero_slider", first: 1, reverse: true){
    edges{
      node{
        fields{
          key
          type
          value
          references(first: 10){
            edges{
              node{
                ... on Collection{
                  id
                  title
                  handle
                  metafield(namespace: "app", key:"app_hero_slider_image"){
                      reference{
                        ... on MediaImage{
                          image{
                            url
                            altText
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

  const {data, errors} = await client.request(query);
   if(errors){
       throw new Error(errors[0].message)
   }
   const heroBanners = data.metaobjects.edges.map(edge => edge.node);
   const heroObjects = heroBanners[0].fields.map(item => item);
   return heroObjects;
}

/**
 * Fetches a Shopify collection by handle.
 *
 * @param {string} handle - The handle of the collection to fetch.
 * @param {number} productsNum - Number of products to fetch.
 * @param {string|null} cursor - Cursor for paginated results.
 * @returns {Promise<object>} - The fetched collection data.
 */


export async function fetchCollection(handle, productsNum = 24, cursor = null){
    const query = `
      query collection($handle: String, $productsNum: Int!, $cursor: String){
        collection(handle: $handle){
          title
          description
          products(first: $productsNum, after: $cursor, sortKey:BEST_SELLING){
            edges{
              node{
                id
                handle
                title
                featuredImage{
                  url
                }
                variants(first: 1){
            edges{
              node{
                sku
                id
                availableForSale
              }
            }
          }
          priceRange{
            minVariantPrice{
              ...on MoneyV2{
                amount
              }
            }
          }
          compareAtPriceRange{
            minVariantPrice{
              ...on MoneyV2{
                amount
              }
            }
          }
          totalInventory
            }
          }
          pageInfo{
            endCursor
            hasNextPage
          }
        }
      }
    }
    `;

    const variables = {
       handle,
       productsNum,
       cursor
    };

    const {data, errors} = await client.request(query, {variables});
    if(errors){
       throw new Error(errors[0].message);
    }
    return data.collection;
}

export async function fetchProduct(handle){
     const query = `
       {
  product(handle: "${handle}"){
    id
    title
    description
    images(first: 25){
      edges{
        node{
          url
        }
      }
    }
    variants(first: 1){
      edges{
        node{
          sku
          id
        }
      }
    }
    priceRange{
      minVariantPrice{
        amount
      }
    }
    compareAtPriceRange{
      minVariantPrice{
        amount
      }
    } 
  }
}
     `;

     const {data, errors} = await client.request(query);
     if(errors){
        throw new Error(errors[0].message);
     }
     return data.product;
}