<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StripeLog extends Model {
	protected $table = 'stripe_logs';

	protected $fillable = ['log'];
}
