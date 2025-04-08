// A simple function to format a number as a price
export function formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

// Example usage
// console.log(formatPrice(1234.56)); // Output: $1234.56
