/**
 * TypeScript declarations for Stripe Buy Button custom elements
 * https://stripe.com/docs/payments/buy-button
 */

declare namespace JSX {
  interface IntrinsicElements {
    'stripe-buy-button': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        'buy-button-id': string
        'publishable-key': string
      },
      HTMLElement
    >
  }
}
