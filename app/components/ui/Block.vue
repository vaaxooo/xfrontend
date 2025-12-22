<template>
	<div
		class="block"
		:class="classes"
	>
		<slot />
	</div>
</template>

<script setup>
defineProps({
	classes: {
		type: String,
		default: ''
	}
})
</script>
