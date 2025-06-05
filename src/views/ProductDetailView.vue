<template>
  <div class="min-h-screen bg-slate-900 py-8">
    <div class="container mx-auto px-4">
      <div v-if="loading" class="flex justify-center items-center min-h-[60vh]">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else-if="product" class="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
        <button @click="goBack"
          class="flex items-center text-blue-500 hover:text-blue-400 transition-colors duration-200 px-6 pt-2 pb-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
          Voltar
        </button>
        <ProductDetail :product="product" @add-to-cart="handleAddToCart" class="mt-2" />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-slate-400 text-lg">Produto não encontrado</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductDetail from '../components/ProductDetail.vue'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)
const error = ref(null)

const emit = defineEmits(['add-to-cart'])

const loadProduct = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get(`https://dummyjson.com/products/${route.params.id}`)
    product.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar o produto. Por favor, tente novamente.'
    console.error('Erro ao carregar produto:', err)
  } finally {
    loading.value = false
  }
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadProduct()
})
</script>