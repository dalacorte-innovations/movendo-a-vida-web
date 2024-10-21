import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe não carregado corretamente');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      toast.error(error.message);
    } else {
      console.log(token);
      toast.success('Pagamento processado com sucesso');
    }
  };

  return (
    <div>
      <h2>Página de Pagamento</h2>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pagar
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
