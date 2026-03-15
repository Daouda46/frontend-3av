<template>
  <div class="news-detail-page">
    <!-- Loader -->
    <Loader :isLoading="isLoading" />

    <!-- Bouton retour flottant -->
    <button class="btn-back" @click="$router.back()">
      <iconify-icon icon="solar:arrow-left-linear" class="me-2"></iconify-icon>
      <span>Retour</span>
    </button>

    <!-- Contenu principal -->
    <div v-if="news" class="news-container">
      
      <!-- En-tête avec métadonnées -->
      <div class="news-header">
        <div class="header-content">
          <!-- Badges -->
          <div class="news-badges">
            <span class="badge-category" v-if="news.categorie">
              <iconify-icon icon="solar:folder-bold" class="me-1"></iconify-icon>
              {{ news.categorie }}
            </span>
            <span class="badge-date">
              <iconify-icon icon="solar:calendar-bold" class="me-1"></iconify-icon>
              {{ formatDate(news.date) }}
            </span>
          </div>

          <!-- Titre -->
          <h1 class="news-title">{{ news.title }}</h1>

          <!-- Auteur et stats -->
          <div class="news-meta">
            <div class="author-info" v-if="news.author">
              <div class="author-avatar">
                <img :src="news.author.avatar || defaultAvatar" :alt="news.author.name">
              </div>
              <div class="author-details">
                <span class="author-name">{{ news.author.name }}</span>
                <span class="author-role">{{ news.author.role || 'Administrateur' }}</span>
              </div>
            </div>

            <div class="news-stats">
              <div class="stat-item" v-if="news.views">
                <iconify-icon icon="solar:eye-bold"></iconify-icon>
                <span>{{ formatNumber(news.views) }} vues</span>
              </div>
              <button class="stat-item like-btn" :class="{ liked: isLiked }" @click="toggleLike">
                <iconify-icon :icon="isLiked ? 'solar:heart-bold' : 'solar:heart-linear'"></iconify-icon>
                <span>{{ formatNumber(news.likes || 0) }}</span>
              </button>
              <button class="stat-item share-btn" @click="shareNews">
                <iconify-icon icon="solar:share-bold"></iconify-icon>
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Image principale avec overlay -->
      <div class="news-image-container">
        <div class="image-wrapper">
          <img :src="`${file_url}/${news.fichier}`" 
               class="news-image" 
               :alt="news.title"
               @load="imageLoaded = true"
               :class="{ loaded: imageLoaded }">
          <div class="image-overlay"></div>
        </div>
        
        <!-- Légende de l'image (optionnelle) -->
        <p class="image-caption" v-if="news.imageCaption">
          {{ news.imageCaption }}
        </p>
      </div>

      <!-- Contenu de l'article -->
      <div class="news-content-wrapper">
        <div class="news-content">
          <!-- Résumé en avant-première -->
          <div class="news-summary" v-if="news.summary">
            <p>{{ news.summary }}</p>
          </div>

          <!-- Contenu HTML ou texte -->
          <div class="news-body" v-html="formattedContent"></div>

          <!-- Tags -->
          <div class="news-tags" v-if="news.tags && news.tags.length">
            <span class="tags-label">Tags:</span>
            <span v-for="tag in news.tags" :key="tag" class="tag">
              #{{ tag }}
            </span>
          </div>

          <!-- Section réactions -->
          <div class="news-reactions">
            <h3 class="reactions-title">Qu'avez-vous pensé de cet article ?</h3>
            <div class="reaction-buttons">
              <button v-for="reaction in reactions" 
                      :key="reaction.type"
                      class="reaction-btn"
                      :class="{ active: selectedReaction === reaction.type }"
                      @click="selectReaction(reaction.type)">
                <iconify-icon :icon="reaction.icon"></iconify-icon>
                <span>{{ reaction.label }}</span>
              </button>
            </div>
          </div>

          <!-- Navigation entre articles -->
          <div class="news-navigation">
            <button class="nav-btn prev" @click="navigateToPrev" :disabled="!prevNews">
              <iconify-icon icon="solar:arrow-left-linear"></iconify-icon>
              <div class="nav-content">
                <span class="nav-label">Article précédent</span>
                <span class="nav-title">{{ prevNews?.title || 'Aucun' }}</span>
              </div>
            </button>

            <button class="nav-btn next" @click="navigateToNext" :disabled="!nextNews">
              <div class="nav-content">
                <span class="nav-label">Article suivant</span>
                <span class="nav-title">{{ nextNews?.title || 'Aucun' }}</span>
              </div>
              <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
            </button>
          </div>
        </div>

        <!-- Sidebar avec articles suggérés -->
        <aside class="news-sidebar" v-if="suggestedNews.length">
          <h3 class="sidebar-title">
            <iconify-icon icon="solar:stars-bold"></iconify-icon>
            À lire aussi
          </h3>
          <div class="suggested-news">
            <div v-for="suggested in suggestedNews" 
                 :key="suggested.id"
                 class="suggested-item"
                 @click="$router.push({ name: 'news-detail', params: { id: suggested.id } })">
              <img :src="`${file_url}/${suggested.fichier}`" :alt="suggested.title">
              <div class="suggested-content">
                <h4>{{ suggested.title }}</h4>
                <span class="suggested-date">{{ formatDate(suggested.date) }}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="!isLoading" class="error-container">
      <iconify-icon icon="solar:document-text-bold" class="error-icon"></iconify-icon>
      <h2>Actualité non trouvée</h2>
      <p>L'article que vous recherchez n'existe pas ou a été supprimé.</p>
      <button class="btn-home" @click="$router.push({ name: 'actualites' })">
        Voir toutes les actualités
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Loader from '../../../components/Loader.vue'
import { useActualite } from '../../../stores/parametrage/actualite'

const actualiteStore = useActualite()
const route = useRoute()
const router = useRouter()
const isLoading = ref(false)
const imageLoaded = ref(false)
const isLiked = ref(false)
const selectedReaction = ref(null)

// URL des fichiers
const file_url = import.meta.env.VITE_FILE_URL

// Avatar par défaut
const defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=3a7bd5&color=fff'

// Réactions disponibles
const reactions = [
  { type: 'like', icon: 'solar:like-bold', label: 'Utile' },
  { type: 'love', icon: 'solar:heart-bold', label: 'J\'adore' },
  { type: 'insightful', icon: 'solar:bulb-bold', label: 'Pertinent' },
  { type: 'surprising', icon: 'solar:star-bold', label: 'Surprenant' }
]

// Récupérer l'actualité courante
const news = computed(() => {
  return actualiteStore.getterListeActualite?.find(item => item.id == route.params.id)
})

// Articles suggérés (excluant l'article courant)
const suggestedNews = computed(() => {
  if (!news.value) return []
  return actualiteStore.getterListeActualite
    ?.filter(item => item.id != news.value.id)
    ?.slice(0, 3) || []
})

// Article précédent et suivant
const allNews = computed(() => actualiteStore.getterListeActualite || [])
const currentIndex = computed(() => {
  return allNews.value.findIndex(item => item.id == route.params.id)
})

const prevNews = computed(() => {
  if (currentIndex.value > 0) {
    return allNews.value[currentIndex.value - 1]
  }
  return null
})

const nextNews = computed(() => {
  if (currentIndex.value < allNews.value.length - 1) {
    return allNews.value[currentIndex.value + 1]
  }
  return null
})

// Contenu formaté (support HTML)
const formattedContent = computed(() => {
  if (!news.value?.description) return '<p>Contenu détaillé de l\'actualité...</p>'
  
  // Amélioration du contenu avec des classes
  return news.value.description
    .split('\n')
    .map(paragraph => `<p>${paragraph}</p>`)
    .join('')
})

// Formatage de la date
const formatDate = (date) => {
  if (!date) return ''
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('fr-FR', options)
}

// Formatage des nombres
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// Actions
const toggleLike = () => {
  isLiked.value = !isLiked.value
  // Appel API pour liker/unliker
}

const selectReaction = (type) => {
  selectedReaction.value = selectedReaction.value === type ? null : type
  // Appel API pour enregistrer la réaction
}

const shareNews = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: news.value?.title,
        text: news.value?.summary,
        url: window.location.href
      })
    } catch (err) {
      console.log('Partage annulé')
    }
  } else {
    // Fallback : copier le lien
    navigator.clipboard.writeText(window.location.href)
    // Afficher une notification
    alert('Lien copié dans le presse-papier !')
  }
}

const navigateToPrev = () => {
  if (prevNews.value) {
    router.push({ name: 'news-detail', params: { id: prevNews.value.id } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const navigateToNext = () => {
  if (nextNews.value) {
    router.push({ name: 'news-detail', params: { id: nextNews.value.id } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Chargement des données
const loadData = async () => {
  try {
    isLoading.value = true
    await actualiteStore.getListeActualite()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    isLoading.value = false
  }
}

// Recharger quand l'ID change
watch(() => route.params.id, () => {
  if (!actualiteStore.getterListeActualite?.length) {
    loadData()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(loadData)
</script>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  padding: 40px 0;
}

/* Bouton retour */
.btn-back {
  position: fixed;
  top: 100px;
  left: 40px;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: white;
  border: none;
  border-radius: 50px;
  color: #1e293b;
  font-weight: 600;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  transform: translateX(-5px);
  box-shadow: 0 15px 30px -10px rgba(58, 123, 213, 0.3);
  color: #3a7bd5;
}

/* Conteneur principal */
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* En-tête */
.news-header {
  margin-bottom: 40px;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.news-badges {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.badge-category, .badge-date {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
}

.badge-category {
  background: linear-gradient(135deg, #667eea20, #764ba220);
  color: #667eea;
  border: 1px solid #667eea40;
}

.badge-date {
  background: white;
  color: #64748b;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.news-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #1e293b, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Métadonnées */
.news-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 20px 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #667eea;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-weight: 700;
  color: #1e293b;
}

.author-role {
  font-size: 0.85rem;
  color: #64748b;
}

.news-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-item:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.stat-item.liked {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
}

.like-btn, .share-btn {
  background: white;
}

/* Image */
.news-image-container {
  margin: 50px 0;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 40px -20px rgba(0, 0, 0, 0.3);
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition: all 0.8s ease;
}

.news-image.loaded {
  opacity: 1;
  transform: scale(1);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  pointer-events: none;
}

.image-caption {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 15px;
  font-style: italic;
}

/* Contenu principal */
.news-content-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
  margin-top: 50px;
}

.news-content {
  background: white;
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}

.news-summary {
  background: linear-gradient(135deg, #667eea10, #764ba210);
  padding: 25px;
  border-radius: 20px;
  margin-bottom: 30px;
  border-left: 4px solid #667eea;
}

.news-summary p {
  font-size: 1.2rem;
  color: #1e293b;
  font-style: italic;
  margin: 0;
}

.news-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #334155;
}

.news-body :deep(p) {
  margin-bottom: 20px;
}

.news-body :deep(h2) {
  font-size: 1.8rem;
  margin: 40px 0 20px;
  color: #1e293b;
}

.news-body :deep(blockquote) {
  margin: 30px 0;
  padding: 20px 30px;
  background: #f8fafc;
  border-left: 4px solid #667eea;
  border-radius: 10px;
  font-style: italic;
}

/* Tags */
.news-tags {
  margin: 40px 0 30px;
  padding-top: 30px;
  border-top: 1px solid #e2e8f0;
}

.tags-label {
  font-weight: 600;
  color: #1e293b;
  margin-right: 15px;
}

.tag {
  display: inline-block;
  padding: 5px 12px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 50px;
  font-size: 0.85rem;
  margin: 0 5px 5px 0;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #667eea;
  color: white;
}

/* Réactions */
.news-reactions {
  margin: 40px 0;
  padding: 30px;
  background: #f8fafc;
  border-radius: 20px;
  text-align: center;
}

.reactions-title {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 20px;
}

.reaction-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.reaction-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  border: 2px solid #e2e8f0;
  border-radius: 50px;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reaction-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-2px);
}

.reaction-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
  color: white;
}

/* Navigation */
.news-navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid #e2e8f0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 15px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.nav-btn:hover:not(:disabled) {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea10, #764ba210);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.2);
}

.nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-btn.prev {
  text-align: left;
}

.nav-btn.next {
  text-align: right;
  justify-content: flex-end;
}

.nav-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.nav-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 5px;
}

.nav-title {
  font-weight: 600;
  color: #1e293b;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Sidebar */
.news-sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-title {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-title iconify-icon {
  color: #667eea;
}

.suggested-news {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.suggested-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.suggested-item:hover {
  transform: translateX(-5px);
  border-color: #667eea;
  box-shadow: 0 10px 20px -10px rgba(102, 126, 234, 0.2);
}

.suggested-item img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
}

.suggested-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.suggested-content h4 {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.suggested-date {
  font-size: 0.8rem;
  color: #64748b;
}

/* Message d'erreur */
.error-container {
  text-align: center;
  padding: 100px 20px;
  max-width: 500px;
  margin: 0 auto;
}

.error-icon {
  font-size: 5rem;
  color: #667eea;
  margin-bottom: 30px;
  opacity: 0.5;
}

.error-container h2 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 15px;
}

.error-container p {
  color: #64748b;
  margin-bottom: 30px;
}

.btn-home {
  padding: 15px 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  border-radius: 50px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px -5px rgba(102, 126, 234, 0.4);
}

.btn-home:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 30px -10px rgba(102, 126, 234, 0.6);
}

/* Responsive */
@media (max-width: 992px) {
  .news-content-wrapper {
    grid-template-columns: 1fr;
  }
  
  .news-sidebar {
    position: static;
  }
  
  .news-title {
    font-size: 2.5rem;
  }
  
  .btn-back {
    top: 20px;
    left: 20px;
  }
}

@media (max-width: 768px) {
  .news-meta {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .news-stats {
    width: 100%;
    justify-content: space-around;
  }
  
  .news-title {
    font-size: 2rem;
  }
  
  .image-wrapper {
    height: 300px;
  }
  
  .news-content {
    padding: 25px;
  }
  
  .news-navigation {
    grid-template-columns: 1fr;
  }
  
  .reaction-buttons {
    flex-direction: column;
  }
  
  .reaction-btn {
    width: 100%;
    justify-content: center;
  }
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.news-header,
.news-image-container,
.news-content {
  animation: fadeIn 0.6s ease forwards;
}

.news-content {
  animation-delay: 0.2s;
}
</style>