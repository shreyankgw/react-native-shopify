import { Text, View, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

import { storefrontQuery } from "@/lib/shopifyQueries";
import FadeIn from "@/components/FadeInAnimation";
import HeroSlider from "@/components/HeroSlider";

interface Product{
  id: string;
  title: string;
  images: {edges: {node: {url: string}}[]};
}

export default function Index() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
      const fetchProducts = async () => {
          try{
          const products = await storefrontQuery();
          setProducts(products);
          }catch(error){
            console.error(error);
          }
      };
      fetchProducts();
  }, []);

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
          <HeroSlider />
          <FadeIn duration={500} delay={500}>
          {products && products.map((product) => (
          <View key={product.id}>
            <Text>{product.title}</Text>
            <Image source={{ uri: product.images.edges[0].node.url }} className="w-full h-[200px]" resizeMode="contain" />
          </View>          
          ))}
          </FadeIn>
      </ScrollView>
    </SafeAreaView>
  );
}
