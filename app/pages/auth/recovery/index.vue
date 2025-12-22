<template>
    <div class="auth-card block p-32">
        <div class="auth-header">
            <h1>Восстановление доступа</h1>
            <p>Мы отправим Вам на электронную почту уникальную ссылку для изменения пароля.</p>
        </div>

        <div class="auth-content">

            <div class="auth-form">
                <!-- form -->
                <div class="field">
                    <input type="email" placeholder="Электронная почта" class="input">
                </div>


                <div class="auth-actions">
                    <button class="button button--auth w-full center button-md">
                        Восстановить доступ
                        <img src="assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
                    </button>
                </div>

                <div class="auth-footer">
                    <span class="center justify-content-center">
                        Вспомнили свой пароль? <a href="#" class="link link--primary">Войти в систему</a>
                    </span>
                </div>

            </div>

            <div class="auth-separator">
                Или войдите с помощью
            </div>


            <div class="auth-socials">
                <a href="#" class="button button--secondary button-social center justify-content-center">
                    <img src="assets/images/icons/telegram.svg" alt="Telegram" class="w-32 h-32">
                </a>
                <a href="#" class="button button--secondary button-social center justify-content-center">
                    <img src="assets/images/icons/facebook.svg" alt="Facebook" class="w-32 h-32">
                </a>
                <a href="#" class="button button--secondary button-social center justify-content-center">
                    <img src="assets/images/icons/google.svg" alt="Google" class="w-32 h-32">
                </a>
                <a href="#" class="button button--secondary button-social center justify-content-center">
                    <img src="assets/images/icons/apple.svg" alt="Apple" class="w-32 h-32">
                </a>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'auth',
})
</script>    