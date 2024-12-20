import { client } from "./shopifyClient";

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

export async function homepageSections(){
  const query = `
  {
      metaobjects(type: "app_homepage_sections", first: 1, reverse: true){
    edges{
      node{
        fields{
          key
          type
          value
          reference{
            ...on Collection{
              title
              handle
              products(first:8){
                edges{
                  node{
                    title
                    handle
                    featuredImage{
                      url
                    }
                    variants(first: 1){
                      edges{
                        node{
                          id
                          sku
                        }
                      }
                    }
                    compareAtPriceRange{
                      minVariantPrice{
                        amount
                      }
                    }
                    priceRange{
                      minVariantPrice{
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
          references(first: 15){
            edges{
              node{
                ...on Collection{
                  title
                  handle
                  image{
                    url
                  }
                  banner: metafield(namespace: "app", key:"app_homepage_banner"){
                    reference{
                      ...on MediaImage{
                        image{
                          url
                          altText
                        }
                      }
                    }
                  }
                  categoryImage: metafield(namespace:"app", key:"app_category_image"){
                    reference{
                      ...on MediaImage{
                        image{
                          url
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
  }`;

  const {data, errors } = await client.request(query);
  if(errors){
    throw new Error(errors[0].message)
  }
  const homepageSections = data.metaobjects.edges.map(edge => edge.node);
  return homepageSections[0].fields;
}

/**
 * Fetches a Shopify collection by handle.
 *
 * @param {string} handle - The handle of the collection to fetch.
 * @param {number} productsNum - Number of products to fetch.
 * @param {string|null} cursor - Cursor for paginated results.
 * @returns {Promise<object>} - The fetched collection data.
 */


export async function fetchCollection(handle, productsNum = 24, cursor = null, sortBy = "BEST_SELLING", filters = []) {
  const isDescending = sortBy.includes("DESC");
  const sanitizedSortKey = sortBy.replace("_DESC", "").replace("_ASC", "");


  function extractMetafields(filters){
    if (!Array.isArray(filters)) {
      return [];
    }
    
    const metafieldsFilters = [];
     
    filters.forEach((filter) => {
      filter.values.forEach((value) => {
         const keyparts = value.id.split(".");
         const metafieldKey = keyparts.slice(0, -1).join(".").split(".").pop();

         if(metafieldKey){
           metafieldsFilters.push({
             productMetafield: {
              namespace: "custom",
              key: metafieldKey,
              value: value.label
             }
           })
         }
      })
    });

    return metafieldsFilters;
  }

    const query = `
      query collection($handle: String, $productsNum: Int!, $cursor: String, $sortKey: ProductCollectionSortKeys, $filters: [ProductFilter!], $reverse: Boolean){
        collection(handle: $handle){
          title
          description
          products(first: $productsNum, after: $cursor, sortKey: $sortKey, filters: $filters, reverse: $reverse){
            filters{
               id
               label
               type
               values{
                 id
                 label
                 count
               }
            }
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
       cursor,
       sortKey: sanitizedSortKey,
       filters: extractMetafields(filters),
       reverse: isDescending
    };

    console.log(variables);

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
    secifications: metafield(namespace:"custom", key: "specifications"){
      value
    }
    features: metafield(namespace:"custom", key:"key_features"){
      references(first: 20){
       nodes{
        ...on Metaobject{
          field(key:"feature_name"){
            value
          }
        }
       }
      }
    }
    warranty: metafield(namespace:"custom", key:"warranty"){
      reference{
        ...on Metaobject{
          field(key: "warranty_image"){
            reference{
              ...on MediaImage{
                 image{
                  url
                }
              }
            }
          }
        }
      }
    }
    faq: metafield(namespace:"custom", key:"product_faq"){
      references(first: 5){
        nodes{
          ...on Metaobject{
            fields{
              key
              value
            }
          }
        }
      }
    }
    whatsIncluded: metafield(namespace:"custom", key:"includes"){
      value
    }
    images(first: 20){
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
        throw new Error(errors[0]);
     }
     return data.product;
}