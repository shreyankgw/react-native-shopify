import { shopifyClient } from "./shopifyClient";

export async function getAllProducts(){
    return await shopifyClient.product.fetchAll();
}

export async function sampleProductQuery(){
  const query = await shopifyClient.graphQLClient.query((root) => {
        root.addConnection('products', {args : {first: 20}}, (product) => {
            product.add('id');
            product.add('title');
         });
    });

  return shopifyClient.graphQLClient.send(query);
}