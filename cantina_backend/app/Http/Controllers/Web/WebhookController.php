<?php

namespace App\Http\Controllers\Web;

use App\Helpers\StripeUtil;
use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\User;
use App\Models\UserPayment;
use App\Models\UserPlan;
use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Http\Request;

class WebhookController extends Controller {

	public function handleWebhook(Request $request) {
		\Stripe\Stripe::setApiKey(config('app.stripe_secret'));

		$event = null;

		$payload = $request->getContent();

		try {
			$event = \Stripe\Event::constructFrom(json_decode($payload, true));
		} catch (\Stripe\Exception\UnexpectedValueException $e) {
			return response()->json(['errors' => $e->getMessage()], 401);
		} catch (\Stripe\Exception\AuthenticationException $e) {
			return response()->json(['errors' => $e->getMessage()], 403);
		} catch (\Stripe\Exception\ApiConnectionException $e) {
			return response()->json(['errors' => $e->getMessage()], 503);
		} catch (\Exception $e) {
			return response()->json(['errors' => $e->getMessage()], 500);
		}

		switch ($event->type) {
			case 'payment_intent.created':
				$payment_intent = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'payment_intent' => $payment_intent
				])));

				break;
			case 'payment_intent.succeeded':
				$payment_intent = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'payment_intent' => $payment_intent
				])));

				break;
			case 'payment_intent.payment_failed':
				$payment_intent = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'payment_intent' => $payment_intent
				])));

				break;
			case 'payment_intent.requires_action':
				$payment_intent = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'payment_intent' => $payment_intent
				])));

				break;
			case 'payment_intent.canceled':
				$payment_intent = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'payment_intent' => $payment_intent
				])));

				break;
			case 'invoice.created':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'invoice.updated':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'invoice.finalized':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'invoice.payment_action_required':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'invoice.voided':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'charge.succeeded':
				$charge = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'charge' => $charge
				])));

				break;
			case 'charge.failed':
				$charge = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'charge' => $charge
				])));

				break;
			case 'invoice.payment_succeeded':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				// $this->handleInvoicePaymentSucceeded($invoice);

				break;
			case 'invoice.payment_failed':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'invoice.paid':
				$invoice = $event->data->object;

				StripeUtil::log(json_encode(([
					'type' => $event->type,
					'invoice' => $invoice
				])));

				break;
			case 'customer.created':
				$customer = $event->data->object;

				StripeUtil::log(json_encode([
					'type' => $event->type,
					'subscription' => $customer,
					'customer_id' => $customer->id,
				]));

				break;
			case 'customer.source.created':
				$source = $event->data->object;

				StripeUtil::log(json_encode([
					'type' => $event->type,
					'source' => $source,
					'customer_id' => $source->customer,
				]));

				break;
			case 'customer.updated':
				$customer = $event->data->object;

				StripeUtil::log(json_encode([
					'type' => $event->type,
					'customer' => $customer,
					'customer_id' => $customer->id,
				]));

				break;
			case 'setup_intent.created':
				$setup_intent = $event->data->object;

				StripeUtil::log(json_encode([
					'type' => $event->type,
					'subscription' => $setup_intent,
					'customer_id' => $setup_intent->customer,
				]));

				break;
			case 'setup_intent.succeeded':
				$setup_intent = $event->data->object;

				StripeUtil::log(json_encode([
					'type' => $event->type,
					'setuo_intent' => $setup_intent,
					'customer_id' => $setup_intent->customer,
				]));

				break;
			case 'checkout.session.completed':
				$checkout_session = $event->data->object;

				StripeUtil::log(json_encode([
					'event' => $event,
					'type' => $event->type,
					'checkout_session' => $checkout_session,
					'customer_id' => $checkout_session->customer,
				]));

				$this->handleUpdatedOrder($checkout_session);

				break;
			default:
				StripeUtil::log(json_encode([
					'type' => $event->type,
					'event' => $event,
				]));

				return response()->json(null, 203);
		}

		return response()->json(null, 200);
	}

	private function handleUpdatedOrder($checkout_session) {
		$user = Usuario::where(['usr_active' => 1, 'usr_stripe_id' => $checkout_session->customer])->firstOrFail();

		$order = Pedido::where(['ord_user_id' => $user->id, 'ord_state_payment' => 'não pago'])->latest()->firstOrFail();

		$order->ord_state_payment = 'pago';

		$order->save();
	}
}
