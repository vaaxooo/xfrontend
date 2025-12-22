<template>
	<img
		:src="`/assets/images/icons/${name}.svg`"
		:alt="name"
		class="icon"
	>
</template>

<script setup>
defineProps({
	name: {
		type: String,
		required: true
	}
})
</script>
