import React, { useEffect, useState, useMemo } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView, Pressable } from "react-native";
import JudgemeReviewsHeader from "./JudgemeReviewHeader";

type Review = {
  id: number;
  title: string;
  body: string;
  rating: number;
  created_at: string;
  reviewer: { name: string };
  pictures?: { urls: { original: string } }[];
};

type JudgeMeReviewComponentProps = {
  shopDomain: string;
  apiToken: string;
  shopifyProductId: string; // e.g., "gid://shopify/Product/7769796968642"
  perPage?: number;
};

const extractShopifyNumericId = (gid: string) => gid.split("/").pop();

export default function JudgeMeReviewComponent({
  shopDomain,
  apiToken,
  shopifyProductId,
  perPage = 10,
}: JudgeMeReviewComponentProps) {
  const [judgeMeProductId, setJudgeMeProductId] = useState<number | null>(null);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Fetch Judge.me Product ID
  useEffect(() => {
    setLoading(true);
    setErr(null);
    const fetchJudgeMeProductId = async () => {
      try {
        const shopifyId = extractShopifyNumericId(shopifyProductId);
        const url = `https://judge.me/api/v1/products/-1?api_token=${apiToken}&shop_domain=${shopDomain}&external_id=${shopifyId}`;
        const res = await fetch(url);
        const data = await res.json();
        setJudgeMeProductId(data.product?.id);
      } catch (e) {
        setErr("Failed to fetch product info.");
      }
    };
    fetchJudgeMeProductId();
  }, [shopDomain, apiToken, shopifyProductId]);

  // Fetch all reviews at once
  useEffect(() => {
    if (!judgeMeProductId) return;
    setLoading(true);
    setErr(null);

    const fetchAllReviews = async () => {
      try {
        // Get total count
        const countRes = await fetch(
          `https://api.judge.me/api/v1/reviews/count?product_id=${judgeMeProductId}&api_token=${apiToken}&shop_domain=${shopDomain}`
        );
        const countData = await countRes.json();
        setTotalReviews(countData.count);

        // Fetch all reviews at once
        const allReviewsRes = await fetch(
          `https://api.judge.me/api/v1/reviews?product_id=${judgeMeProductId}&api_token=${apiToken}&shop_domain=${shopDomain}&per_page=${perPage}&page=1`
        );
        const allReviewsData = await allReviewsRes.json();
        setAllReviews(allReviewsData.reviews || []);
      } catch (e) {
        setErr("Failed to fetch reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, [judgeMeProductId, apiToken, shopDomain]);

  // Client-side pagination
  const totalPages = Math.max(1, Math.ceil(allReviews.length / 10));

  const pagedReviews = useMemo(
    () => allReviews.slice((page - 1) * 10, page * 10),
    [allReviews, page, 10]
  );

  // Average & breakdown (over all reviews)
  const average =
    allReviews.length > 0
      ? (
          allReviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / allReviews.length
        )
      : 0;

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    stars: star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));


  const renderStars = (rating: number) =>
    [...Array(5)].map((_, idx) => (
      <Text
        key={idx}
        className={`text-lg mr-0.5 ${idx < rating ? "text-primary" : "text-gray-300"}`}
      >
        ★
      </Text>
    ));

    const prdId = extractShopifyNumericId(shopifyProductId);

  return (
    <View className="bg-white py-4 my-4">
      <JudgemeReviewsHeader
        average={average}
        total={totalReviews}
        breakdown={breakdown}
        productId={prdId && parseInt(prdId) || 999999}
      />

      {loading && (
        <View className="flex items-center justify-center my-10">
          <ActivityIndicator />
        </View>
      )}
      {err && <Text className="text-red-600">{err}</Text>}
      {!loading && pagedReviews.length === 0 && (
        <Text className="text-gray-400 text-base text-center py-6">No reviews yet.</Text>
      )}

      {/* Reviews List */}
      {!loading && pagedReviews.length > 0 && (
        <ScrollView
          className=""
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled
          keyboardShouldPersistTaps="always"
        >
          {pagedReviews.map((rev) => (
            <View
              key={rev.id}
              className="mb-6 pb-4 border-b border-gray-200 last:border-b-0"
              style={{ minHeight: 100 }}
            >
              <View className="flex-row items-center mb-1">
                <Text className="font-semibold text-base text-gray-700">
                  {rev.reviewer?.name || "Anonymous"}
                </Text>
                <Text className="ml-3 text-xs text-gray-400">
                  {new Date(rev.created_at).toLocaleDateString()}
                </Text>
              </View>
              <Text className="font-bold text-lg mb-2 text-gray-800">{rev.title}</Text>
              <View className="flex-row items-center mb-2">
                {renderStars(rev.rating)}
                <Text className="ml-2 text-gray-500 text-xs">{rev.rating} / 5</Text>
              </View>
              <Text className="mb-2 text-gray-700">{rev.body}</Text>
              {rev.pictures && rev.pictures?.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {rev.pictures.map((pic, i) => (
                    <Image
                      key={i}
                      source={{ uri: pic.urls.original }}
                      className="w-16 h-16 mr-3 rounded-lg border border-gray-200"
                      resizeMode="cover"
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View className="flex-row items-center justify-center space-x-2 mt-1">
          <Pressable
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50"
            disabled={page === 1}
            onPress={() => setPage((p) => Math.max(p - 1, 1))}
          >
            <Text className="text-base">{'‹ Prev'}</Text>
          </Pressable>
          <Text className="mx-1 text-gray-700 text-sm">
            Page <Text className="font-bold">{page}</Text> of <Text className="font-bold">{totalPages}</Text>
          </Text>
          <Pressable
            className="px-3 py-1.5 rounded-lg bg-gray-100 border border-gray-300 disabled:opacity-50"
            disabled={page === totalPages}
            onPress={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            <Text className="text-base">{'Next ›'}</Text>
          </Pressable>
        </View>
      )}
      {/* Review Count */}
      <Text className="text-center text-xs text-gray-400 mt-4">
        {totalReviews} review{totalReviews !== 1 ? "s" : ""}
      </Text>
    </View>
  );
}
