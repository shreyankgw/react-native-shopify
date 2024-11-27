import { Text, View, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import FadeIn from './FadeInAnimation';
import { heroBanners } from '@/lib/shopifyQueries';
import {useState, useEffect, useRef } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HeroSlider(){
    const [activeIndex, setActiveIndex] = useState(0);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const flatListRef = useRef<FlatList>(null);

    const handleScroll = (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
      };

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
        const nextIndex = (activeIndex + 1) % banners.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeIndex, banners]);

 


    return (
        <FadeIn duration={500} delay={300}>
          <View className="flex-1">
           <FlatList 
               ref={flatListRef}
               data={banners}
               horizontal
               showsHorizontalScrollIndicator={false}
               pagingEnabled
               onMomentumScrollEnd={handleScroll}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                <View style={{ width }}>
                  <Image source={{ uri: item.image }} resizeMode="cover" accessibilityLabel={item.title} accessibilityRole="image" style={{ width: width, aspectRatio: 1 }} />
                </View>
               )}
               getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            /> 
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={{
                width: activeIndex === index ? 10 : 8,
                height: activeIndex === index ? 10 : 8,
                borderRadius: 5,
                backgroundColor: activeIndex === index ? 'white' : 'gray',
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
            
          </View>
        </FadeIn>    
      )
};