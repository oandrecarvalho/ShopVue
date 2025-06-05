<template>
  <!-- Header fixo com efeito de blur -->
  <header class="fixed top-0 left-0 right-0 bg-slate-900/70 backdrop-blur z-50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo da loja -->
        <router-link to="/" class="text-3xl font-bold tracking-wide text-slate-50">
          ShopVue
        </router-link>

        <!-- Área de busca e carrinho -->
        <div class="flex items-center space-x-6">
          <!-- Campo de busca -->
          <div class="relative">
            <input type="text" v-model="searchQuery" @input="handleSearch" placeholder="Buscar produtos..."
              class="bg-slate-800 text-slate-50 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
          </div>

          <!-- Ícone do carrinho com contador -->
          <div class="relative">
            <button @click="toggleCart" class="text-slate-50 hover:text-blue-500 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <!-- Badge com quantidade de itens -->
            <span v-if="cartItemCount > 0"
              class="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  cartItemCount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['search', 'toggle-cart'])

const searchQuery = ref('')

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const toggleCart = () => {
  emit('toggle-cart')
}
</script>