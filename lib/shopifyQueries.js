import { shopifyClient } from "./shopifyClient";

export async function getAllProducts(){
    return await shopifyClient.product.fetchAll();
}

export async function graphQuery(){
  const query = await shopifyClient.graphQLClient.query((root) => {
        root.addConnection('products', {args : {first: 100}}, (product) => {
            product.add('id');
            product.add('title');
         });
    });

  return shopifyClient.graphQLClient.send(query);
}