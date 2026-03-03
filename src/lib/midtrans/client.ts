import midtransClient from 'midtrans-client';

// Initialize Snap client
export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

// Types for transaction
export interface MidtransTransaction {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details?: {
    first_name: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
  item_details?: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
  callbacks?: {
    finish?: string;
    error?: string;
    pending?: string;
  };
}

// Utility function to create transaction
export async function createSnapTransaction(transaction: MidtransTransaction) {
  try {
    const parameter = {
      transaction_details: transaction.transaction_details,
      customer_details: transaction.customer_details,
      item_details: transaction.item_details,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        error: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
    };

    const response = await snap.createTransaction(parameter);
    return {
      token: response.token,
      redirect_url: response.redirect_url
    };
  } catch (error) {
    console.error('Midtrans transaction error:', error);
    throw error;
  }
}