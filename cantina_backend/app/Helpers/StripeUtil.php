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

	static public function log($obj) {
		$log = new StripeLog();
		$log->log = $obj;
		$log->save();
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

	static public function editStripePriceProduct($product) {
		$stripe = new \Stripe\StripeClient(config('app.stripe_secret'));

		$stripe->products->update($product->id, [
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
