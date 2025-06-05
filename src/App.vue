<template>
  <div class="min-h-screen bg-slate-900">
    <Navbar @search="handleSearch" @toggle-cart="toggleCart" :cart-item-count="cartItemCount" />

    <main class="container mx-auto px-4 py-8 pt-16">
      <router-view @add-to-cart="addToCart"></router-view>
    </main>

    <Cart :is-open="isCartOpen" :items="cartItems" @close="isCartOpen = false" @update-quantity="updateCartItemQuantity"
      @remove-item="removeCartItem" @checkout="handleCheckout" @clear-cart="clearCart" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Cart from './components/Cart.vue'
import Swal from 'sweetalert2'

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
      Swal.fire({
        title: 'Quantidade atualizada!',
        text: `A quantidade de ${product.title} foi atualizada no carrinho.`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      })
    }
  } else {
    // Se o item não existe, adiciona ao carrinho
    cartItems.value.push({
      ...product,
      quantity: product.quantity || 1
    })
    Swal.fire({
      title: 'Item adicionado!',
      text: `${product.title} foi adicionado ao carrinho.`,
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6'
    })
  }

  saveCart()
}

const updateCartItemQuantity = (item) => {
  const index = cartItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    cartItems.value[index] = item
    saveCart()
  }
}

const removeCartItem = (item) => {
  Swal.fire({
    title: 'Remover item?',
    text: `Deseja remover ${item.title} do carrinho?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444', // red-500
    cancelButtonColor: '#6b7280', // gray-500
    confirmButtonText: 'Sim, remover',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      cartItems.value = cartItems.value.filter(i => i.id !== item.id)
      saveCart()
      Swal.fire({
        title: 'Item removido!',
        text: `${item.title} foi removido do carrinho.`,
        icon: 'success',
        confirmButtonColor: '#3085d6'
      })
    }
  })
}

const handleCheckout = () => {
  // Implementar lógica de checkout
  Swal.fire({
    title: 'Em desenvolvimento!',
    text: 'Funcionalidade de checkout em desenvolvimento!',
    icon: 'info',
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6'
  })
}

const clearCart = () => {
  Swal.fire({
    title: 'Esvaziar carrinho?',
    text: 'Tem certeza que deseja remover todos os itens do carrinho?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sim, esvaziar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      cartItems.value = []
      saveCart()
      Swal.fire({
        title: 'Carrinho esvaziado!',
        text: 'Todos os itens foram removidos do carrinho.',
        icon: 'success',
        confirmButtonColor: '#3085d6'
      })
    }
  })
}
</script>

<style>
.swal2-popup {
  background-color: rgb(15 23 42) !important; /* bg-slate-900 */
  color: white !important;
}

.swal2-title {
  color: white !important;
}

.swal2-html-container {
  color: #e2e8f0 !important; /* text-slate-200 */
}

.swal2-confirm {
  background-color: #3b82f6 !important; /* bg-blue-500 */
}

.swal2-confirm:hover {
  background-color: #2563eb !important; /* bg-blue-600 */
}
</style>
