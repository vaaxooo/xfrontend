<template>
	<ProfileInfoSection />
	<LoginSettingsSection />
	<SecuritySection />
	<SessionsSection />
</template>


<script setup>
import ProfileInfoSection from '~/components/profile/ProfileInfoSection.vue';
import LoginSettingsSection from '~/components/profile/security/LoginSettingsSection.vue';
import SecuritySection from '~/components/profile/security/SecuritySection.vue';
import SessionsSection from '~/components/profile/sessions/SessionsSection.vue';
</script>