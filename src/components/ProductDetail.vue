<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-800 dark:shadow-none">
      <div class="md:flex">
        <!-- Galeria de Imagens -->
        <div class="md:w-1/2">
          <div class="relative pb-[100%]">
            <img :src="product.thumbnail" :alt="product.title" class="absolute h-full w-full object-cover" />
          </div>
          <div class="grid grid-cols-4 gap-2 p-4">
            <div v-for="(image, index) in product.images" :key="index"
              class="relative pb-[100%] cursor-pointer hover:opacity-75" @click="selectedImage = image">
              <img :src="image" :alt="'Imagem ' + (index + 1)" class="absolute h-full w-full object-cover rounded" />
            </div>
          </div>
        </div>

        <!-- Informações do Produto -->
        <div class="md:w-1/2 p-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-4 dark:text-white">{{ product.title }}</h1>

          <div class="flex items-center mb-4">
            <span class="text-3xl font-bold text-primary">R$ {{ formatPrice(product.price) }}</span>
            <span class="ml-4 text-sm text-gray-500 dark:text-gray-400">Estoque: {{ product.stock }}</span>
          </div>

          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2 dark:text-white">Descrição</h2>
            <p class="text-gray-600 dark:text-gray-400">{{ product.description }}</p>
          </div>

          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2 dark:text-white">Categoria</h2>
            <span
              class="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {{ product.category }}
            </span>
          </div>

          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-2 dark:text-white">Marca</h2>
            <span class="text-gray-600 dark:text-gray-400">{{ product.brand }}</span>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <label for="quantity" class="mr-2 text-gray-600 dark:text-gray-400">Quantidade:</label>
              <input type="number" id="quantity" v-model="quantity" min="1" :max="product.stock"
                class="w-20 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <button @click="addToCart"
              class="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors duration-300">
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-cart'])

const selectedImage = ref(props.product.thumbnail)
const quantity = ref(1)

const formatPrice = (price) => {
  return price.toFixed(2).replace('.', ',')
}

const addToCart = () => {
  emit('add-to-cart', {
    ...props.product,
    quantity: quantity.value
  })
}

// Mapeamento simples de categorias para tradução
const categoryMapping = {
  'smartphones': 'Smartphones',
  'laptops': 'Notebooks',
  'fragrances': 'Perfumes',
  'skincare': 'Cuidados com a Pele',
  'groceries': 'Mercearia',
  'home-decoration': 'Decoração',
  'furniture': 'Móveis',
  'tops': 'Blusas',
  'womens-dresses': 'Vestidos',
  'womens-shoes': 'Calçados Femininos',
  'mens-shirts': 'Camisetas Masculinas',
  'mens-shoes': 'Calçados Masculinos',
  'mens-watches': 'Relógios Masculinos',
  'womens-watches': 'Relógios Femininos',
  'womens-bags': 'Bolsas',
  'womens-jewellery': 'Jóias',
  'sunglasses': 'Óculos de Sol',
  'automotive': 'Automotivo',
  'motorcycle': 'Motocicletas',
  'lighting': 'Iluminação',
  'beauty': 'Beleza',
  'kitchen-accessories': 'Acessórios de Cozinha',
  'mobile-accessories': 'Acessórios para Celular',
  'skin-care': 'Cuidados com a Pele', // Já existe, mas garantindo
  'sports-accessories': 'Acessórios Esportivos',
  'tablets': 'Tablets',
  'vehicle': 'Veículos',
}

// Propriedade computada para obter a categoria traduzida
const translatedCategory = computed(() => {
  const categorySlug = props.product.category; // A API dummyjson retorna o slug
  return categoryMapping[categorySlug] || categorySlug.replace(/-/g, ' '); // Retorna tradução ou formata slug
})
</script>