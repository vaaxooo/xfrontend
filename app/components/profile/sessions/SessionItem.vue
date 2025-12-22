<template>
	<div class="session p-16">
		<div class="session-device">
			<div class="icon">
				<img
					:src="iconSrc"
					class="w-32 h-32"
				>
			</div>

			<div class="session-details">
				<div class="session-details__title">
					{{ title }}
				</div>

				<div class="session-details__description">
					<span v-html="description" />
				</div>
			</div>
		</div>

		<div class="session-actions">
			<a
				v-if="closable"
				href="#"
				class="button button--secondary"
			>
				Завершить сеанс
			</a>
		</div>
	</div>
</template>

<script setup>
defineProps({
	iconSrc: String,
	title: String,
	description: String,
	closable: {
		type: Boolean,
		default: true
	}
})
</script>
