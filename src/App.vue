<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Navbar @search="handleSearch" @toggle-cart="toggleCart" :cart-item-count="cartItemCount" />

    <main class="container mx-auto px-4 py-8">
      <router-view @add-to-cart="addToCart"></router-view>
    </main>

    <Cart :is-open="isCartOpen" :items="cartItems" @close="isCartOpen = false" @update-quantity="updateCartItemQuantity"
      @remove-item="removeCartItem" @checkout="handleCheckout" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Cart from './components/Cart.vue'

const router = useRouter()
const isCartOpen = ref(false)
const cartItems = ref([])

// Computed property para calcular o total de itens no carrinho
const cartItemCount = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// Carregar itens do carrinho do localStorage
onMounted(() => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
})

// Salvar carrinho no localStorage sempre que houver mudanças
const saveCart = () => {
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const handleSearch = (query) => {
  router.push({ name: 'products', query: { q: query } })
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}

const addToCart = (product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)

  if (existingItem) {
    // Se o item já existe, aumenta a quantidade
    const newQuantity = existingItem.quantity + (product.quantity || 1)
    if (newQuantity <= product.stock) {
      existingItem.quantity = newQuantity
    }
  } else {
    // Se o item não existe, adiciona ao carrinho
    cartItems.value.push({
      ...product,
      quantity: product.quantity || 1
    })
  }

  saveCart()
  isCartOpen.value = true // Abre o carrinho ao adicionar um item
}

const updateCartItemQuantity = (item) => {
  const index = cartItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    cartItems.value[index] = item
    saveCart()
  }
}

const removeCartItem = (item) => {
  cartItems.value = cartItems.value.filter(i => i.id !== item.id)
  saveCart()
}

const handleCheckout = () => {
  // Implementar lógica de checkout
  alert('Funcionalidade de checkout em desenvolvimento!')
}
</script>
