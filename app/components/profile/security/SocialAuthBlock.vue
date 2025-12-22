<template>
	<div class="block p-16">
		<div class="row justify-content-start">
			<div class="icon">
				<img src="/assets/images/icons/id.svg" class="w-32 h-32">
			</div>

			<div class="block-content">
				<div class="block-content__title">
					Вход через соцсети
				</div>

				<div class="block-content__description">
					Привяжите аккаунты соцсетей, чтобы входить с их помощью
				</div>
			</div>
		</div>

		<div class="block-action row justify-content-start socials">
			<SocialButton
				icon="/assets/images/icons/telegram.svg"
				title="Telegram"
				status-icon="/assets/images/icons/green-check.svg"
			/>

			<SocialButton
				icon="/assets/images/icons/google.svg"
				title="Google"
				status-icon="/assets/images/icons/plus.svg"
			/>

			<SocialButton
				icon="/assets/images/icons/apple.svg"
				title="Apple ID"
				status-icon="/assets/images/icons/plus.svg"
			/>

			<SocialButton
				icon="/assets/images/icons/facebook.svg"
				title="Facebook"
				status-icon="/assets/images/icons/plus.svg"
			/>
		</div>
	</div>
</template>
