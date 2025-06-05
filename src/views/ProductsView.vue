<template>
  <div>
    <!-- Botão Voltar para Home (visível quando uma categoria está selecionada ou há busca) -->
    <div v-if="selectedCategory || route.query.q" class="container px-4 pt-4 mx-auto">
      <button @click="goToHome"
        class="flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
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
      // Quando filtra por categoria, a paginação geralmente não é aplicada pela API da mesma forma.
      // Remover parâmetros de paginação para carregar todos os produtos da categoria.
      params.delete('limit')
      params.delete('skip')
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

    // Filtrar produtos para remover null/undefined e garantir propriedades essenciais
    products.value = response.data.products.filter(product =>
      product !== null &&
      product !== undefined &&
      typeof product === 'object' &&
      product.id !== undefined && // Verifica propriedades essenciais
      product.title !== undefined &&
      product.price !== undefined &&
      product.stock !== undefined
    );

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
    const [field, order] = sortBy.value.split('-');
    products.value.sort((a, b) => {
      // Adicionar verificações para garantir que a e b são objetos válidos
      if (!a || !b) {
        return 0; // Ou lógica para colocar null/undefined no fim, se preferir
      }

      let comparison = 0;

      if (field === 'price' || field === 'stock') {
        // Comparação numérica para preço e estoque, verificando se as propriedades existem
        const valueA = a[field] !== undefined && a[field] !== null ? a[field] : (order === 'asc' ? Infinity : -Infinity); // Trata undefined/null numericamente
        const valueB = b[field] !== undefined && b[field] !== null ? b[field] : (order === 'asc' ? Infinity : -Infinity); // Trata undefined/null numericamente
        comparison = valueA - valueB;

      } else if (field === 'name') {
        // Comparação de string para nome (usando o campo 'title'), verificando se a propriedade existe
        const nameA = a.title ? String(a.title).toUpperCase() : ''; // Trata undefined/null/non-string
        const nameB = b.title ? String(b.title).toUpperCase() : ''; // Trata undefined/null/non-string

        if (nameA < nameB) {
          comparison = -1;
        } else if (nameA > nameB) {
          comparison = 1;
        }
      } else {
        // Fallback para comparação de string em outros campos desconhecidos, com verificações
        const valueA = a[field] ? String(a[field]).toUpperCase() : '';
        const valueB = b[field] ? String(b[field]).toUpperCase() : '';

        if (valueA < valueB) {
          comparison = -1;
        } else if (valueA > valueB) {
          comparison = 1;
        }
      }

      if (order === 'desc') {
        return comparison * -1; // Inverter o resultado para ordem decrescente
      } else {
        return comparison; // Manter o resultado para ordem crescente
      }
    });
  }
})

const handleCategoryChange = (category) => {
  console.log('Categoria selecionada:', category);
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
  selectedCategory.value = '';
  router.push({ name: 'products', query: {} });
}

onMounted(() => {
  loadCategories()
  loadProducts()
})
</script>