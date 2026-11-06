<template>
<div class="p-2">
    <!-- Alerta de error -->
    <div class="flex items-center gap-3 mb-4 p-3 rounded-xl" :class="themeMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-300'">
        <ion-icon name="warning-outline" class="text-3xl text-danger flex-shrink-0"></ion-icon>
        <div>
            <p class="text-sm" :class="themeMode ? 'text-gray-300' : 'text-gray-700'">
                El establecimiento para despacho <strong>{{ nombreEstablecimiento }}</strong> no puede eliminarse del fichero
                porque tiene documentos de venta asociados que no se encuentran anulados.
            </p>
        </div>
    </div>

    <!-- Tabla de documentos bloqueantes -->
    <p class="font-semibold mb-2 text-sm" :class="themeMode ? 'text-gray-200' : 'text-gray-700'">
        Documentos que impiden la eliminación:
    </p>
    <div style="max-height: 280px; overflow-y: auto;">
        <table class="personal-plantel-table" :class="{ 'night-personal-plantel-table': themeMode }">
            <thead>
                <tr>
                    <th>Código Venta</th>
                    <th>Totalizado</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(venta, vi) in ventasEncontradas" :key="vi">
                    <td>
                        <span class="font-mono text-xs font-bold" :class="themeMode ? 'text-yellow-300' : 'text-blue-700'">
                            {{ venta.ven_codigo }}
                        </span>
                    </td>
                    <td><span class="text-xs">{{ venta.ven_totalizado || '---' }}</span></td>
                </tr>
                <tr v-if="!ventasEncontradas.length">
                    <td colspan="2" class="no-usuarios-text">Sin registros</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="flex justify-end mt-4">
        <vs-button color="primary" type="filled" @click="$emit('close')">
            Entendido
        </vs-button>
    </div>
</div>
</template>

<script>
export default {
    name: 'ValidarEliminarDespacho',
    props: {
        nombreEstablecimiento: {
            type: String,
            default: ''
        },
        ventasEncontradas: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        }
    }
}
</script>

<style scoped>
.personal-plantel-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

.personal-plantel-table th,
.personal-plantel-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: left;
}

.personal-plantel-table th {
    background-color: #f5f5f5;
    font-weight: 600;
}

.night-personal-plantel-table {
    width: 100%;
    border-collapse: collapse;
}

.night-personal-plantel-table th {
    background-color: #1A1F4D;
    text-align: left;
    padding: 10px;
    font-weight: 600;
    color: #ffffff;
    border: 1px solid #2a2f5a;
}

.night-personal-plantel-table td {
    padding: 10px;
    border: 1px solid #2a2f5a;
    color: #e0e0e0;
    vertical-align: top;
}

.no-usuarios-text {
    text-align: center;
    color: #94a3b8;
    font-style: italic;
    padding: 1rem;
}
</style>
