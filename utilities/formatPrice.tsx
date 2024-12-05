/**
 * Formats a price amount to a fixed currency format like "$15.00".
 * 
 * @param amount - The amount as a string or number.
 * @param currency - The currency symbol to prepend (default is "$").
 * @returns The formatted price as a string.
 */
export default function formatPrice(amount: string | number, currency = "$"): string {
    const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return `${currency}${numericAmount.toFixed(2)}`;
  }