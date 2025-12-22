<template>
	<div class="section">
		<div class="section-title">
			{{ title }}

			<slot name="actions" />
		</div>

		<slot />
	</div>
</template>

<script setup>
defineProps({
	title: {
		type: String,
		required: true
	}
})
</script>
