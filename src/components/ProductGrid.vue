<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Filtros e Ordenação -->
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center space-x-4 flex-wrap">
        <select :value="selectedCategory" @change="handleCategoryChange"
          class="mt-4 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-50 shadow-sm hover:bg-slate-700 transition-colors duration-200">
          <option value="">Todas as Categorias</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>

        <select v-model="sortBy" @change="handleSort"
          class="mt-4 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-50 shadow-sm hover:bg-slate-700 transition-colors duration-200">
          <option value="">Ordenar por</option>
          <option value="price-asc">Preço: Menor para Maior</option>
          <option value="price-desc">Preço: Maior para Menor</option>
          <option value="name-asc">Nome: A-Z</option>
          <option value="name-desc">Nome: Z-A</option>
        </select>
      </div>
    </div>

    <!-- Grid de Produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <ProductCard v-for="product in products" :key="product.id" :product="product" @add-to-cart="handleAddToCart" />
    </div>

    <!-- Paginação -->
    <div class="mt-12 flex justify-center">
      <div class="flex items-center space-x-2">
        <!-- Botão Anterior -->
        <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" :class="[
          'px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center',
          currentPage === 1
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 shadow-sm hover:shadow-md'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd" />
          </svg>
          Anterior
        </button>

        <!-- Botões de Página -->
        <template v-for="page in displayedPages" :key="page">
          <button v-if="page !== '...'" @click="handlePageChange(page)" :class="[
            'px-5 py-2.5 rounded-xl font-medium transition-all duration-300',
            currentPage === page
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 shadow-sm hover:shadow-md'
          ]">
            {{ page }}
          </button>
          <span v-else class="px-2 text-slate-400">...</span>
        </template>

        <!-- Botão Próximo -->
        <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" :class="[
          'px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center',
          currentPage === totalPages
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 shadow-sm hover:shadow-md'
        ]">
          Próximo
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
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

// Computed property para calcular as páginas a serem exibidas
const displayedPages = computed(() => {
  const pages = []
  const maxVisiblePages = 3

  if (props.totalPages <= maxVisiblePages) {
    // Se o total de páginas for menor ou igual a 3, mostra todas
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Sempre mostra a primeira página
    pages.push(1)

    // Calcula o intervalo de páginas ao redor da página atual
    let start = Math.max(2, props.currentPage - 1)
    let end = Math.min(props.totalPages - 1, props.currentPage + 1)

    // Ajusta o intervalo se estiver muito próximo das extremidades
    if (props.currentPage <= 2) {
      end = 3
    } else if (props.currentPage >= props.totalPages - 1) {
      start = props.totalPages - 2
    }

    // Adiciona reticências se houver páginas ocultas no início
    if (start > 2) {
      pages.push('...')
    }

    // Adiciona as páginas do intervalo
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Adiciona reticências se houver páginas ocultas no final
    if (end < props.totalPages - 1) {
      pages.push('...')
    }

    // Sempre mostra a última página
    pages.push(props.totalPages)
  }

  return pages
})

const handleCategoryChange = (event) => {
  emit('category-change', event.target.value)
}

const handleSort = () => {
  emit('sort', sortBy.value)
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}
</script>