<template>
  <div class="bg-slate-800 rounded-xl shadow-sm overflow-hidden hover:scale-105 transition-transform">
    <router-link :to="'/product/' + product.id" class="block">
      <img :src="product.thumbnail" :alt="product.title" class="w-full h-48 object-contain bg-slate-900/50" />
      <div class="p-4">
        <h3 class="text-lg font-medium text-slate-50 mb-2 line-clamp-2">{{ product.title }}</h3>
        <p class="text-blue-500 font-bold text-xl mb-4">R$ {{ formatPrice(product.price) }}</p>
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-400">Estoque: {{ product.stock }}</span>
          <button @click.prevent="handleAddToCart"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-sm">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const handleAddToCart = () => {
  emit('add-to-cart', props.product)
}
</script>