<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Filtros e Ordenação -->
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-4">
        <select :value="selectedCategory" @change="handleCategoryChange"
          class="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">Todas as Categorias</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>

        <select v-model="sortBy" @change="handleSort"
          class="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">Ordenar por</option>
          <option value="price-asc">Preço: Menor para Maior</option>
          <option value="price-desc">Preço: Maior para Menor</option>
          <option value="name-asc">Nome: A-Z</option>
          <option value="name-desc">Nome: Z-A</option>
        </select>
      </div>
    </div>

    <!-- Grid de Produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="handleAddToCart" />
    </div>

    <!-- Paginação -->
    <div class="mt-8 flex justify-center">
      <div class="flex space-x-2">
        <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" :class="[
          'px-4 py-2 rounded-lg',
          currentPage === page
            ? 'bg-primary text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
        ]">
          {{ page }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
  products: {
    type: Array,
    required: true
  },
  categories: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  selectedCategory: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['category-change', 'sort', 'page-change', 'add-to-cart'])

const sortBy = ref('')

const handleCategoryChange = () => {
  emit('category-change', props.selectedCategory)
}

const handleSort = () => {
  emit('sort', sortBy.value)
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}
</script>