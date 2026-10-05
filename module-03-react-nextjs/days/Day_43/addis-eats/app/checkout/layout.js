export const dynamic = "force-dynamic";

// Checkout reads request-specific session information
// and may use live pricing, so it must be rendered dynamically.

function CheckoutLayout({ children }) {
  return children;
}

export default CheckoutLayout;