<template>
	<a
		href="#"
		class="button button--secondary button-social gap-20"
	>
		<div class="row">
			<img
				:src="icon"
				class="w-32 h-32"
			>
			{{ title }}
		</div>

		<img
			:src="statusIcon"
			class="w-24 h-24"
		>
	</a>
</template>

<script setup>
defineProps({
	icon: String,
	title: String,
	statusIcon: String
})
</script>
