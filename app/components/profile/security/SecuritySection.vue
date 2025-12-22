<template>
	<AppSection title="Безопасность">
		<div class="block row p-16">
			<div class="row">
				<div class="icon">
					<img src="/assets/images/icons/2fa.svg" class="w-32 h-32">
				</div>

				<div class="block-content">
					<div class="block-content__title">
						Двухфакторная аутентификация
					</div>

					<div class="block-content__description">
						Дополнительный способ защиты аккаунта.
					</div>
				</div>
			</div>

			<div class="block-action">
				<a href="#" class="button button--success">
					Включить
				</a>
			</div>
		</div>
	</AppSection>
</template>

<script setup>
import AppSection from '@/components/common/AppSection.vue'
</script>