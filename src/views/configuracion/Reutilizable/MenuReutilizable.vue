<template>
<div>
    <nav class="breadcrumbs mt-3">
        <!-- <span
            v-for="(menu, index) in menus"
            :key="index"
            :class="['breadcrumbs__item', 'btnMenu', { active: filtro === index }]"
            :style="{ '--item-index': index }"
            @click="cambiarFiltro(index)"
            tabindex="0"
            @keydown.enter="cambiarFiltro(index)"
            @keydown.space.prevent="cambiarFiltro(index)"
        >
            <span class="px-1">{{ menu }}</span>
        </span> -->
        <span
          v-for="(menu, index) in menus"
          :key="index"
          v-show="menu.visible"
          :class="['breadcrumbs__item', 'btnMenu', { active: filtro === index }]"
          :style="{ '--item-index': index }"
          @click="cambiarFiltro(index)"
        >
          <span class="px-1">{{ menu.label }}</span>
        </span>


    </nav>
</div>
</template>

<script>
export default {
    props: {
        menus: {
            type: Array,
            required: true,
        },
        fondo: {
            type: String,
            default: 'red',
        },
    },
    data() {
        return {
            filtro: 0,
        };
    },
    mounted() {
        if (localStorage.getItem('menuIndex')) {
            const menuIndex = parseInt(localStorage.getItem('menuIndex'));
            this.filtro = menuIndex;
            this.$emit('filtro-cambiado', menuIndex);
        }
    },
    methods: {
        cambiarFiltro(index) {
            this.filtro = index;
            localStorage.setItem('menuIndex', index);
            this.$emit('filtro-cambiado', index);
        },
    },
};
</script>

<style scoped>
.breadcrumbs {
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
    gap: 0;
    scroll-snap-type: x mandatory;
}

.breadcrumbs__item {
    position: relative;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
    color: #475569;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    clip-path: polygon(
        0px 0px,
        calc(100% - 15px) 0px,
        100% 50%,
        calc(100% - 15px) 100%,
        0px 100%,
        15px 50%
    );
    margin-right: -8px;
    z-index: 1;
    font-size: 0.95rem;
    scroll-snap-align: start;
    margin-top: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    letter-spacing: 0.025em;
}

.breadcrumbs__item:first-child {
    clip-path: polygon(
        0px 0px,
        calc(100% - 15px) 0px,
        100% 50%,
        calc(100% - 15px) 100%,
        0px 100%,
        15px 50%
    );
}

.breadcrumbs__item:last-child {
    clip-path: polygon(
        0px 0px,
        calc(100% - 15px) 0px,
        100% 50%,
        calc(100% - 15px) 100%,
        0px 100%,
        15px 50%
    );
}

/* Hover */
.breadcrumbs__item:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    z-index: 2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Activo */
.breadcrumbs__item.active {
    background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    color: white;
    z-index: 3;
    box-shadow: 0 4px 16px rgba(30, 64, 175, 0.5);
    transform: translateY(-1px);
}

/* Estados de foco para accesibilidad */
.breadcrumbs__item:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
}

/* Responsive: más margen arriba en móviles */
@media (max-width: 768px) {
    .breadcrumbs {
        margin-top: 1.5rem;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none; /* Firefox */
    }

    .breadcrumbs::-webkit-scrollbar {
        display: none; /* Chrome */
    }

    .breadcrumbs__item {
        clip-path: polygon(
            0px 0px,
            calc(100% - 15px) 0px,
            100% 50%,
            calc(100% - 15px) 100%,
            0px 100%,
            15px 50%
        );
        margin-right: -10px;
        white-space: nowrap;
        flex: 0 0 auto;
        padding: 0.6rem 1.2rem;
        font-size: 0.9rem;
        min-width: fit-content;
    }
}

@media (max-width: 480px) {
    .breadcrumbs {
        margin-top: 1rem;
    }

    .breadcrumbs__item {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
        margin-right: -12px;
    }
}

@media (min-width: 769px) and (max-width: 1024px) {
    .breadcrumbs__item {
        padding: 0.7rem 1.3rem;
        font-size: 0.92rem;
    }
}

/* Animación suave al cargar */
@keyframes fadeInSlide {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.breadcrumbs {
    animation: fadeInSlide 0.5s ease-out;
}

.breadcrumbs__item {
    animation: fadeInSlide 0.3s ease-out;
    animation-delay: calc(var(--item-index, 0) * 0.1s);
}

/* Tema oscuro */
@media (prefers-color-scheme: dark) {
    .breadcrumbs__item {
        background: linear-gradient(135deg, #334155 0%, #475569 100%);
        color: #e2e8f0;
    }

    .breadcrumbs__item:hover {
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    .breadcrumbs__item.active {
        background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
    }
}

</style>
