<template>
  <Loader :isLoading="isLoading" />
  <div class="page-wrapper" id="main-wrapper">
    <div class="login-container">
      
      <!-- Background avec particules -->
      <div class="background">
        <div class="background-image"></div>
        <div class="background-overlay"></div>
        <div class="particles">
          <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
        </div>
      </div>
      
      <!-- Contenu -->
      <div class="content-wrapper">
        <div class="login-card">
          <!-- Logo animé -->
          <div class="logo-wrapper">
            <img src="../../../public/assets/images/logo.jpg" alt="Logo" class="login-logo">
            <div class="logo-glow"></div>
          </div>
          
          <h1 class="welcome-title">Bienvenue</h1>
          <p class="welcome-subtitle">Connectez-vous à votre espace</p>
          
          <form @submit.prevent="login" class="login-form">
            <!-- Matricule -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-person-badge"></i>
                Matricule
              </label>
              <div class="input-wrapper">
                <input type="text" 
                       v-model="form.matricule"
                       class="form-input" 
                       placeholder="Entrez votre matricule"
                       :class="{ 'error': $v.matricule.$error }">
                <span class="input-icon">
                  <i class="bi bi-person-badge-fill"></i>
                </span>
              </div>
              <span v-if="$v.matricule.$error" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                Ce champ est requis
              </span>
            </div>
            
            <!-- Password -->
            <div class="form-group">
              <label class="form-label">
                <i class="bi bi-lock"></i>
                Mot de passe
              </label>
              <div class="input-wrapper">
                <input :type="showPassword ? 'text' : 'password'"
                       v-model="form.password"
                       class="form-input"
                       placeholder="Entrez votre mot de passe"
                       :class="{ 'error': $v.password.$error }">
                <span class="input-icon" @click="toggleShowPassword">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
              </div>
              <span v-if="$v.password.$error" class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                Ce champ est requis
              </span>
            </div>
            
            <button type="submit" class="login-button" :disabled="isLoading">
              <span v-if="!isLoading">Se connecter</span>
              <span v-else class="spinner"></span>
            </button>
          </form>
          
          <div class="copyright">
            &copy; {{ new Date().getFullYear() }} 3AV - Tous droits réservés -  Version 2.0
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth/user";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { ref, reactive } from "vue";
import Loader from "../../components/Loader.vue";

const userStore = useAuthStore();
const router = useRouter();
const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  matricule: "",  
  password: "",
});

const rules = {
  matricule: { required },
  password: { required },
};

const $v = useVuelidate(rules, form);

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  $v.value.$touch();
  if (!$v.value.$invalid) {
    try {
      isLoading.value = true;
      const success = await userStore.login(form);
      if (success) {
        router.push('/Dashbord');
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      isLoading.value = false;
    }
  }
};

// Style pour les particules
const getParticleStyle = (n: number) => {
  const size = Math.random() * 5 + 2;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 5}s`,
    background: `rgba(255, 255, 255, ${Math.random() * 0.5})`
  };
};
</script>

<style scoped>
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Background */
.background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../../../public/assets/images/logo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* Améliorer la netteté */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  transform: scale(1.02); /* Léger zoom pour éviter les bords flous */
  filter: brightness(0.8);
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(44, 62, 80, 0.85) 0%,
    rgba(52, 73, 94, 0.8) 50%,
    rgba(58, 123, 213, 0.85) 100%);
  z-index: 1;
}

/* Particules */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float 10s infinite ease-in-out;
  opacity: 0.3;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, -10px); }
  50% { transform: translate(20px, 0); }
  75% { transform: translate(10px, 10px); }
}

/* Contenu */
.content-wrapper {
  position: relative;
  z-index: 3;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 40px;
  padding: 50px 40px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  animation: cardAppear 0.8s ease;
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo */
.logo-wrapper {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 120px;
  height: 120px;
  border-radius: 30px;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(58, 123, 213, 0.3);
  position: relative;
  z-index: 2;
}

.logo-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(58, 123, 213, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow 3s infinite;
}

@keyframes glow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.1); }
}

/* Textes */
.welcome-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.welcome-subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 40px;
  font-size: 1rem;
}

/* Formulaire */
.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #334155;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-label i {
  color: #3a7bd5;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 15px 45px 15px 15px;
  border: 2px solid #e2e8f0;
  border-radius: 15px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #3a7bd5;
  box-shadow: 0 0 0 4px rgba(58, 123, 213, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.3s ease;
}

.input-icon:hover {
  color: #3a7bd5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 5px;
}

/* Bouton */
.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #3a7bd5, #2c3e50);
  border: none;
  border-radius: 15px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 20px;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(58, 123, 213, 0.4);
}

.login-button:hover::before {
  left: 100%;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Copyright */
.copyright {
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 576px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .welcome-title {
    font-size: 1.8rem;
  }
  
  .login-logo {
    width: 100px;
    height: 100px;
  }
}
</style>