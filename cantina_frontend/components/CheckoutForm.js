import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import styles from '../styles/CheckoutForm.module.css';
import Swal from 'sweetalert2';
import router from 'next/router';
import { AiOutlineClose } from 'react-icons/ai';

export default function CheckoutForm({ stripeSecret, setModal }) {
	const { user } = useSelector((state) => state);
	const stripe = useStripe();
	const elements = useElements();

	const [loading, setLoading] = useState(false);

	const styleCard = {
		style: {
			base: {
				fontSize: '16px',
				color: '#424770',
				'::placeholder': { color: '#aab7c4' }
			},
			invalid: { color: '#9e2146' }
		}
	};

	const handleSubmit = async event => {
		setLoading(true);

		event.preventDefault();

		if (!stripe || !elements) return;

		const cardElement = elements.getElement(CardElement);

		stripe.confirmCardPayment(stripeSecret, {
			payment_method: {
				card: cardElement,
				billing_details: { name: user.user.full_name },
			}
		}).then(result => {
			if (result.error) {
				Swal.fire("Ops", "Um erro ocorreu, entre em contato com o suporte", 'error');
			} else {
				Swal.fire('Ok', 'Pagamento confirmado com sucesso!', 'success');

				router.push(`/`);
			}
		}).finally(() => {
			setLoading(false);
			setModal(false);
		});
	};

	return (
		<form className={styles.checkoutForm} onSubmit={handleSubmit}>
			<div className="d-flex justify-content-end">
				<AiOutlineClose className={styles.closeCreditCard} size={26} onClick={() => setModal(false)} />
			</div>

			<p>Número do cartão</p>

			<CardElement options={styleCard} />

			<div className="d-block d-md-flex justify-content-end">
				<button className={`button-primary mt-5 justify-content-end ${styles.payButton}`} style={{ height: 50, width: 200 }} type="submit" disabled={!stripe}>{loading ? <i className="fas fa-spinner fa-spin"></i> : "Pagar agora"}</button>
			</div>
		</form>
	);
}