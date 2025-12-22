<template>
	<section class="section">
		<div class="section-title">
			<div>
				<slot name="title" />
			</div>

			<div class="section-actions">
				<slot name="actions" />
			</div>
		</div>

		<slot />
	</section>
</template>
