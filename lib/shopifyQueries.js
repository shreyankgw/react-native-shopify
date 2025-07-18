import { client } from "./shopifyClient";

export async function heroBanners() {
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

  const { data, errors } = await client.request(query);
  if (errors) {
    throw new Error(errors[0])
  }
  const heroBanners = data.metaobjects.edges.map(edge => edge.node);
  const heroObjects = heroBanners[0].fields.map(item => item);
  return heroObjects;
}

export async function homepageSections() {
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
                    rating: metafield(namespace: "reviews", key: "rating"){
                      value
                    }
                    rating_count: metafield(namespace: "reviews", key: "rating_count"){
                      value
                    }
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

  const { data, errors } = await client.request(query);

  if (errors) {
    throw new Error(errors[0])
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
  console.log('incoming filters from the function', filters);

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
                rating: metafield(namespace: "reviews", key: "rating"){
                  value
                }
                rating_count: metafield(namespace: "reviews", key: "rating_count"){
                 value
                }
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
    filters,
    reverse: isDescending
  };

  const { data, errors } = await client.request(query, { variables });

  if (errors) {
    throw new Error(errors[0]);
  }
  return data.collection;
}

export async function fetchProduct(handle) {
  const query = `
       {
  product(handle: "${handle}"){
     id
     title
     description
     availableForSale
     totalInventory
     tags
     rating: metafield(namespace: "reviews", key: "rating"){
       value
     }
     rating_count: metafield(namespace: "reviews", key: "rating_count"){
       value
     }
    specifications: metafield(namespace:"custom", key: "specifications"){
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

  const { data, errors } = await client.request(query);
  if (errors) {
    throw new Error(errors[0]);
  }
  return data.product;
}

export async function predictiveSearch(query, country, lang) {
  const variables = {
    query,
    country: country,
    lang: lang
  }

  const fetchQuery = `
   query PredictiveSearcdh($query: String!, $country: CountryCode!, $lang: LanguageCode!)
     @inContext(country: $country, language: $lang)
   { 
      predictiveSearch(query: $query, types: [PRODUCT, COLLECTION, PAGE], searchableFields: [TITLE, PRODUCT_TYPE, VARIANTS_TITLE, VENDOR, VARIANTS_SKU] limit: 10, limitScope: EACH){
      products{
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
      }
       collections{
         id
         title
         handle
       }
        pages{
          id
          title
          handle
        }
      }    
   }
  `;

  const { data, errors } = await client.request(fetchQuery, { variables: variables });

  if (errors) {
    throw new Error(errors[0]);
  }
  return data.predictiveSearch;
}

export async function searchPageResults(query, country, lang) {
  const variables = {
    query,
    country: country,
    lang: lang
  };

  const fetchQuery = `
  query searchAll($query: String!, $country: CountryCode!, $lang: LanguageCode!)
     @inContext(country: $country, language: $lang)
   { 
      search(query: $query, types: [PRODUCT, ARTICLE, PAGE], first: 50){
        edges{
          node{
            __typename
            ...on Product{
              id
              handle
              title
              featuredImage{
                url
              }
            }
            ...on Page{
              id
              handle
              title
            }
            ...on Article{
              id
              handle
              title
            }
          }
        }
      totalCount
      pageInfo{
        hasNextPage
        startCursor
        endCursor
       }
      }    
   }`;

  const { data, errors } = await client.request(fetchQuery, { variables: variables });
  if (errors) {
    throw new Error(errors[0]);
  }
  return data.search;
}

export async function fetchCustomerProfile(customerAccessToken) {
  const response = await fetch(`https://shopify.com/63263310018/account/customer/api/2025-01/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': customerAccessToken
    },
    body: JSON.stringify({
      query: `
        query {
          customer {
            id
            firstName
            lastName
            emailAddress{
             emailAddress
            }
            phoneNumber{
             phoneNumber
            }
            defaultAddress{
            id
            address1
            address2
            city
            company
            country
            name
            phoneNumber
            province
            zoneCode
            zip
           }
           addresses(first: 10, reverse: true){
             edges{
               node{
                 address1
                 address2
                 city
                 company
                 country
                 province
                 zip
                 id
                 zoneCode
                 territoryCode
               }
             }
           }
          }
        }
      `
    })
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0]);
  }

  return data.customer;
}

export async function fetchCustomerOrders(customerAccessToken) {

  const response = await fetch(`https://shopify.com/63263310018/account/customer/api/2025-01/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': customerAccessToken
    },
    body: JSON.stringify({
      query: `
        query {
          customer {
            orders(first: 100, reverse: true) {
              edges {
                node {
                  id
                  name
                  number
                  processedAt
                  financialStatus
                  totalPrice { 
                     amount 
                     currencyCode 
                  }
                  fulfillments(first: 10){
                    edges{
                      node{
                        id
                        status
                        trackingInformation{
                          number
                          url
                        }
                        fulfillmentLineItems(first: 10){
                          edges{
                            node{
                              lineItem{
                                id
                              }
                              quantity
                            }
                          }
                        }
                      }
                    }
                  }
                  lineItems(first: 10) {
                    edges {
                      node {
                        id
                        title
                        quantity
                        image { 
                          url 
                         }
                        variantTitle
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `
    })
  });

  const { data, errors } = await response.json();

  if (errors) throw new Error(errors[0]);
  return data.customer.orders.edges.map(e => e.node);
}



export async function fetchCustomerOrderDetail(customerAccessToken, orderId) {
  const response = await fetch('https://shopify.com/63263310018/account/customer/api/2025-01/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': customerAccessToken
    },
    body: JSON.stringify({
      query: `
        query getOrder($orderId: ID!) {
          order(id: $orderId) {
            id
            name
            number
            processedAt
            financialStatus
            totalPrice { 
              amount 
              currencyCode 
            }
            subtotal {  
              amount 
              currencyCode 
            }
            totalShipping { 
              amount 
              currencyCode 
            }
            totalTax {  
              amount 
              currencyCode
            }
            shippingAddress {
              name
              address1
              address2
              city
              province
              zip
              country
            }
            fulfillments(first: 5) {
              edges {
                node {
                  status
                  trackingInformation {
                    company
                    number
                    url
                  }
                  fulfillmentLineItems(first: 10) {
                    edges {
                      node {
                        quantity
                        lineItem {
                          id
                          title
                        }
                      }
                    }
                  }
                }
              }
            }
            lineItems(first: 15) {
              edges {
                node {
                  id
                  title
                  quantity
                  image { url }
                  variantTitle
                  price{
                      amount
                      currencyCode
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        orderId
      }
    })
  });

  const { data, errors } = await response.json();
  const fulfillments = data.order.fulfillments.edges.map(node => node);


  console.log(fulfillments.map(node => node.node.trackingInformation));
  if (errors) throw new Error(errors[0]?.message || "Unknown Shopify error");
  return data.order;
}

export async function catalogSections() {
  const query = `
  {
      metaobjects(type: "app_best_sellers", first: 1, reverse: true){
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
              products(first: 8){
                edges{
                  node{
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
          
        }
      }
    }
  }
  }`;

  const { data, errors } = await client.request(query);

  if (errors) {
    throw new Error(errors[0])
  }
  const catalogBestSellers = data.metaobjects.edges.map(edge => edge.node);
  return catalogBestSellers[0].fields;
}