<template>
	<div class="section">
		<div class="section-title">
			Параметры входа
		</div>

		<div class="block row p-16">
			<div class="row">
				<div class="icon">
					<img src="/assets/images/icons/lock.svg" class="w-32 h-32">
				</div>

				<div class="block-content">
					<div class="block-content__title">
						Пароль от аккаунта
					</div>

					<div class="block-content__description">
						Пароль нужен, чтобы входить в аккаунт по email
					</div>
				</div>
			</div>

			<div class="block-action">
				<a href="#" class="button button--secondary">
					Изменить
				</a>
			</div>
		</div>

		<SocialAuthBlock />
	</div>
</template>
