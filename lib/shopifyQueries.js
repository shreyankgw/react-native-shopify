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