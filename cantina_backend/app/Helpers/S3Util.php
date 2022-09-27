<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Storage;

class S3Util {

	static function putObject($filePath, $fileContents) {
		return Storage::disk('s3')->put($filePath, $fileContents);
	}

	static function deleteObject($filePath) {
		return Storage::disk('s3')->delete($filePath);
	}

	static function getObject($filePath) {
		// Available for 1 year
		return Storage::disk('s3')->temporaryUrl($filePath, now()->addMinutes(7200));
	}
}
