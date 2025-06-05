// utils/submitJudgeMeReview.ts

type JudgeMeReviewPayload = {
  productId: number; // Shopify product id
  reviewerName: string;
  reviewerEmail: string;
  rating: number; // 1-5
  title: string;
  body: string;
};

export async function submitJudgeMeReview({
  productId,
  reviewerName,
  reviewerEmail,
  rating,
  title,
  body,
}: JudgeMeReviewPayload): Promise<any> {
  const url = `https://judge.me/api/v1/reviews`;

  const payload = {
    shop_domain: "greenworks-tools-dev.myshopify.com",
    platform: "shopify",
    id: productId,
    email: reviewerEmail,
    name: reviewerName,
    rating: rating,
    title: title,
    body: body
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to submit review.");
  }
  return data;
}
