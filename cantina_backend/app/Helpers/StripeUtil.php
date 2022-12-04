<?php

namespace App\Helpers;

use App\Models\StripeLog;
use Illuminate\Support\Facades\Log;

class StripeUtil {

	static public function createCustomer($user) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		try {
			$customer = $stripe->customers->create([
				'metadata' => [
					'email' => $user->email,
				]
			]);
		} catch (\Stripe\Exception\InvalidRequestException $e) {
			StripeUtil::log(json_encode([
				'error' => $e->getMessage(),
				'user_id' => $user->id
			]));

			return [];
		}

		StripeUtil::log(json_encode([
			'type' => 'customer.created',
			'customer' => $customer
		]));

		return $customer->id;
	}

	static public function getStripeCustomer($stripe_id) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		return $stripe->customers->retrieve($stripe_id);
	}

	static public function createSubmit($customer, $data) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		try {
			$checkout_session = $stripe->checkout->sessions->create([
				'line_items' => [
					$data
				],
				'customer' => $customer->usr_stripe_id,
				'mode' => 'payment',
				'success_url' => config('app.frontend_url') . '/pedidos',
				'cancel_url' => config('app.frontend_url') . '/',
			]);

			Log::info('ok');
		} catch (\Stripe\Exception\InvalidRequestException $e) {
			Log::info($e);
			StripeUtil::log(json_encode([
				'error' => $e->getMessage(),
				'stripe_id' => $customer,
				'stripe_price_id' => 1
			]));

			return [];
		};

		StripeUtil::log(json_encode([
			'type' => 'checkout.created',
			'subscription' => $data,
		]));

		return [
			'checkout' => $checkout_session,
			'subscription_status' => $checkout_session->status,
		];
	}

	static public function createSessionUpdateSubscription($customer_id, $subscription_id, $user_type) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		try {
			$session = $stripe->checkout->sessions->create([
				'payment_method_types' => ['card'],
				'mode' => 'setup',
				'customer' => $customer_id,
				'setup_intent_data' => [
					'metadata' => [
						'customer_id' => $customer_id,
						'subscription_id' => $subscription_id,
					],
				],
				'success_url' => config('app.frontend_url') . '/' . $user_type . '/profile/plans?success_payment=true',
				'cancel_url' => config('app.frontend_url') . '/' . 'profile/plans',
			]);
		} catch (\Stripe\Exception\InvalidRequestException $e) {
			StripeUtil::log(json_encode([
				'error' => $e->getMessage(),
				'stripe_id' => $customer_id,
				'subscription_id' => $subscription_id
			]));

			return [];
		};

		StripeUtil::log(json_encode([
			'type' => 'checkout.session.created',
			'session' => $session,
		]));

		return [
			'session' => $session,
		];
	}

	static public function log($obj) {
		$log = new StripeLog();
		$log->log = $obj;
		$log->save();
	}

	static public function cancelCustomerSubscription($subscription_id) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		try {
			$sub = $stripe
				->subscriptions
				->update($subscription_id, [
					'cancel_at_period_end' => true
				]);
		} catch (\Stripe\Exception\InvalidRequestException $e) {
			StripeUtil::log(json_encode([
				'error' => $e->getMessage(),
				'subscription_id' => $subscription_id
			]));

			return [];
		};

		StripeUtil::log(json_encode([
			'type' => 'subscription.cancelled',
			'subscription' => $sub,
		]));

		return $sub;
	}

	static public function getStripePaymentIntent($payment_intent_id) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		return $stripe
			->paymentIntents
			->retrieve($payment_intent_id, []);
	}

	static public function createStripePriceProduct($product) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		$stripe->products->create([
			'id' =>  $product->id,
			'description' =>  $product->pro_description,
			'name' => $product->pro_name,
			'active' => true,
		]);

		return $stripe->prices->create([
			'unit_amount' => $product->pro_price * 100,
			'currency' => 'brl',
			'product' => $product->id,
		]);
	}
}
