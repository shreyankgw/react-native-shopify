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