import React, { useEffect} from "react";
import Animated, {useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated';

type FadeInProps = {
    children: React.ReactNode;
    duration?: number;
    delay?: number;
};

export default function FadeIn({ children, duration = 500, delay = 0 }: FadeInProps) {
    const opacity = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    useEffect(() => {
       opacity.value = withDelay(delay, withTiming(1, { duration }));
    }, [opacity, duration, delay]);

    return(
        <Animated.View style={animatedStyle}>
            {children}
        </Animated.View>
    )   
}