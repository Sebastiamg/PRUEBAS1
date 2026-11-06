<template>
  <div class="cards-globales-container" v-if="cant_certificados > 0"> 
    <!-- Card de Certificados -->
    <vx-card class="card-global">
      <div class="card-certificados" @click="irCertificados()">
        <div class="card-header">
          <h3>Certificados</h3>
        </div>
        <div class="card-body">
          <vs-icon icon="emoji_events" size="50px" color="#FFC107"></vs-icon>
          <p class="contador">{{cant_certificados}}</p>
        </div>
      </div>
    </vx-card>

    <!-- Card de Capacitaciones -->
    <vx-card class="card-global card-global--clickable" v-if="usuario.capacitador == 1">
      <div class="card-capacitaciones" @click="irCapacitaciones">
        <div class="card-header card-header--capacitaciones">
          <h3>Capacitaciones</h3>
        </div>
        <div class="card-body">
          <vs-icon icon="school" size="50px" color="#10B981"></vs-icon>
          <p class="contador contador--capacitaciones">Entrar</p>
        </div>
      </div>
    </vx-card>
  </div>
</template>
<script>
export default {
  name: 'HomeGlobales',
  data() {
    return {
      usuario: [],
      cant_certificados: 0,
    }
  },
  created() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.verificarEncuestas();
  },
  methods: {
    // Verificar si el usuario tiene certificados (encuestas respondidas)
    verificarEncuestas(){
      let me = this;
      if (!me.usuario || !me.usuario.idusuario) return;
      me.$http.get(me.$server_url + 'encuesta_prolipa/mis-encuestas/' + me.usuario.idusuario)
        .then(res => {
          const encuestas = res.data.encuestas || [];
          me.cant_certificados = encuestas.length;
        })
        .catch(err => {
          console.log('Error al verificar encuestas:', err);
          me.cant_certificados = 0;
        });
    },
    // Ir a la vista de certificados
    irCertificados(){
      this.$router.push('/certificados/gestion/');
    },
    irCapacitaciones(){
      this.$router.push('/capacitadores/gestion');
    },
  }
}
</script>
<style scoped>
.cards-globales-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.card-global {
  width: 100%;
}

.card-global--clickable {
  cursor: pointer;
}

.card-certificados {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 120px;
  border: 2px solid #ddd6fe;
  border-radius: 10px;
  padding: 0;
  transition: all 0.25s ease;
  overflow: hidden;
  background: white;
  cursor: pointer;
}

.card-certificados:hover {
  border-color: #a78bfa;
  box-shadow: 0 8px 24px rgba(167, 139, 250, 0.15);
  transform: translateY(-4px);
}

.card-header {
  text-align: center;
  width: 100%;
  padding: 10px 0;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-bottom: 2px solid #e9d5ff;
}

.card-header h3 {
  color: #1e293b;
  font-weight: 600;
  letter-spacing: 0.3px;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 12px;
  gap: 6px;
}

.card-body .vs-icon {
  transition: transform 0.2s ease;
}

.card-certificados:hover .card-body .vs-icon {
  transform: scale(1.08);
}

.contador {
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-size: 24px;
  color: #3b82f6;
}

/* Responsive */
@media (max-width: 768px) {
  .cards-globales-container {
    grid-template-columns: 1fr;
  }

  .card-certificados {
    min-height: 110px;
  }

  .card-body .vs-icon {
    font-size: 45px !important;
  }

  .contador {
    font-size: 20px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .cards-globales-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

