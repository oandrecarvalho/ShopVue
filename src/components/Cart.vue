<template>
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" v-if="isOpen">
        <div
            class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 dark:border-gray-700">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Carrinho de Compras</h2>
                <button @click="closeCart"
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="items.length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">Seu carrinho está vazio</p>
            </div>

            <div v-else>
                <div class="space-y-4">
                    <div v-for="item in items" :key="item.id" class="flex items-center space-x-4">
                        <img :src="item.thumbnail" :alt="item.title" class="w-20 h-20 object-cover rounded" />
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-gray-900 dark:text-white">{{ item.title }}</h3>
                            <p class="text-sm text-gray-500 dark:text-gray-400">R$ {{ formatPrice(item.price) }}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <button @click="updateQuantity(item, -1)"
                                    class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                                    -
                                </button>
                                <span class="text-gray-700 dark:text-gray-300">{{ item.quantity }}</span>
                                <button @click="updateQuantity(item, 1)"
                                    class="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary">
                                    +
                                </button>
                                <button @click="removeItem(item)"
                                    class="ml-4 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600">
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 border-t pt-4 dark:border-gray-700">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-lg font-semibold dark:text-white">Total:</span>
                        <span class="text-xl font-bold text-primary">R$ {{ formatPrice(total) }}</span>
                    </div>
                    <button @click="checkout"
                        class="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors duration-300">
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    items: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'checkout'])

const total = computed(() => {
    return props.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const formatPrice = (price) => {
    return price.toFixed(2).replace('.', ',')
}

const closeCart = () => {
    emit('close')
}

const updateQuantity = (item, change) => {
    const newQuantity = item.quantity + change
    if (newQuantity > 0 && newQuantity <= item.stock) {
        emit('update-quantity', { ...item, quantity: newQuantity })
    }
}

const removeItem = (item) => {
    emit('remove-item', item)
}

const checkout = () => {
    emit('checkout')
}
</script>