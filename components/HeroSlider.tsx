import { Text, View, Image, Dimensions, TouchableOpacity } from 'react-native';
import FadeIn from './FadeInAnimation';
import { heroBanners } from '@/lib/shopifyQueries';
import {useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';

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
                setBanners(bannersData);
            } catch (error) {
                console.error(error);
            }finally{
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);
 
     if(loading){
      return (
        <FadeIn duration={500} delay={300}>
            <View className="bg-white mb-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <View key={index} className="w-full aspect-square bg-gray-400 animate-pulse"></View>
              ))}
            </View>
        </FadeIn>
      )
     }

    return (
        <FadeIn duration={500} delay={100}>
            <View className="bg-white mb-4">
              {banners.map((banner: Banner) => (
                 <TouchableOpacity key={banner.id} onPress={() => router.push(`/collections/${banner.handle}`)} className='w-full' activeOpacity={0.8}>
                    <Image source={{ uri: banner.image }} className="w-full aspect-square" accessibilityLabel={banner.title} accessibilityRole='image'  />
                 </TouchableOpacity>
              ))}
            </View>
        </FadeIn>    
      )
};