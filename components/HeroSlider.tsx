import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import FadeIn from './FadeInAnimation';
import { heroBanners } from '@/lib/shopifyQueries';
import { useState, useEffect, useMemo } from 'react';
import { router } from 'expo-router';
import { Image } from "expo-image";

interface Banner {
  id: string;
  title: string;
  handle: string;
  image: string;
}

const ASPECT_RATIO = 140 / 53;

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    let mounted = true;
    const fetchBanners = async () => {
      try {
        const response = await heroBanners();
        const bannersData = response
          .filter((field: any) => field.references && field.references.edges?.length > 0)
          .flatMap((field: any) =>
            field.references.edges.map((ref: any) => ({
              id: ref.node.id,
              title: ref.node.title,
              handle: ref.node.handle,
              image: ref.node.metafield?.reference?.image?.url || ''
            }))
          );
        if (mounted) setBanners(bannersData);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBanners();
    return () => { mounted = false; };
  }, []);

  const handleImageLoad = (id: string) => {
    setImageLoaded((prev) => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id: string) => {
    setImageLoaded((prev) => ({ ...prev, [id]: false }));
  };

  // Memoize banner rendering
   const renderedBanners = useMemo(() => (
    banners.map((banner) => (
      <TouchableOpacity
        key={banner.id}
        onPress={() => router.push(`/collections/${banner.handle}`)}
        className="w-full mb-2"
        activeOpacity={0.85}
      >
        <View className="w-full overflow-hidden rounded-lg bg-gray-100" style={{ aspectRatio: ASPECT_RATIO, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={banner.image ? { uri: banner.image } : undefined}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={350}
            onLoad={() => setImageLoaded((prev) => ({ ...prev, [banner.id]: true }))}
            onError={() => setImageLoaded((prev) => ({ ...prev, [banner.id]: false }))}
            accessibilityLabel={banner.title}
            accessibilityRole="image"
          />
          {!imageLoaded[banner.id] && (
            <View className="absolute w-full h-full justify-center items-center">
              <ActivityIndicator size="small" color="#d1d5db" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ))
  ), [banners, imageLoaded]);

  // Loading skeleton (while fetching banners, not image)
  if (loading) {
    return (
      <FadeIn duration={500} delay={300}>
        <View className="bg-white mb-4 px-4">
          {Array.from({ length: banners.length }).map((_, index) => (
            <View
              key={index}
              className="w-full rounded-lg bg-gray-200 mb-2"
              style={{ aspectRatio: ASPECT_RATIO, justifyContent: 'center', alignItems: 'center' }}
            >
              <ActivityIndicator size="small" color="#d1d5db" />
            </View>
          ))}
        </View>
      </FadeIn>
    );
  }

  return (
    <FadeIn duration={500} delay={100}>
      <View className="bg-white px-4 my-4 flex flex-col gap-1">
        {renderedBanners}
      </View>
    </FadeIn>
  );
}
