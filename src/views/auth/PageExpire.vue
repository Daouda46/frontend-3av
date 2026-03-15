<!-- src/views/OffreExpiree.vue -->
<template>
  <div class="expired-container">
    <div class="card">
      <div class="icon">⚠️</div>
      <h1>Abonnement expiré</h1>
      <p>
        Votre période d’essai ou votre abonnement est arrivé à expiration.
        Pour continuer à utiliser notre service, veuillez renouveler votre offre.
      </p>
      <button>Renouveler maintenant</button>
    </div>
  </div>
</template>

<style scoped>
.expired-container {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.card {
  background: #fff;
  padding: 40px;
  border-radius: 16px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: pop 0.4s ease-out;
}

.icon {
  font-size: 60px;
  margin-bottom: 15px;
}

h1 {
  color: #d32f2f;
  margin-bottom: 10px;
}

p {
  color: #555;
  margin-bottom: 25px;
  line-height: 1.5;
}

button {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #b71c1c;
}

@keyframes pop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
