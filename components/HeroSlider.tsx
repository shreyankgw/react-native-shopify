import { Text, View, Image, Dimensions, TouchableOpacity, FlatList, Animated, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import FadeIn from './FadeInAnimation';
import { heroBanners } from '@/lib/shopifyQueries';
import {useState, useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');

interface Banner{
  id: string;
  title: string;
  handle: string;
  image: string;
}

export default function HeroSlider(){
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scrollX = useRef(new Animated.Value(0)).current; // Horizontal scroll tracking
    const activeIndex = useRef(0); // Active banner index (trackable across renders)
    const flatListRef = useRef<FlatList>(null); // Reference for FlatList
    
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await heroBanners();

                // extract banner images from the references field
                const bannersData = response.filter((field: any) => field.references && field.references.edges?.length > 0 )
                                              .flatMap((field: any) => field.references.edges.map((ref: any) => ({
                                                  id: ref.node.id,
                                                  title: ref.node.title,
                                                  handle: ref.node.handle,
                                                  image: ref.node.metafield?.reference.image.url || ''
                                              })));
                console.log(bannersData);
                
                setBanners(bannersData);
            } catch (error) {
                console.error(error);
            }finally{
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

      // Autoplay functionality
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        const nextIndex = (activeIndex.current + 1) % banners.length;

        // Trigger fade-out and fade-in animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          activeIndex.current = nextIndex;
          flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });

          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners, fadeAnim]);

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    activeIndex.current = Math.round(xOffset / width);
    Animated.timing(scrollX, {
      toValue: xOffset,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };
 


    return (
        <FadeIn duration={500} delay={300}>
          <View className="relative w-full" style={{ aspectRatio: 1 }}>
            <Animated.View style={{ opacity: fadeAnim}} className="w-full h-full absolute">
            <FlatList
          ref={flatListRef}
          data={banners}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <Image
                source={{ uri: item.image }}
                className="w-full h-full"
                style={{ resizeMode: 'cover' }}
                accessibilityLabel={item.title}
                accessibilityRole="image"
              />
            </View>
          )}
        />
            </Animated.View>
           
            <View className="absolute bottom-5 flex-row justify-center w-full">
          {banners.map((_, index) => {
            const dotScale = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: [1, 1.5, 1],
              extrapolate: 'clamp',
            });
            const dotColor = scrollX.interpolate({
              inputRange: [
                (index - 1) * width,
                index * width,
                (index + 1) * width,
              ],
              outputRange: ['gray', 'white', 'gray'],
              extrapolate: 'clamp',
            });

            return(
            <Animated.View
              key={index}
              style={{
                transform: [{ scale: dotScale }],
                width: 8,
                height: 8,
                backgroundColor: dotColor,
                borderRadius: 4,
                marginHorizontal: 4,
              }}
            />
           )
          })}
        </View>
            
          </View>
        </FadeIn>    
      )
};