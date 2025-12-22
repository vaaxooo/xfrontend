<template>
    <div class="auth-card block p-32">
        <div class="auth-header">
            <h1>Восстановление доступа</h1>
            <p>Пожалуйста, придумайте новый пароль для своей учётной записи.</p>
        </div>

        <div class="auth-content">

            <div class="auth-form">
                <!-- form -->
                <div class="field">
                    <input type="password" placeholder="Придумайте пароль" class="input">
                </div>

                <div class="field">
                    <input type="password" placeholder="Повторите пароль" class="input">
                </div>


                <div class="auth-actions">
                    <button class="button button--auth w-full center button-md">
                        Изменить пароль
                        <img src="assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth',
})
</script>    