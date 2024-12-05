/**
 * Calculates the percentage off based on the current price and compare-at price.
 * 
 * @param currentPrice - The current price of the product.
 * @param compareAtPrice - The original price (compare-at price) of the product.
 * @returns The percentage off as a formatted string (e.g., "20% off"), or an empty string if no discount.
 */
export function calculatePercentageOff(
    currentPrice: string | number,
    compareAtPrice: string | number
  ): string {
    const current = typeof currentPrice === "string" ? parseFloat(currentPrice) : currentPrice;
    const compareAt = typeof compareAtPrice === "string" ? parseFloat(compareAtPrice) : compareAtPrice;
  
    if (!compareAt || compareAt <= current) {
      return ""; // No discount if compare-at price is missing or less than/equal to the current price
    }
  
    const percentageOff = ((compareAt - current) / compareAt) * 100;
    return `${percentageOff.toFixed(0)}% off`;
  }
  