<template>
    <div class="auth-card block p-32">
        <div class="auth-header">
            <h1>Добро пожаловать!</h1>
            <p>Пожалуйста, войдите в свою учётную запись для начала работы.</p>
        </div>

        <div class="auth-content">

            <div class="auth-form">
                <!-- form -->
                <div class="field">
                    <input type="email" placeholder="Электронная почта" class="input">
                </div>

                <div class="field">
                    <input type="password" placeholder="••••••••" class="input">
                </div>

                <div class="row">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input">
                        <span class="checkbox__box"></span>
                        <span class="checkbox__label">Запомнить меня</span>
                    </label>
                    

                    <a href="#" class="link link--primary">Забыли пароль?</a>
                </div>


                <div class="auth-actions">
                    <button class="button button--auth w-full center button-md">
                        Войти в систему
                        <img src="assets/images/icons/arrow-right-white.svg" alt="arrow" class="w-24 h-24">
                    </button>
                </div>

                <div class="auth-footer">
                    <span class="center justify-content-center">
                        Нет учётной записи? <a href="#" class="link link--primary">Зарегистрироваться</a>
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