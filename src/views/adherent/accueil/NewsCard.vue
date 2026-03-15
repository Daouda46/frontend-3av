<template>
  <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 mb-4">
    <div class="news-card" @click="$router.push({ name: 'news-detail', params: { id: news.id } })">
      
      <!-- Image avec overlay et badges -->
      <div class="card-image-wrapper">
        <img :src="`${file_url}/${news.fichier}`" 
             class="card-image" 
             :alt="news.title"
             loading="lazy">
        
        <!-- Badge catégorie (optionnel) -->
        <div class="card-category" v-if="news.category">
          <span class="category-badge">{{ news.category }}</span>
        </div>
        
        <!-- Badge date flottant -->
        <div class="card-date-badge">
          <iconify-icon icon="solar:calendar-bold" class="me-1"></iconify-icon>
          <span>{{ formatDate(news.date) }}</span>
        </div>
        
        <!-- Overlay gradient au hover -->
        <div class="image-overlay"></div>
      </div>

      <!-- Contenu de la carte -->
      <div class="card-content">
        <h3 class="card-title">{{ truncateTitle(news.title) }}</h3>
        <p class="card-summary">{{ truncateSummary(news.summary) }}</p>
        
        <!-- Footer de la carte -->
        <div class="card-footer">
          <div class="author-info" v-if="news.author">
            <div class="author-avatar">
              <img :src="news.author.avatar || defaultAvatar" alt="">
            </div>
            <span class="author-name">{{ news.author.name }}</span>
          </div>
          
          <div class="card-stats">
            <span class="stat-item" v-if="news.views">
              <iconify-icon icon="solar:eye-bold"></iconify-icon>
              {{ formatNumber(news.views) }}
            </span>
            <span class="stat-item" v-if="news.likes">
              <iconify-icon icon="solar:heart-bold"></iconify-icon>
              {{ formatNumber(news.likes) }}
            </span>
          </div>
        </div>

        <!-- Bouton lire plus (apparaît au hover) -->
        <div class="read-more">
          <span class="read-more-text">Lire l'article</span>
          <iconify-icon icon="solar:arrow-right-linear" class="read-more-icon"></iconify-icon>
        </div>
      </div>

      <!-- Éléments décoratifs -->
      <div class="card-glow"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  news: {
    type: Object,
    required: true,
    default: () => ({
      id: 1,
      fichier: 'https://cdn.pixabay.com/photo/2024/05/22/21/51/dog-8781844_1280.jpg',
      title: 'Titre actualité',
      summary: 'Résumé court de l\'actualité qui attire l\'attention du lecteur...',
      date: '2024-03-14',
      category: 'Actualité',
      views: 1234,
      likes: 56,
      author: {
        name: 'Jean Dupont',
        avatar: null
      }
    })
  }
})

// URL des fichiers
const file_url = computed(() => {
  // @ts-ignore
  return import.meta.env.VITE_FILE_URL
})

// Avatar par défaut
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=3a7bd5&color=fff'

// Formatage de la date
const formatDate = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const newsDate = new Date(date)
  const diffTime = Math.abs(now - newsDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return "Hier"
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`
  
  return newsDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Troncature du titre
const truncateTitle = (title) => {
  if (!title) return ''
  return title.length > 60 ? title.substring(0, 57) + '...' : title
}

// Troncature du résumé
const truncateSummary = (summary) => {
  if (!summary) return ''
  return summary.length > 100 ? summary.substring(0, 97) + '...' : summary
}

// Formatage des nombres
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}
</script>

<style scoped>
.news-card {
  position: relative;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 30px 40px -10px rgba(58, 123, 213, 0.3);
}

/* Image wrapper */
.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.news-card:hover .card-image {
  transform: scale(1.1);
}

/* Badge catégorie */
.card-category {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
}

.category-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 6px 15px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
  backdrop-filter: blur(5px);
}

/* Badge date */
.card-date-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 0.75rem;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.card-date-badge iconify-icon {
  color: #667eea;
  font-size: 0.9rem;
}

/* Overlay */
.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.news-card:hover .image-overlay {
  opacity: 1;
}

/* Contenu */
.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  background: white;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 10px;
  line-height: 1.4;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card:hover .card-title {
  color: #667eea;
}

.card-summary {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 15px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #667eea;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.card-stats {
  display: flex;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #64748b;
}

.stat-item iconify-icon {
  color: #667eea;
  font-size: 0.9rem;
}

/* Bouton lire plus */
.read-more {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 8px 15px;
  border-radius: 50px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.news-card:hover .read-more {
  opacity: 1;
  transform: translateX(0);
}

.read-more-text {
  margin-right: 5px;
}

.read-more-icon {
  transition: transform 0.3s ease;
}

.news-card:hover .read-more-icon {
  transform: translateX(5px);
}

/* Effet de glow */
.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: 0 0 30px 5px rgba(102, 126, 234, 0.3);
  z-index: -1;
}

.news-card:hover .card-glow {
  opacity: 1;
}

/* Animation d'entrée */
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

.news-card {
  animation: cardAppear 0.6s ease forwards;
}

/* Style pour les cartes vides/loading */
.news-card.skeleton {
  pointer-events: none;
}

.skeleton .card-image-wrapper {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Responsive */
@media (max-width: 768px) {
  .card-image-wrapper {
    height: 180px;
  }
  
  .card-title {
    font-size: 1rem;
  }
  
  .card-summary {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }
  
  .read-more {
    position: static;
    opacity: 1;
    transform: none;
    margin-top: 15px;
    width: fit-content;
  }
}

/* Mode sombre optionnel */
@media (prefers-color-scheme: dark) {
  .news-card {
    background: #1e293b;
  }
  
  .card-content {
    background: #1e293b;
  }
  
  .card-title {
    color: #f1f5f9;
  }
  
  .card-summary {
    color: #cbd5e1;
  }
  
  .card-footer {
    border-top-color: #334155;
  }
  
  .author-name {
    color: #e2e8f0;
  }
  
  .stat-item {
    color: #94a3b8;
  }
}
</style>