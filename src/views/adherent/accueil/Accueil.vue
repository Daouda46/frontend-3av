<template>
  <div>
     <Loader :isLoading="isLoading" />
    <NewsCarousel :slides="actualiteStore.getterListeActualite" />
    
    <div class="container my-5">
      <h2 class="mb-4">Dernières actualités</h2>
      <div class="row">
        <NewsCard 
          v-for="news in actualiteStore.getterListeActualite" 
          :key="news.id" 
          :news="news" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted  } from 'vue'
import NewsCarousel from './NewsCarousel.vue'
import NewsCard from './NewsCard.vue'
import Loader from '../../../components/Loader.vue'
import { useActualite } from '../../../stores/parametrage/actualite'

const actualiteStore = useActualite()
const isLoading = ref(false)
const featuredNews = ref([
  {
    fichier: 'https://cdn.pixabay.com/photo/2024/09/21/15/07/eiffel-tower-9064240_1280.jpg',
    title: 'Titre featured 1',
    description: 'Description...'
  },
  {
    fichier: 'https://cdn.pixabay.com/photo/2025/03/02/20/32/houses-9442768_1280.jpg',
    title: 'Titre featured 2',
    description: 'Description...'
  }
])

const newsList = ref([
  {
    id: 1,
    image: 'https://cdn.pixabay.com/photo/2024/05/22/21/51/dog-8781844_1280.jpg',
    title: 'Actualité 1',
    summary: 'Résumé...',
    date: 'il y a 2 heures'
  },
  {
    id: 2,
    image: 'https://cdn.pixabay.com/photo/2025/03/02/20/32/houses-9442768_1280.jpg',
    title: 'Actualité 2',
    summary: 'Résumé...',
    date: 'il y a 5 heures'
  }
  // Ajoutez plus d'actualités
])
onMounted(async () => {
  try {
    isLoading.value = true
    await actualiteStore.getListeActualite()
  } catch (error) {
    console.error('Erreur lors du chargement des fonctions:', error)
  } finally {
    isLoading.value = false
  }
})
</script>