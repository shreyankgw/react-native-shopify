import { Text, View, ScrollView, TouchableOpacity, Dimensions, TextInput, Keyboard, ActivityIndicator } from "react-native";
import { useState, useEffect, useMemo } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import { Image } from "expo-image";

import { homepageSections } from "@/lib/shopifyQueries";
import FadeIn from "@/components/FadeInAnimation";
import HeroSlider from "@/components/HeroSlider";
import FeaturedTab from "@/components/FeaturedTab";
import ProductCard from "@/components/ProductCard";

const { width } = Dimensions.get('window');

export default function Index() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const onboarding = storage.getBoolean("onboarding");


  const handleSearch = () => {
    Keyboard.dismiss();
    router.push('/search')
  }

  // Skeleton component for loading state
  const SkeletonImage = ({ style }: { style?: any }) => (
    <View className="bg-gray-200 rounded-lg" style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="small" color="#d1d5db" />
    </View>
  );

  useEffect(() => {
    let isMounted = true;

    const getHomepageSections = async () => {
     
      try {
         setLoading(true);
        const homepageSectionsVal = await homepageSections();
        if (isMounted) {
          setSections(homepageSectionsVal);
        }
      } catch (error) {
        console.error(error);
      }finally{
        setLoading(false);
      }
      
    }
    getHomepageSections();
    return () => { isMounted = false; };
  }, []);

// Memoized object: key => section
  const sectionsByKey = useMemo(() => {
    const obj: Record<string, any> = {};
    for (const section of sections) {
      obj[section.key] = section;
    }
    return obj;
  }, [sections]);


  //Memoized derived content
  const announcement = useMemo(() => sectionsByKey.announcement_text?.value ?? "", [sectionsByKey]);
  const bestSellers = useMemo(
    () =>
      sectionsByKey.best_seller_collection?.reference?.products?.edges?.map((edge: any) => edge.node) ?? [],
    [sectionsByKey]
  );
  const shopByCategory = useMemo(
    () =>
      sectionsByKey.shop_by_category_collections?.references?.edges?.map((edge: any) => edge.node) ?? [],
    [sectionsByKey]
  );
  const shopByVoltage = useMemo(
    () =>
      sectionsByKey.shop_by_voltage_collections?.references?.edges?.map((edge: any) => edge.node) ?? [],
    [sectionsByKey]
  );
  const bottomBanners = useMemo(
    () =>
      sectionsByKey.banner_collections?.references?.edges?.map((edge: any) => edge.node) ?? [],
    [sectionsByKey]
  );


  // Loading Skeleton (for whole page)
  if (loading) {
    return (
      <View className="bg-white flex-1 p-4">
        <View className="h-8 bg-gray-100 rounded w-2/3 mb-4" />
        <View className="h-48 bg-gray-100 rounded mb-4" />
        <View className="h-6 bg-gray-100 rounded w-1/3 mb-2" />
        <View className="h-24 bg-gray-100 rounded mb-4" />
        <View className="h-6 bg-gray-100 rounded w-1/2 mb-2" />
        <View className="h-36 bg-gray-100 rounded" />
      </View>
    );
  }

  return (
    <View className="bg-white h-full">
      <ScrollView>     
         {/* Announcement Bar */}
        {sectionsByKey.show_announcement?.value === "true" && (
          <FadeIn duration={300} delay={100}>
            <View className="p-4 bg-gray-200">
              <Text className="text-sm font-mBold">{announcement}</Text>
            </View>
          </FadeIn>
        )}

        {/* Search Bar */}
        <View className="bg-brandText">
          <View className="flex-row items-center bg-gray-50 rounded-lg border border-gray-300 px-4 m-4 py-2">
            <Ionicons name="search-outline" size={20} color="#6b7280" className="mr-2" />
            <TextInput
              className="flex-1 text-base text-gray-700"
              placeholder="Search products..."
              placeholderTextColor="#9ca3af"
              accessibilityLabel="Search"
              onFocus={() => router.push('/search')}
            />
            <TouchableOpacity onPress={handleSearch} className="pl-2">
              <Ionicons name="arrow-forward-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Tabs */}
        <View className="flex flex-row items-center justify-center p-4 gap-2 bg-brandText">
          <FeaturedTab title="Shop Deals" handlePress={() => router.push("/collections/deals")} iconName="pricetags" size={14} />
          <FeaturedTab title="Shop Best Sellers" handlePress={() => router.push("/collections/best-sellers")} iconName="flame-sharp" size={14} />
        </View>

        {/* Hero Slider */}
        <HeroSlider />

        {/* Shop by Category */}
        {sectionsByKey.shop_by_category_tiles?.value === "true" && (
          <FadeIn duration={1000} delay={800}>
            <View className="px-4">
              <View className="flex flex-row items-center justify-between flex-1 mb-4">
                <Text className="text-xl font-mBold text-left">Shop by Category</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonImage key={i} style={{ width: width / 3 - 20, aspectRatio: 1, marginRight: 8 }} />
                    ))
                  : shopByCategory.map((collection: any, index: number) => (
                      <View key={`collection-${index}`} className="flex-shrink-0" style={{ width: width / 3 - 20 }}>
                        {collection && (
                          <TouchableOpacity
                            className="flex flex-col items-center justify-center gap-3"
                            onPress={() => router.push(`/collections/${collection.handle}`)}
                            accessible
                            accessibilityLabel={collection.title}
                          >
                            <View className="relative items-center justify-center w-full aspect-square">
                              {collection.categoryImage && (
                                <View className="bg-gray-100 rounded-full absolute" style={{ zIndex: -1, width: "90%", aspectRatio: 1 }} />
                              )}
                              {collection.categoryImage ? (
                                <Image
                                  source={{ uri: collection.categoryImage.reference.image.url }}
                                  style={{ width: '100%', height: '100%' }}
                                  contentFit="contain"
                                  transition={350}
                                  accessibilityRole="image"
                                  accessibilityLabel={collection.title}
                                />
                              ) : (
                                <SkeletonImage style={{ width: "100%", aspectRatio: 1 }} />
                              )}
                            </View>
                            <Text className="text-sm font-mBold text-center">{collection.title}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
              </ScrollView>
            </View>
          </FadeIn>
        )}

         {/* Shop by Voltage */}
        {sectionsByKey.shop_by_voltage_tiles?.value === "true" && (
          <FadeIn duration={800} delay={500}>
            <View className="p-4">
              <View className="flex flex-row items-center justify-between flex-1 mb-4">
                <Text className="text-xl font-mBold text-left">Shop by Voltage</Text>
              </View>
              <View className="flex-row flex-wrap">
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonImage key={i} style={{ width: width / 2 - 20, aspectRatio: 1, marginBottom: 8 }} />
                    ))
                  : shopByVoltage.map((tile: any, index: number) => (
                      <View key={`tile-${index}`} className="flex flex-row items-center justify-center" style={{ width: width / 2 - 20 }}>
                        <View className="flex-1 h-full items-stretch">
                          {tile ? (
                            <TouchableOpacity onPress={() => router.push(`/collections/${tile.handle}`)} className="w-full aspect-square">
                              <Image
                                source={{ uri: tile.categoryImage.reference.image.url }}
                                style={{ width: '100%', height: '100%' }}
                                contentFit="contain"
                                transition={350}
                                accessibilityRole="image"
                              />
                            </TouchableOpacity>
                          ) : (
                            <SkeletonImage style={{ width: "100%", aspectRatio: 1 }} />
                          )}
                        </View>
                      </View>
                    ))}
              </View>
            </View>
          </FadeIn>
        )}

         {/* Best Sellers */}
        {sectionsByKey.best_sellers_product_carousel?.value === "true" && (
          <FadeIn duration={600} delay={400}>
            <View className="px-4">
              <View className="flex flex-row items-center justify-between flex-1 mb-4">
                <Text className="text-lg font-mBold text-left">Best Sellers</Text>
                <TouchableOpacity onPress={() => router.push("/collections/featured-products")}>
                  <Text className="text-sm font-mBold underline text-gray-500">View All</Text>
                </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonImage key={i} style={{ width: width / 2 - 40, aspectRatio: 1 }} />
                    ))
                  : bestSellers.map((product: any, index: number) => (
                      <View key={`product-${index}`} className="flex-shrink-0" style={{ width: width / 2 - 40 }}>
                        {product ? <ProductCard product={product} /> : <SkeletonImage style={{ width: "100%", aspectRatio: 1 }} />}
                      </View>
                    ))}
              </ScrollView>
            </View>
          </FadeIn>
        )}

        {/* Banners at Bottom */}
        {sectionsByKey.banners_at_bottom?.value === "true" && (
          <FadeIn duration={1200} delay={1000}>
            <View className="p-4">
              <View className="flex flex-row items-center justify-between flex-1 mb-4">
                <Text className="text-xl font-mBold text-left">Explore More</Text>
              </View>
              {loading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <SkeletonImage key={i} style={{ width: "100%", aspectRatio: 2, marginBottom: 16 }} />
                  ))
                : bottomBanners.map((banner: any, index: number) => (
                    <TouchableOpacity
                      onPress={() => router.push(`/collections/${banner.handle}`)}
                      key={`banner-${index}`}
                      className="mb-4 w-full aspect-square"
                      accessible
                      accessibilityLabel={banner.title}
                      accessibilityRole="image"
                    >
                      {banner?.banner?.reference?.image?.url ? (
                        <Image
                          source={{ uri: banner.banner.reference.image.url }}
                          contentFit="contain"
                          style={{ width: '100%', height: '100%' }}
                          transition={350}
                        />
                      ) : (
                        <SkeletonImage style={{ width: "100%", aspectRatio: 2 }} />
                      )}
                    </TouchableOpacity>
                  ))}
            </View>
          </FadeIn>
        )}

      </ScrollView>
      
    </View>
  );
}
