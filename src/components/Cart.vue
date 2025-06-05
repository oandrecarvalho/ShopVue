<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50" v-if="isOpen">
        <div class="relative top-20 mx-auto p-6 w-96 shadow-2xl rounded-2xl bg-slate-800">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-slate-50">Carrinho de Compras</h2>
                <button @click="closeCart" class="text-slate-400 hover:text-slate-50 transition-colors duration-300">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div v-if="items.length === 0" class="text-center py-8">
                <p class="text-slate-400">Seu carrinho está vazio</p>
            </div>

            <div v-else>
                <div class="space-y-4">
                    <div v-for="item in items" :key="item.id"
                        class="flex items-center space-x-4 p-3 rounded-xl bg-slate-700">
                        <img :src="item.thumbnail" :alt="item.title"
                            class="w-20 h-20 object-contain rounded-lg bg-slate-900 p-2" />
                        <div class="flex-1">
                            <h3 class="text-sm font-medium text-slate-50">{{ item.title }}</h3>
                            <p class="text-sm text-slate-400">R$ {{ formatPrice(item.price) }}</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <button @click="updateQuantity(item, -1)"
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-colors duration-300">
                                    -
                                </button>
                                <span class="text-slate-300 font-medium">{{ item.quantity }}</span>
                                <button @click="updateQuantity(item, 1)"
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-600 hover:text-slate-50 transition-colors duration-300">
                                    +
                                </button>
                                <button @click="removeItem(item)"
                                    class="ml-4 text-sm text-red-400 hover:text-red-500 transition-colors duration-300">
                                    Remover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 border-t border-slate-700 pt-6">
                    <div class="flex justify-between items-center mb-6">
                        <span class="text-lg font-semibold text-slate-50">Total:</span>
                        <span class="text-2xl font-bold text-blue-500">R$ {{ formatPrice(total) }}</span>
                    </div>
                    <button @click="checkout"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors shadow-md hover:shadow-lg font-medium">
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