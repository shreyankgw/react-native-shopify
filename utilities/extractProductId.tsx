export default function extractProductId(gid: string): string {
  // gid: "gid://shopify/Product/7928273567938"
  const match = gid.match(/\/Product\/(\d+)$/);
  return match ? match[1] : gid;
}