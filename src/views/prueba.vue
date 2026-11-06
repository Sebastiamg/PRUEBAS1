<template>
  <div>
    <h1>Notificaciones</h1>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: null, // Aquí guardaremos el mensaje recibido
    };
  },
  created() {
    // Realiza la solicitud POST para emitir el evento de Pusher
    this.sendNotification();
    
    // Configura Pusher
    Pusher.logToConsole = true;  // Logs en la consola para debug

    const pusher = new Pusher('67ad293a1345b6955bf0', {
      cluster: 'us2',
      encrypted: true,
    });

    const email = 'pruebas@gmail.com';  // Cambia esto según el email del usuario

    const channel = pusher.subscribe('notification.' + email);

    // Escucha el evento emitido por Laravel
    channel.bind('NewNotification', (data) => {
      console.log('Mensaje recibido:', data);
      this.message = data.message;
    });
  },
  methods: {
    sendNotification() {
      // Asegúrate de enviar el email al backend
      const email = 'pruebas@gmail.com';  // Cambia esto por el email real del usuario
      fetch('http://localhost:8000/api/pruebaPush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }), // Envía el email en el cuerpo de la solicitud
      })
      .then(response => response.json())
      .then(data => {
        console.log('Notificación enviada:', data);
      })
      .catch(error => {
        console.error('Error al enviar notificación:', error);
      });
    }
  }
};
</script>
