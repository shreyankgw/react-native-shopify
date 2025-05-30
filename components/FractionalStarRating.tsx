import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Svg, { Path, Defs, Rect, ClipPath, G } from "react-native-svg";

// Star SVG path as a constant
const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

interface FractionalStarProps {
  fill?: number; // 0.0 (empty) to 1.0 (full)
  size?: number;
  filledColor?: string;
  emptyColor?: string;
}

const FractionalStar = memo(
  ({
    fill = 1,
    size = 24,
    filledColor = "#FACC15",
    emptyColor = "#E5E7EB",
  }: FractionalStarProps) => {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        {/* Empty Star */}
        <Path d={STAR_PATH} fill={emptyColor} />
        {/* Filled Star, clipped */}
        <Defs>
          <ClipPath id="clip">
            <Rect x="0" y="0" width={24 * fill} height="24" />
          </ClipPath>
        </Defs>
        <G clipPath="url(#clip)">
          <Path d={STAR_PATH} fill={filledColor} />
        </G>
      </Svg>
    );
  }
);

interface FractionalStarRatingProps {
  rating: number;
  ratingCount?: number;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  showValue?: boolean; // Show "4.45" value
  showCount?: boolean; // Show review count
}

export const FractionalStarRating = memo(
  ({
    rating,
    ratingCount = 0,
    size = 20,
    style,
    textStyle,
    showValue = true,
    showCount = true,
  }: FractionalStarRatingProps) => {
    // Memoize stars to prevent unnecessary recalculations
    const stars = useMemo(() => {
      return Array.from({ length: 5 }).map((_, i) => {
        let fill = 0;
        if (rating >= i + 1) fill = 1;
        else if (rating > i) fill = rating - i;
        return (
          <FractionalStar
            key={i}
            fill={fill}
            size={size}
            filledColor="#82bc00"
            emptyColor="#E5E7EB"
          />
        );
      });
    }, [rating, size]);

    // Format rating value
    const displayRatingValue = useMemo(
      () => rating.toFixed(2),
      [rating]
    );

    return (
      <View style={[styles.row, style]}>
        {stars}
        {(showValue || showCount) && (
          <Text style={[styles.text, { fontSize: size * 0.7 }, textStyle]}>
            {showValue && `${displayRatingValue}`}
            {showValue && showCount ? "  " : ""}
            {showCount && `(${ratingCount})`}
          </Text>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 6,
    color: "#666",
  },
});

export default FractionalStarRating;
