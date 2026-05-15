import { Metadata } from 'next';
import OrderClient from './OrderClient';

export const metadata: Metadata = {
  title: "Checkout | Chattha's Restaurant",
  description: "Complete your order and enjoy authentic desi flavours delivered to your doorstep.",
};

export default function OrderPage() {

  return <OrderClient />;
}
