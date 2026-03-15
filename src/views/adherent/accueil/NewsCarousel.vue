<template>
  <div class="carousel-wrapper">
    <div id="newsCarousel" 
         class="carousel slide carousel-fade shadow-xl" 
         data-bs-ride="carousel" 
         data-bs-interval="6000">
         
      <!-- Indicateurs modernes -->
      <div class="carousel-indicators custom-indicators">
        <button v-for="(slide, index) in slides"
                :key="index"
                type="button"
                :data-bs-target="'#newsCarousel'"
                :data-bs-slide-to="index"
                :class="{ active: index === 0 }"
                :aria-label="'Slide ' + (index + 1)">
          <span class="indicator-dot"></span>
        </button>
      </div>

      <!-- Slides avec overlay gradient -->
      <div class="carousel-inner rounded-3xl overflow-hidden">
        <div v-for="(slide, index) in slides"
             :key="index"
             class="carousel-item"
             :class="{ active: index === 0 }">
          
          <!-- Image avec overlay -->
          <div class="image-container">
            <img :src="`${fileUrl}/${slide.fichier}`" 
                 class="d-block w-100 carousel-image" 
                 :alt="slide.title"
                 loading="lazy">
            <div class="image-overlay"></div>
          </div>
          
          <!-- Caption moderne et animé -->
          <div class="carousel-caption custom-caption d-flex flex-column align-items-start justify-content-end">
            <div class="caption-content" :class="{'animate-in': index === 0}">
              <span class="badge bg-gradient-primary mb-3 px-4 py-2 rounded-pill">
                <iconify-icon icon="solar:star-bold" class="me-2"></iconify-icon>
                Actualité
              </span>
              <h5 class="display-5 fw-bold mb-3 text-white text-shadow">{{ slide.title }}</h5>
              <p class="lead mb-4 text-white-80">{{ slide.description }}</p>
              <button class="btn btn-outline-light btn-lg rounded-pill px-5">
                <span>En savoir plus</span>
                <iconify-icon icon="solar:arrow-right-linear" class="ms-2"></iconify-icon>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Contrôles modernes -->
      <button class="carousel-control-prev custom-control" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
        <span class="control-icon">
          <iconify-icon icon="solar:alt-arrow-left-bold"></iconify-icon>
        </span>
      </button>
      <button class="carousel-control-next custom-control" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
        <span class="control-icon">
          <iconify-icon icon="solar:alt-arrow-right-bold"></iconify-icon>
        </span>
      </button>

      <!-- Progress bar -->
      <div class="carousel-progress">
        <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
      </div>
    </div>

    <!-- Miniatures floues en arrière-plan (effet de profondeur) -->
    <div class="carousel-blur-bg" v-if="slides.length > 0">
      <img :src="`${fileUrl}/${slides[currentIndex]?.fichier}`" alt="" aria-hidden="true">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  slides: {
    type: Array,
    required: true,
  }
})

// Récupérer la variable d'environnement
// @ts-ignore
const fileUrl = import.meta.env.VITE_FILE_URL

// État pour l'index courant et la progress bar
const currentIndex = ref(0)
const progressWidth = ref(0)
let interval = null

// Fonction pour mettre à jour l'index courant
const updateCurrentIndex = () => {
  const carousel = document.querySelector('#newsCarousel')
  if (carousel && window.bootstrap) {
    const activeItem = carousel.querySelector('.carousel-item.active')
    if (activeItem) {
      const index = Array.from(carousel.querySelectorAll('.carousel-item')).indexOf(activeItem)
      currentIndex.value = index
    }
  }
}

// Animation de la progress bar
const startProgressBar = () => {
  progressWidth.value = 0
  const step = 100 / (6000 / 50) // 6000ms interval, mise à jour toutes les 50ms
  
  if (interval) clearInterval(interval)
  
  interval = setInterval(() => {
    if (progressWidth.value < 100) {
      progressWidth.value += step
    } else {
      progressWidth.value = 0
    }
  }, 50)
}

// Initialisation du carousel
onMounted(() => {
  const carouselEl = document.querySelector('#newsCarousel')
  if (carouselEl && window.bootstrap) {
    const carousel = new bootstrap.Carousel(carouselEl, {
      interval: 6000,
      ride: 'carousel',
      pause: 'hover',
      wrap: true
    })

    // Écouter les événements du carousel
    carouselEl.addEventListener('slid.bs.carousel', () => {
      updateCurrentIndex()
      startProgressBar()
    })

    startProgressBar()
    updateCurrentIndex()
  }
})

// Nettoyage
onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.carousel-wrapper {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Carousel principal */
.carousel {
  border-radius: 30px;
  box-shadow: 0 30px 40px -20px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  background: transparent;
}

/* Arrière-plan flou */
.carousel-blur-bg {
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  z-index: 1;
  filter: blur(30px) brightness(0.7);
  opacity: 0.5;
  border-radius: 50px;
  overflow: hidden;
}

.carousel-blur-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Images */
.image-container {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.carousel-image {
  height: 100%;
  object-fit: cover;
  transform: scale(1);
  transition: transform 6s ease-out;
}

.carousel-item.active .carousel-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.2) 100%
  );
  z-index: 1;
}

/* Caption moderne */
.custom-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 80px 60px;
  text-align: left;
  z-index: 2;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    transparent 100%
  );
}

.caption-content {
  max-width: 600px;
  transform: translateY(30px);
  opacity: 0;
  transition: all 0.8s ease 0.3s;
}

.carousel-item.active .caption-content {
  transform: translateY(0);
  opacity: 1;
}

/* Badge */
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Texte */
.text-white-80 {
  color: rgba(255, 255, 255, 0.8);
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.display-5 {
  font-size: 3rem;
  line-height: 1.2;
}

/* Bouton */
.btn-outline-light {
  border-width: 2px;
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: white;
  color: #333;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* Indicateurs modernes */
.custom-indicators {
  bottom: 30px;
  gap: 8px;
  z-index: 3;
}

.custom-indicators button {
  width: auto;
  height: auto;
  margin: 0;
  opacity: 0.5;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
}

.custom-indicators button.active {
  opacity: 1;
}

.indicator-dot {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.custom-indicators button.active .indicator-dot {
  width: 30px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}

/* Contrôles modernes */
.custom-control {
  width: 60px;
  height: 60px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.carousel:hover .custom-control {
  opacity: 1;
}

.control-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  color: white;
  font-size: 2rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.custom-control:hover .control-icon {
  background: white;
  color: #667eea;
  transform: scale(1.1);
  border-color: white;
}

.carousel-control-prev {
  left: 30px;
}

.carousel-control-next {
  right: 30px;
}

/* Progress bar */
.carousel-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  z-index: 3;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 50ms linear;
  box-shadow: 0 0 10px #667eea;
}

/* Responsive */
@media (max-width: 992px) {
  .image-container {
    height: 500px;
  }
  
  .display-5 {
    font-size: 2.2rem;
  }
  
  .custom-caption {
    padding: 40px 30px;
  }
  
  .custom-control {
    width: 40px;
    height: 40px;
  }
  
  .control-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .image-container {
    height: 400px;
  }
  
  .display-5 {
    font-size: 1.8rem;
  }
  
  .custom-caption {
    padding: 30px 20px;
  }
  
  .custom-caption .btn {
    padding: 8px 24px;
    font-size: 0.9rem;
  }
  
  .custom-control {
    display: none;
  }
  
  .carousel-indicators {
    bottom: 15px;
  }
}

/* Animation d'entrée */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeInUp 0.8s ease forwards;
}

/* Effet de survol sur le carousel */
.carousel {
  transition: box-shadow 0.3s ease;
}

.carousel:hover {
  box-shadow: 0 40px 60px -20px rgba(102, 126, 234, 0.4);
}
</style>