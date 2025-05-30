import { Ionicons } from "@expo/vector-icons";

export default function renderStars(ratingValue: number, size: number = 16) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={
          ratingValue >= i
            ? "star"
            : ratingValue >= i - 0.5
            ? "star-half"
            : "star-outline"
        }
        size={size}
        color="#82bc00"
        style={{ marginRight: 2 }}
      />
    );
  }
  return stars;
}