<template>
	<div class="section">
		<div class="section-title">
			История активности

			<div class="section-actions">
				<a href="#" class="button button--danger">
					Завершить все сеансы
				</a>
			</div>
		</div>

		<div class="block">
			<div class="sessions">
				<SessionItem
					icon-src="/assets/images/icons/desktop.svg"
					title="Windows 10 • Chrome 141"
					description="Latvia IP-адрес: 94.140.114.195<br>Дата открытия текущей сессии: 10 октября 2025 г."
				/>

				<SessionItem
					icon-src="/assets/images/icons/phone.svg"
					title="Apple iPhone • Mobile Safari 11.4"
					description="Germany IP-адрес: 188.241.241.36<br>Дата открытия текущей сессии: 1 декабря 2025 г."
				/>

				<SessionItem
					icon-src="/assets/images/icons/desktop.svg"
					title="Windows 10 • Chrome 141"
					description="Latvia IP-адрес: 94.140.114.195<br>Дата открытия текущей сессии: 10 октября 2025 г."
					:closable="false"
				/>
			</div>
		</div>
	</div>
</template>
