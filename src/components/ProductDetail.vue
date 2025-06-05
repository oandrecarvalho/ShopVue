<template>
  <div class="container mx-auto px-6">
    <div class="bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div class="md:flex">
        <!-- Galeria de Imagens -->
        <div class="md:w-1/2 rounded-bl-2xl">
          <div class="relative pb-[100%] bg-slate-900 rounded-2xl overflow-hidden">
            <img :src="selectedImage" :alt="product.title" class="absolute h-full w-full object-contain p-8" />
          </div>
          <div class="grid grid-cols-4 gap-3 p-6">
            <div v-for="(image, index) in product.images" :key="index"
              class="relative pb-[100%] cursor-pointer rounded-xl overflow-hidden bg-slate-900 p-2 hover:opacity-75 transition-opacity duration-300"
              @click="selectedImage = image">
              <img :src="image" :alt="'Imagem ' + (index + 1)" class="absolute h-full w-full object-contain" />
            </div>
          </div>
        </div>

        <!-- Informações do Produto -->
        <div class="md:w-1/2 p-8 rounded-br-2xl">
          <h1 class="text-3xl font-bold text-slate-50 mb-6">{{ product.title }}</h1>

          <div class="flex items-center mb-6">
            <span class="text-3xl font-bold text-blue-500">R$ {{ formatPrice(product.price) }}</span>
            <span class="ml-4 text-sm text-slate-400 bg-slate-900 px-3 py-1 rounded-full">Estoque: {{ product.stock
            }}</span>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold mb-3 text-slate-50">Descrição</h2>
            <p class="text-slate-300 leading-relaxed">{{ product.description }}</p>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold mb-3 text-slate-50">Categoria</h2>
            <span
              class="inline-block bg-slate-900 rounded-full px-4 py-2 text-sm font-medium text-slate-300 border border-slate-700">
              {{ translatedCategory }}
            </span>
          </div>

          <div class="mb-8">
            <h2 class="text-lg font-semibold mb-3 text-slate-50">Marca</h2>
            <span class="text-slate-300">{{ product.brand }}</span>
          </div>

          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <label for="quantity" class="mr-2 text-slate-300">Quantidade:</label>
              <input type="number" id="quantity" v-model="quantity" min="1" :max="product.stock"
                class="w-20 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900 text-slate-50" />
            </div>
            <button @click="addToCart"
              class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg font-medium">
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
  if (quantity.value > 0 && quantity.value <= props.product.stock) {
    emit('add-to-cart', {
      ...props.product,
      quantity: quantity.value
    })
  }
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