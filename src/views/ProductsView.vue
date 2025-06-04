<template>
  <div>
    <!-- Botão Voltar para Home (visível quando uma categoria está selecionada ou há busca) -->
    <div v-if="selectedCategory || route.query.q" class="container mx-auto px-4 py-4">
      <button @click="goToHome" class="text-primary hover:underline flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd" />
        </svg>
        Voltar para Todos os Produtos
      </button>
    </div>

    <ProductGrid :products="products" :categories="formattedCategories" :current-page="currentPage"
      :total-pages="totalPages" :selected-category="selectedCategory" @category-change="handleCategoryChange"
      @sort="handleSort" @page-change="handlePageChange" @add-to-cart="handleAddToCart" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import ProductGrid from '../components/ProductGrid.vue'

const emit = defineEmits(['add-to-cart'])
const route = useRoute()
const router = useRouter()

const products = ref([])
const categories = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const selectedCategory = ref('')
const sortBy = ref('')

// Computed property para formatar as categorias
const formattedCategories = computed(() => {
  return categories.value.map(category => ({
    value: category.slug,
    label: category.name.charAt(0).toUpperCase() + category.name.slice(1).replace(/-/g, ' ')
  }))
})

// Carregar categorias
const loadCategories = async () => {
  try {
    const response = await axios.get('https://dummyjson.com/products/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
}

// Carregar produtos
const loadProducts = async () => {
  try {
    const params = new URLSearchParams()
    params.append('limit', 12)

    let url = 'https://dummyjson.com/products'

    // Lógica mais direta para determinar o endpoint
    if (selectedCategory.value) {
      url = `https://dummyjson.com/products/category/${selectedCategory.value}`
      // Na busca por categoria, a paginação pode ser diferente ou não existir da mesma forma que a listagem geral na API DummyJSON.
      // Para simplificar, na busca por categoria, vamos carregar todos os produtos da categoria (se a API suportar sem limite, ou um limite alto)
      // ou manter a paginação, mas com a ressalva que pode não ser 100% precisa dependendo da API real.
      // Mantendo a paginação por enquanto para não remover a funcionalidade, mas simplificando a lógica de URL/params.
      params.append('skip', (currentPage.value - 1) * 12)
    } else if (route.query.q) {
      url = 'https://dummyjson.com/products/search'
      params.append('q', route.query.q)
      // Na busca geral, a API DummyJSON lida com paginação de forma diferente.
      // Para simplificar, na busca geral, não vamos usar paginação avançada aqui, apenas carregar os resultados da primeira página.
      params.delete('limit')
      params.delete('skip')
    } else {
      // Listagem geral com paginação
      params.append('skip', (currentPage.value - 1) * 12)
    }

    const response = await axios.get(`${url}?${params.toString()}`)

    products.value = response.data.products

    // Lógica mais direta para calcular totalPages baseado no endpoint chamado
    if (route.query.q) {
      // Na busca geral simplificada, consideramos 1 página
      totalPages.value = 1;
    } else {
      // Para listagem geral ou por categoria (com paginação mantida), calculamos normalmente
      totalPages.value = Math.ceil(response.data.total / 12)
    }

  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    // Em caso de erro, limpar produtos para indicar que não foi possível carregar
    products.value = []
    totalPages.value = 0
  }
}

// Observar mudanças na categoria
watch(selectedCategory, () => {
  currentPage.value = 1
  loadProducts()
})

// Observar mudanças na busca por rota
watch(
  () => route.query.q,
  (newSearchTerm, oldSearchTerm) => {
    // Apenas recarregar produtos se o termo de busca realmente mudou
    if (newSearchTerm !== oldSearchTerm) {
      currentPage.value = 1;
      loadProducts();
    }
  }
)

// Observar mudanças na ordenação
watch(sortBy, () => {
  if (sortBy.value) {
    const [field, order] = sortBy.value.split('-')
    products.value.sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1
      } else {
        return a[field] < b[field] ? 1 : -1
      }
    })
  }
})

const handleCategoryChange = (category) => {
  selectedCategory.value = category
}

const handleSort = (sort) => {
  sortBy.value = sort
}

const handlePageChange = (page) => {
  currentPage.value = page
  loadProducts()
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

const goToHome = () => {
  router.push('/')
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>