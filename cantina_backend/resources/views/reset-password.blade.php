<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

	<style>
		html,
		body {
			background-color: #fff;
			color: #636b6f;
			font-family: 'Nunito', sans-serif;
			font-weight: 200;
			height: 100vh;
			margin: 0;
		}

		.full-height {
			height: 100vh;
		}

		.flex-center {
			align-items: center;
			display: flex;
			justify-content: center;
		}

		.flex-start {
			align-items: flex-start;
			display: flex;
			justify-content: center;
		}

		.position-ref {
			position: relative;
		}

		.top-right {
			position: absolute;
			right: 10px;
			top: 18px;
		}

		.align-text-center {
			text-align: center;
		}

		.title {
			font-size: 34px;
		}


		.m-b-md {
			margin-bottom: 30px;
		}

		.email-body {
			color: #555555;
			font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
			line-height: 1.2;
			padding-top: 20px;
			padding-right: 20px;
			padding-bottom: 20px;
			padding-left: 20px;
		}

		.inner-email-body {
			font-size: 14px;
			line-height: 1.2;
			color: #555555;
			min-width: 320px;
			max-width: 500px;
			font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
		}

		.paragraph-inner-email-body {
			font-size: 14px;
			line-height: 1.2;
			word-break: break-word;
			margin: 0;
			margin-top: 15px;
		}

		.li-class {
			font-size: 14px;
			line-height: 1.2;
			padding-left: 0px;
		}

		.body-header {
			display: flex;
			height: 100px;
			align-items: center;
			justify-content: left;
		}

		.recipient-paragraph {
			color: #ffff;
		}

		.ul-container {
			margin-bottom: 30px;
			min-width: 320px;
			max-width: 480px;
			margin-top: 30px;
			display: flex;
			justify-content: center;
			font-weight: bold;
			font-size: 30px;
			letter-spacing: 20px;
		}

		.email-body-header {
			min-width: 320px;
			max-width: 500px;
			display: flex;
			justify-content: space-between;
		}

		.email-body-footer {
			min-width: 320px;
			max-width: 500px;
			display: flex;
			justify-content: space-between;
			margin-top: 10px;
		}

		hr.solid {
			border-top: 3px solid #bbb;
		}

		.email-footer {
			display: flex;
			justify-content: center;
		}

		.imagem-topo {
			display: flex;
			margin: 0;
			padding: 0;			
		}
	</style>
</head>

<body>
	<div class="flex-start position-ref full-height">
		<div class="email-body">
			<div class="inner-email-body">
				<div class="email-body-header">
					<div>
						<img width="150px" src="{{URL::asset('/images/logo-white.png')}}">
					</div>
				</div>

				<div>
					<div class="body-header imagem-topo">
						<p class="recipient-paragraph">Hello!</p>
					</div>
				</div>
				<p class="paragraph-inner-email-body align-text-center"><strong>Your reset password token.</strong></p>

				<div class="ul-container">
					{{ $token }}
				</div>

				<hr class="solid">

				<div class="email-footer">
					<p>© 2022 - Smart Tools Plus | All right reserved</p>
				</div>
			</div>
		</div>
	</div>
</body>

</html>