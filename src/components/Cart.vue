<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50" v-if="isOpen">
        <div class="relative top-20 mx-auto p-6 w-[400px] shadow-2xl rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700">
            <div class="flex justify-between items-center mb-8">
                <div class="flex items-center space-x-3">
                    <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2 class="text-2xl font-bold text-slate-50">Carrinho</h2>
                </div>
                <div class="flex items-center space-x-2">
                    <button v-if="items.length > 0" @click="clearCart" 
                        class="text-slate-400 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-slate-700/50">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button @click="closeCart" class="text-slate-400 hover:text-slate-50 transition-colors duration-300">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <div v-if="items.length === 0" class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p class="text-slate-400 text-lg">Seu carrinho está vazio</p>
            </div>

            <div v-else>
                <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <div v-for="item in items" :key="item.id"
                        class="flex items-center space-x-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                        <img :src="item.thumbnail" :alt="item.title"
                            class="w-24 h-24 object-contain rounded-lg bg-slate-900 p-2 border border-slate-700" />
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-slate-50 line-clamp-2">{{ item.title }}</h3>
                            <p class="text-sm text-blue-400 font-medium mt-1">R$ {{ formatPrice(item.price) }}</p>
                            <div class="flex items-center space-x-2 mt-3">
                                <button @click="updateQuantity(item, -1)"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-slate-50 transition-all duration-300 border border-slate-700">
                                    -
                                </button>
                                <span class="text-slate-300 font-medium w-8 text-center">{{ item.quantity }}</span>
                                <button @click="updateQuantity(item, 1)"
                                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-slate-50 transition-all duration-300 border border-slate-700">
                                    +
                                </button>
                                <button @click="removeItem(item)"
                                    class="ml-4 text-sm text-red-400 hover:text-red-300 transition-colors duration-300 flex items-center">
                                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 border-t border-slate-700 pt-6">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-lg font-semibold text-slate-50">Total:</span>
                        <span class="text-2xl font-bold text-blue-500">R$ {{ formatPrice(total) }}</span>
                    </div>
                    <button @click="checkout"
                        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/20 font-medium flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Finalizar Compra</span>
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

const emit = defineEmits(['close', 'update-quantity', 'remove-item', 'checkout', 'clear-cart'])

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

const clearCart = () => {
    emit('clear-cart')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>