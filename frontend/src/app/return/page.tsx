import dynamic from 'next/dynamic';

const CheckoutPage = dynamic(() => import('../../components/checkout/CheckoutPage'), {
  ssr: false // This will load the component only on client-side
});

export default function Page() {
    return (
        <CheckoutPage />
    );
}