<template>
	<button
		class="button"
		:class="`button--${variant}`"
	>
		<slot />
	</button>
</template>

<script setup>
defineProps({
	variant: {
		type: String,
		default: 'secondary'
	}
})
</script>
