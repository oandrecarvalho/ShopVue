<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:shadow-none dark:hover:shadow-xl-dark cursor-pointer"
    @click="goToProductDetail">
    <div class="relative pb-48">
      <img :src="product.thumbnail" :alt="product.title" class="absolute h-full w-full object-contain" />
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 dark:text-white">{{ product.title }}</h3>

      <div class="flex items-center justify-between mb-4">
        <span class="text-2xl font-bold text-primary">R$ {{ formatPrice(product.price) }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400">Estoque: {{ product.stock }}</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ product.category }}</span>
        <button @click="addToCart"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors duration-300">
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const router = useRouter()

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const addToCart = () => {
  emit('add-to-cart', props.product)
}

const goToProductDetail = () => {
  router.push({ name: 'product-detail', params: { id: props.product.id } })
}
</script>