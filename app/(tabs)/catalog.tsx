import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { router } from "expo-router";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeInAnimation";
import { catalogSections, homepageSections } from "@/lib/shopifyQueries";
import { catalogByVoltageTiles } from "@/constants/shopifyConstants";
import { Image } from "expo-image";

const { width } = Dimensions.get('window');

export default function Catalog() {
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopByCategory, setShopByCategory] = useState<any[]>([]);


  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        // Fetch catalog sections using your function
        const fields = await catalogSections();

        // Find best seller products from metaobject fields
        const bestSellerField = fields.find((f: any) =>
          f.reference && f.reference.products && f.reference.products.edges
        );
        const bestSellerProducts = bestSellerField?.reference?.products?.edges?.map((edge: any) => edge.node) ?? [];
        setBestSellers(bestSellerProducts);

      } catch (err) {
        // TODO: handle errors nicely in UI
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, []);

  // Fetch shop by category from homepage metaobject
  useEffect(() => {
    const fetchHomepageCategories = async () => {
      try {
        const fields = await homepageSections();
        // Get categories from homepage metaobject
        const categorySection = fields.find((f: any) =>
          f.key === "shop_by_category_collections" && f.references && f.references.edges
        );
        const categories = categorySection?.references?.edges?.map((edge: any) => edge.node) ?? [];
        setShopByCategory(categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchHomepageCategories();
  }, []);

  // Helper to chunk voltage tiles into rows of 2
  function chunkArray<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  const getCurrentMonthName = () => {
    return new Date().toLocaleString("en-US", { month: "long" });
  };


  const voltageRows = chunkArray(catalogByVoltageTiles, 2);

  return (
    <View className="bg-white h-full">
      <ScrollView>
        {/* --- BEST SELLERS CAROUSEL --- */}
        <FadeIn duration={500} delay={100}>
          <View className="px-4 pt-4">
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-mBold text-left">{getCurrentMonthName()} Best Sellers 🔥</Text>
              <TouchableOpacity onPress={() => router.push("/collections/best-sellers-app")}>
                <Text className="text-sm font-mBold underline text-gray-500">View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ justifyContent: "space-between", gap: 8 }}
            >
              {loading && bestSellers.length === 0 ? (
                <Text className="text-gray-400">Loading...</Text>
              ) : bestSellers.length === 0 ? (
                <Text className="text-gray-400">No best sellers found.</Text>
              ) : (
                bestSellers.map((product, i) => (
                  <View key={product.id || i} style={{ width: width / 2 - 40 }} className="flex-shrink-0">
                    <ProductCard product={product} />
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </FadeIn>

        {/* --- SHOP BY VOLTAGE TILES --- */}
        <FadeIn duration={600} delay={180}>
          <View className="px-4 pt-8">
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-mBold text-left">Shop by Voltage</Text>
            </View>
            <View>
              {voltageRows.map((row, rowIndex) => (
                <View
                  key={rowIndex}
                  className="flex-row mb-4"
                  style={{ gap: 16, justifyContent: "space-between" }}
                >
                  {row.map((tile, colIndex) => (
                    <TouchableOpacity
                      key={tile.title}
                      className="flex-1 items-center"
                      style={{ maxWidth: width / 2 - 32 }}
                      onPress={() =>
                        router.push(`/collections/${encodeURIComponent(tile.title.toLowerCase().replace(/\//g, "-"))}`)
                      }
                      accessibilityLabel={tile.title}
                    >
                      <View className="relative items-center justify-center mb-2 w-full aspect-square bg-gray-100 rounded-full">
                        <Image
                          source={{ uri: tile.imageUrl }}
                          style={{ width: '100%', height: '100%' }}
                          contentFit="contain"
                          transition={350}
                          accessibilityRole="image"
                          accessibilityLabel={tile.title}
                        />
                      </View>

                    </TouchableOpacity>
                  ))}
                  {/* If there's only one tile in last row, add an empty View for spacing */}
                  {row.length === 1 && <View style={{ flex: 1 }} />}
                </View>
              ))}
            </View>
          </View>
        </FadeIn>


        <FadeIn duration={1000} delay={600}>
          <View className="px-4 pt-10 pb-6">
            <View className="flex flex-row items-center justify-between flex-1 mb-4">
              <Text className="text-2xl font-mBold text-left">Shop by Category</Text>
            </View>

            <View className="flex-row flex-wrap">
              {shopByCategory.length === 0 ? (
                <Text className="text-gray-400">No categories found.</Text>
              ) : (
                shopByCategory.map((collection: any, index: number) => (
                  <View
                    key={`collection-${index}`}
                    className="flex-shrink-0 mb-4"
                    style={{
                      width: width / 2 - 20,
                      marginRight: index % 2 === 0 ? 8 : 0, // gap between columns
                    }}
                  >
                    {collection && (
                      <TouchableOpacity
                        className="flex flex-col items-center justify-center gap-3"
                        onPress={() => router.push(`/collections/${collection.handle}`)}
                        accessible={true}
                        accessibilityLabel={collection.title}
                      >
                        <View className="relative items-center justify-center w-full aspect-square">
                          {collection.categoryImage && (
                            <View
                              className="bg-gray-100 rounded-full absolute"
                              style={{
                                zIndex: -1,
                                width: "90%",
                                aspectRatio: 1,
                              }}
                            />
                          )}
                          {collection.categoryImage && (
                            <Image
                              source={{ uri: collection.categoryImage.reference.image.url }}
                              style={{ width: '100%', height: '100%' }}
                              contentFit="contain"
                              transition={350}
                              accessibilityRole="image"
                            />
                          )}
                        </View>
                        <Text className="text-base font-mBold text-center">
                          {collection.title}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          </View>
        </FadeIn>
      </ScrollView>
    </View>
  );
}
