<template>
  <div v-if="datosReport">
      <div>
          <vs-divider>Ventas</vs-divider>
          <div class="vx-row my-2 mx-4">
              <vs-button @click="downloadReport()" type="relief">Reporte de Ventas</vs-button>
          </div>
          <div class="vx-col my-2 mx-4" style="justify-content: center;">
            <center>
                <div style="justify-content: center;">
                    <h3> <b>Total Ventas Bruta: {{totalNotas + totalFacturas | filtrarDecimal }}</b> </h3>
                    <h3> <b>Total Ventas Bruta - Devoluciones: {{totalDescuentoFacturas + totalDescuentoNotas | filtrarDecimal }}</b> </h3>
                    <!-- <h3> <b>Total Ventas Bruta + Punto de venta: {{totalNotas + totalFacturas + totalValores  | filtrarDecimal }}</b> </h3> -->
                    <!-- <h3> <b>Total Ventas Bruta: {{ (ventaBruta + totalValores )| filtrarDecimal }}</b> </h3> -->
                </div>
            </center>
            <!-- <div>
                <h3> <b>Total Ventas Neta: {{totalNotasNeto + totalFacturasNeto  | filtrarDecimal }}</b> </h3>
            </div> -->
          </div>
          <div class="vx-row mt-5">
              <!--Ventas Notas-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                  <vx-card title="Ventas en Notas" class="columna">
                      <!-- <p class="font-bold text-2xl">Total: 5</p> -->
                      <div class="vx-row mt-3">
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #38a885;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M571.405,279.306h-0.931v-82.384c0-37.807-30.757-68.566-68.563-68.566h-39.265L404.934,14.06 c-1.841-3.646-5.064-6.409-8.955-7.669c-3.888-1.262-8.116-0.916-11.749,0.962L150.013,128.358H68.563 C30.757,128.358,0,159.118,0,196.925V537.79c0,37.807,30.757,68.566,68.563,68.566h433.347c37.806,0,68.563-30.76,68.563-68.566 v-82.384h0.931c22.384,0,40.595-18.211,40.595-40.595V319.9C612,297.52,593.789,279.306,571.405,279.306z M384.557,41.673 l43.769,86.685H216.763L384.557,41.673z M581.363,414.812c0,5.49-4.467,9.957-9.957,9.957H397.027c-5.49,0-9.957-4.467-9.957-9.957 V319.9c0-5.49,4.467-9.957,9.957-9.957h174.379c5.49,0,9.957,4.467,9.957,9.957V414.812L581.363,414.812z M491.466,367.358 c0,21.091-17.157,38.245-38.245,38.245c-21.088,0-38.242-17.157-38.242-38.245s17.157-38.245,38.242-38.245 C474.31,329.11,491.466,346.267,491.466,367.358z"></path>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Total Vendido en Notas</h3>
                                      <p class="text-3xl">{{ totalNotas | filtrarDecimal }}</p>
                                  </div>
                              </div>
                          </div>
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #38a885;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M571.405,279.306h-0.931v-82.384c0-37.807-30.757-68.566-68.563-68.566h-39.265L404.934,14.06 c-1.841-3.646-5.064-6.409-8.955-7.669c-3.888-1.262-8.116-0.916-11.749,0.962L150.013,128.358H68.563 C30.757,128.358,0,159.118,0,196.925V537.79c0,37.807,30.757,68.566,68.563,68.566h433.347c37.806,0,68.563-30.76,68.563-68.566 v-82.384h0.931c22.384,0,40.595-18.211,40.595-40.595V319.9C612,297.52,593.789,279.306,571.405,279.306z M384.557,41.673 l43.769,86.685H216.763L384.557,41.673z M581.363,414.812c0,5.49-4.467,9.957-9.957,9.957H397.027c-5.49,0-9.957-4.467-9.957-9.957 V319.9c0-5.49,4.467-9.957,9.957-9.957h174.379c5.49,0,9.957,4.467,9.957,9.957V414.812L581.363,414.812z M491.466,367.358 c0,21.091-17.157,38.245-38.245,38.245c-21.088,0-38.242-17.157-38.242-38.245s17.157-38.245,38.242-38.245 C474.31,329.11,491.466,346.267,491.466,367.358z"></path>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                   <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Total Vendido en Notas - Devoluciones</h3>
                                      <p class="text-3xl">{{ totalDescuentoNotas | filtrarDecimal }}</p>
                                  </div>
                              </div>
                          </div>
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  ">
                              <div class="mx-4">
                                  <vs-button @click="abrirDetalles('notas')" type="relief">Ver Notas</vs-button>
                              </div>
                          </div>
                      </div>
                  </vx-card>
              </div>
              <!--Ventas Facturas-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                  <vx-card title="Ventas en Prefacturas" class="columna">
                      <!-- <p class="font-bold text-2xl">Total: 5</p> -->
                      <div class="vx-row mt-3">
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #38a885;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M571.405,279.306h-0.931v-82.384c0-37.807-30.757-68.566-68.563-68.566h-39.265L404.934,14.06 c-1.841-3.646-5.064-6.409-8.955-7.669c-3.888-1.262-8.116-0.916-11.749,0.962L150.013,128.358H68.563 C30.757,128.358,0,159.118,0,196.925V537.79c0,37.807,30.757,68.566,68.563,68.566h433.347c37.806,0,68.563-30.76,68.563-68.566 v-82.384h0.931c22.384,0,40.595-18.211,40.595-40.595V319.9C612,297.52,593.789,279.306,571.405,279.306z M384.557,41.673 l43.769,86.685H216.763L384.557,41.673z M581.363,414.812c0,5.49-4.467,9.957-9.957,9.957H397.027c-5.49,0-9.957-4.467-9.957-9.957 V319.9c0-5.49,4.467-9.957,9.957-9.957h174.379c5.49,0,9.957,4.467,9.957,9.957V414.812L581.363,414.812z M491.466,367.358 c0,21.091-17.157,38.245-38.245,38.245c-21.088,0-38.242-17.157-38.242-38.245s17.157-38.245,38.242-38.245 C474.31,329.11,491.466,346.267,491.466,367.358z"></path>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Total Ventas en Facturas</h3>
                                      <p class="text-3xl">{{ totalFacturas | filtrarDecimal  }}</p>
                                  </div>
                              </div>
                          </div>
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #38a885;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M571.405,279.306h-0.931v-82.384c0-37.807-30.757-68.566-68.563-68.566h-39.265L404.934,14.06 c-1.841-3.646-5.064-6.409-8.955-7.669c-3.888-1.262-8.116-0.916-11.749,0.962L150.013,128.358H68.563 C30.757,128.358,0,159.118,0,196.925V537.79c0,37.807,30.757,68.566,68.563,68.566h433.347c37.806,0,68.563-30.76,68.563-68.566 v-82.384h0.931c22.384,0,40.595-18.211,40.595-40.595V319.9C612,297.52,593.789,279.306,571.405,279.306z M384.557,41.673 l43.769,86.685H216.763L384.557,41.673z M581.363,414.812c0,5.49-4.467,9.957-9.957,9.957H397.027c-5.49,0-9.957-4.467-9.957-9.957 V319.9c0-5.49,4.467-9.957,9.957-9.957h174.379c5.49,0,9.957,4.467,9.957,9.957V414.812L581.363,414.812z M491.466,367.358 c0,21.091-17.157,38.245-38.245,38.245c-21.088,0-38.242-17.157-38.242-38.245s17.157-38.245,38.242-38.245 C474.31,329.11,491.466,346.267,491.466,367.358z"></path>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Total Ventas en Facturas - Devoluciones</h3>
                                      <p class="text-3xl">{{ totalDescuentoFacturas | filtrarDecimal  }}</p>
                                  </div>
                              </div>
                          </div>
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full ">
                              <div class=" mx-4">
                                  <vs-button @click="abrirDetalles('facturas')" type="relief">Ver PreFacturas</vs-button>
                              </div>
                          </div>
                      </div>
                  </vx-card>
              </div>
          </div>
      </div>
      <div>
          <vs-divider>Cobranza</vs-divider>
          <!-- <vs-alert color="warning">
          <p class="text-center">
            <i class="fa-solid fa-triangle-exclamation"></i> Estos cálculos se hacen de los documentos realizados de los contratos.
          </p>
        </vs-alert> -->
          <div class="vx-row mt-5">
              <!--Notas-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                  <vx-card title="Cobros en Notas" class="columna">
                      <!-- <p class="font-bold text-2xl">Total: 5</p> -->
                      <div class="vx-row mt-3">
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #2468c1;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M571.405,279.306h-0.931v-82.384c0-37.807-30.757-68.566-68.563-68.566h-39.265L404.934,14.06 c-1.841-3.646-5.064-6.409-8.955-7.669c-3.888-1.262-8.116-0.916-11.749,0.962L150.013,128.358H68.563 C30.757,128.358,0,159.118,0,196.925V537.79c0,37.807,30.757,68.566,68.563,68.566h433.347c37.806,0,68.563-30.76,68.563-68.566 v-82.384h0.931c22.384,0,40.595-18.211,40.595-40.595V319.9C612,297.52,593.789,279.306,571.405,279.306z M384.557,41.673 l43.769,86.685H216.763L384.557,41.673z M581.363,414.812c0,5.49-4.467,9.957-9.957,9.957H397.027c-5.49,0-9.957-4.467-9.957-9.957 V319.9c0-5.49,4.467-9.957,9.957-9.957h174.379c5.49,0,9.957,4.467,9.957,9.957V414.812L581.363,414.812z M491.466,367.358 c0,21.091-17.157,38.245-38.245,38.245c-21.088,0-38.242-17.157-38.242-38.245s17.157-38.245,38.242-38.245 C474.31,329.11,491.466,346.267,491.466,367.358z"></path>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Total Cobros en Notas</h3>
                                      <p class="text-3xl">{{ parseFloat(totales.total_notas) | filtrarDecimal }}</p>
                                  </div>
                              </div>
                          </div>
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #c12424;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M60,4.293c0-2.206-1.794-4-4-4H4c-2.206,0-4,1.794-4,4c0,1.859,1.28,3.411,3,3.858v48.556l3-3l6,6l6-6l6,6l6-6l6,6l6-6l6,6 l6-6l3,3V8.151C58.72,7.704,60,6.152,60,4.293z M55,51.879l-1-1l-6,6l-6-6l-6,6l-6-6l-6,6l-6-6l-6,6l-6-6l-1,1V8.293v-3h50v3 V51.879z M57,6.024V3.293H3v2.731C2.403,5.679,2,5.032,2,4.293c0-1.103,0.897-2,2-2h52c1.103,0,2,0.897,2,2 C58,5.032,57.597,5.679,57,6.024z"></path>
                                                  <path d="M44,40.293H29c-0.552,0-1,0.447-1,1s0.448,1,1,1h15c0.552,0,1-0.447,1-1S44.552,40.293,44,40.293z"></path>
                                                  <path d="M48.29,40.583c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29 c0.26,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.271-0.11-0.521-0.29-0.71C49.33,40.213,48.67,40.213,48.29,40.583z "></path>
                                                  <path d="M49,26.293H34c-0.552,0-1,0.447-1,1s0.448,1,1,1h15c0.552,0,1-0.447,1-1S49.552,26.293,49,26.293z"></path>
                                                  <path d="M49,33.293H39c-0.552,0-1,0.447-1,1s0.448,1,1,1h10c0.552,0,1-0.447,1-1S49.552,33.293,49,33.293z"></path>
                                                  <path d="M28,34.293c0,0.553,0.448,1,1,1h2c0.552,0,1-0.447,1-1s-0.448-1-1-1h-2C28.448,33.293,28,33.74,28,34.293z"></path>
                                                  <path d="M45,20.293c0-0.553-0.448-1-1-1H29c-0.552,0-1,0.447-1,1s0.448,1,1,1h15C44.552,21.293,45,20.846,45,20.293z"></path>
                                                  <path d="M48.29,19.583c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29 c0.27,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71s-0.11-0.521-0.29-0.71C49.34,19.213,48.66,19.213,48.29,19.583z"></path>
                                                  <path d="M30.71,28.003c0.18-0.19,0.29-0.44,0.29-0.71c0-0.271-0.11-0.521-0.29-0.71c-0.37-0.37-1.04-0.37-1.42,0 c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.27,0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29 C30.26,28.293,30.52,28.183,30.71,28.003z"></path>
                                                  <path d="M35.71,35.003c0.18-0.19,0.29-0.44,0.29-0.71c0-0.271-0.11-0.53-0.29-0.71c-0.37-0.37-1.04-0.37-1.42,0 c-0.18,0.189-0.29,0.45-0.29,0.71s0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29C35.26,35.293,35.52,35.183,35.71,35.003z"></path>
                                                  <path d="M17,21.394v-1.101c0-0.553-0.448-1-1-1s-1,0.447-1,1v1.104c-1.091,0.222-2.085,0.801-2.818,1.668 c-0.611,0.722-0.894,1.646-0.794,2.603c0.102,0.979,0.606,1.887,1.383,2.491L15,29.893v5.438c-1.161-0.414-2-1.514-2-2.816 c0-0.553-0.448-1-1-1s-1,0.447-1,1c0,2.414,1.721,4.434,4,4.899v0.878c0,0.553,0.448,1,1,1s1-0.447,1-1v-0.882 c1.091-0.222,2.085-0.801,2.819-1.668c0.611-0.724,0.893-1.648,0.793-2.605c-0.103-0.978-0.606-1.885-1.383-2.488L17,28.916v-5.438 c1.161,0.414,2,1.514,2,2.816c0,0.553,0.448,1,1,1s1-0.447,1-1C21,23.879,19.279,21.859,17,21.394z M18.001,32.228 c0.349,0.271,0.576,0.68,0.622,1.118c0.043,0.41-0.075,0.803-0.331,1.105c-0.348,0.411-0.798,0.699-1.292,0.875v-3.878 L18.001,32.228z M13.999,26.581c-0.35-0.272-0.576-0.681-0.622-1.12c-0.042-0.409,0.075-0.801,0.331-1.104 c0.348-0.411,0.798-0.699,1.292-0.875v3.877L13.999,26.581z"></path>
                                                  <circle cx="40" cy="11.293" r="1"></circle>
                                                  <circle cx="36" cy="11.293" r="1"></circle>
                                                  <circle cx="44" cy="11.293" r="1"></circle>
                                                  <circle cx="32" cy="11.293" r="1"></circle>
                                                  <circle cx="48" cy="11.293" r="1"></circle>
                                                  <circle cx="20" cy="11.293" r="1"></circle>
                                                  <circle cx="24" cy="11.293" r="1"></circle>
                                                  <circle cx="28" cy="11.293" r="1"></circle>
                                                  <circle cx="52" cy="11.293" r="1"></circle>
                                                  <circle cx="16" cy="11.293" r="1"></circle>
                                                  <circle cx="12" cy="11.293" r="1"></circle>
                                                  <circle cx="8" cy="11.293" r="1"></circle>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700" @click="mostrarNotas=true;">
                                      <h3 class="text-sm tracking-wider">Cantidad de Cobros a Notas</h3>
                                      <p class="text-3xl">{{ totales.numero_notas }}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </vx-card>
              </div>
              <!--Facturas-->
              <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
                  <vx-card title="Cobros en Prefacturas" class="columna">
                      <!-- <p class="font-bold text-2xl">Total: 5</p> -->
                      <div class="vx-row mt-3">
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #2468c1;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 612 612" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M571.405,279.306h-0.931v-82.384c0-37.807-30.757-68.566-68.563-68.566h-39.265L404.934,14.06 c-1.841-3.646-5.064-6.409-8.955-7.669c-3.888-1.262-8.116-0.916-11.749,0.962L150.013,128.358H68.563 C30.757,128.358,0,159.118,0,196.925V537.79c0,37.807,30.757,68.566,68.563,68.566h433.347c37.806,0,68.563-30.76,68.563-68.566 v-82.384h0.931c22.384,0,40.595-18.211,40.595-40.595V319.9C612,297.52,593.789,279.306,571.405,279.306z M384.557,41.673 l43.769,86.685H216.763L384.557,41.673z M581.363,414.812c0,5.49-4.467,9.957-9.957,9.957H397.027c-5.49,0-9.957-4.467-9.957-9.957 V319.9c0-5.49,4.467-9.957,9.957-9.957h174.379c5.49,0,9.957,4.467,9.957,9.957V414.812L581.363,414.812z M491.466,367.358 c0,21.091-17.157,38.245-38.245,38.245c-21.088,0-38.242-17.157-38.242-38.245s17.157-38.245,38.242-38.245 C474.31,329.11,491.466,346.267,491.466,367.358z"></path>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Total Cobros en Facturas</h3>
                                      <p class="text-3xl">{{ parseFloat(totales.total_facturas) | filtrarDecimal}}</p>
                                  </div>

                              </div>
                          </div>
                          <div class="vx-col w-full sm:w-full md:w-full  lg:w-full  xl:w-full  mb-6">
                              <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow h-full">
                                  <div class="p-4" style="background-color: #c12424;">
                                      <svg class="h-12 w-12 text-white" fill="#ffffff" height="200px" width="200px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 60 60" xml:space="preserve" stroke="#ffffff">
                                          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                          <g id="SVGRepo_iconCarrier">
                                              <g>
                                                  <path d="M60,4.293c0-2.206-1.794-4-4-4H4c-2.206,0-4,1.794-4,4c0,1.859,1.28,3.411,3,3.858v48.556l3-3l6,6l6-6l6,6l6-6l6,6l6-6l6,6 l6-6l3,3V8.151C58.72,7.704,60,6.152,60,4.293z M55,51.879l-1-1l-6,6l-6-6l-6,6l-6-6l-6,6l-6-6l-6,6l-6-6l-1,1V8.293v-3h50v3 V51.879z M57,6.024V3.293H3v2.731C2.403,5.679,2,5.032,2,4.293c0-1.103,0.897-2,2-2h52c1.103,0,2,0.897,2,2 C58,5.032,57.597,5.679,57,6.024z"></path>
                                                  <path d="M44,40.293H29c-0.552,0-1,0.447-1,1s0.448,1,1,1h15c0.552,0,1-0.447,1-1S44.552,40.293,44,40.293z"></path>
                                                  <path d="M48.29,40.583c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29 c0.26,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71c0-0.271-0.11-0.521-0.29-0.71C49.33,40.213,48.67,40.213,48.29,40.583z "></path>
                                                  <path d="M49,26.293H34c-0.552,0-1,0.447-1,1s0.448,1,1,1h15c0.552,0,1-0.447,1-1S49.552,26.293,49,26.293z"></path>
                                                  <path d="M49,33.293H39c-0.552,0-1,0.447-1,1s0.448,1,1,1h10c0.552,0,1-0.447,1-1S49.552,33.293,49,33.293z"></path>
                                                  <path d="M28,34.293c0,0.553,0.448,1,1,1h2c0.552,0,1-0.447,1-1s-0.448-1-1-1h-2C28.448,33.293,28,33.74,28,34.293z"></path>
                                                  <path d="M45,20.293c0-0.553-0.448-1-1-1H29c-0.552,0-1,0.447-1,1s0.448,1,1,1h15C44.552,21.293,45,20.846,45,20.293z"></path>
                                                  <path d="M48.29,19.583c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.26,0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29 c0.27,0,0.52-0.11,0.71-0.29c0.18-0.19,0.29-0.45,0.29-0.71s-0.11-0.521-0.29-0.71C49.34,19.213,48.66,19.213,48.29,19.583z"></path>
                                                  <path d="M30.71,28.003c0.18-0.19,0.29-0.44,0.29-0.71c0-0.271-0.11-0.521-0.29-0.71c-0.37-0.37-1.04-0.37-1.42,0 c-0.18,0.189-0.29,0.439-0.29,0.71c0,0.27,0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29 C30.26,28.293,30.52,28.183,30.71,28.003z"></path>
                                                  <path d="M35.71,35.003c0.18-0.19,0.29-0.44,0.29-0.71c0-0.271-0.11-0.53-0.29-0.71c-0.37-0.37-1.04-0.37-1.42,0 c-0.18,0.189-0.29,0.45-0.29,0.71s0.11,0.52,0.29,0.71c0.19,0.18,0.45,0.29,0.71,0.29C35.26,35.293,35.52,35.183,35.71,35.003z"></path>
                                                  <path d="M17,21.394v-1.101c0-0.553-0.448-1-1-1s-1,0.447-1,1v1.104c-1.091,0.222-2.085,0.801-2.818,1.668 c-0.611,0.722-0.894,1.646-0.794,2.603c0.102,0.979,0.606,1.887,1.383,2.491L15,29.893v5.438c-1.161-0.414-2-1.514-2-2.816 c0-0.553-0.448-1-1-1s-1,0.447-1,1c0,2.414,1.721,4.434,4,4.899v0.878c0,0.553,0.448,1,1,1s1-0.447,1-1v-0.882 c1.091-0.222,2.085-0.801,2.819-1.668c0.611-0.724,0.893-1.648,0.793-2.605c-0.103-0.978-0.606-1.885-1.383-2.488L17,28.916v-5.438 c1.161,0.414,2,1.514,2,2.816c0,0.553,0.448,1,1,1s1-0.447,1-1C21,23.879,19.279,21.859,17,21.394z M18.001,32.228 c0.349,0.271,0.576,0.68,0.622,1.118c0.043,0.41-0.075,0.803-0.331,1.105c-0.348,0.411-0.798,0.699-1.292,0.875v-3.878 L18.001,32.228z M13.999,26.581c-0.35-0.272-0.576-0.681-0.622-1.12c-0.042-0.409,0.075-0.801,0.331-1.104 c0.348-0.411,0.798-0.699,1.292-0.875v3.877L13.999,26.581z"></path>
                                                  <circle cx="40" cy="11.293" r="1"></circle>
                                                  <circle cx="36" cy="11.293" r="1"></circle>
                                                  <circle cx="44" cy="11.293" r="1"></circle>
                                                  <circle cx="32" cy="11.293" r="1"></circle>
                                                  <circle cx="48" cy="11.293" r="1"></circle>
                                                  <circle cx="20" cy="11.293" r="1"></circle>
                                                  <circle cx="24" cy="11.293" r="1"></circle>
                                                  <circle cx="28" cy="11.293" r="1"></circle>
                                                  <circle cx="52" cy="11.293" r="1"></circle>
                                                  <circle cx="16" cy="11.293" r="1"></circle>
                                                  <circle cx="12" cy="11.293" r="1"></circle>
                                                  <circle cx="8" cy="11.293" r="1"></circle>
                                              </g>
                                          </g>
                                      </svg>
                                  </div>
                                  <div class="px-4 text-gray-700">
                                      <h3 class="text-sm tracking-wider">Cantidad de cobros a Prefacturas</h3>
                                      <p class="text-3xl">{{ totales.numero_facturas   }}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </vx-card>
              </div>
              <!-- <div v-if="mostrarNotas || mostrarFacturas" class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              notas
          </div>
          <div v-if="mostrarNotas || mostrarFacturas" class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6">
              facturas
          </div> -->
          </div>
          <vs-popup v-if="mostrarFacturas" fullscreen title="Prefacturas" :active.sync="mostrarFacturas" class="popophijo">
              <vs-table max-items="15" pagination :data="arregloFacturas">
                  <template slot="thead">
                      <vs-th>codigo</vs-th>
                      <vs-th>Empresa</vs-th>
                      <vs-th>V.Subtotal</vs-th>
                      <vs-th>V.Descuento</vs-th>
                      <vs-th>V.Total</vs-th>
                  </template>
                  <template slot-scope="{data}">
                      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                          <td> {{ tr.ven_codigo }}
                              <!-- <br> <b>Ref:</b> {{ tr.ven_idproforma }} -->
                          </td>
                          <td> {{ tr.descripcion_corta }} </td>
                          <td> {{ tr.ven_subtotal }} </td>
                          <td> {{ tr.ven_descuento }} </td>
                          <td> {{ tr.ven_valor }} </td>

                      </vs-tr>
                  </template>
              </vs-table>
          </vs-popup>
          <vs-popup v-if="mostrarNotas" fullscreen title="Notas" :active.sync="mostrarNotas" class="popophijo">
              <vs-table max-items="15" pagination :data="arregloNotas">
                  <template slot="thead">
                      <vs-th>codigo</vs-th>
                      <vs-th>Empresa</vs-th>
                      <vs-th>V.Subtotal</vs-th>
                      <vs-th>V.Descuento</vs-th>
                      <vs-th>V.Total</vs-th>
                  </template>
                  <template slot-scope="{data}">
                      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                          <td> {{ tr.ven_codigo }}
                              <!-- <span v-if="tr.ven_idproforma">
                        <br><b>Ref:</b> {{ tr.ven_idproforma }}
                      </span> -->
                          </td>
                          <td> {{ tr.descripcion_corta }} </td>
                          <td> {{ tr.ven_subtotal }} </td>
                          <td> {{ tr.ven_descuento }} </td>
                          <td> {{ tr.ven_valor }} </td>

                      </vs-tr>
                  </template>
              </vs-table>
          </vs-popup>
      </div>
  </div>
  </template>


  <script>
  import * as XLSX from 'xlsx';
  import vSelect from 'vue-select'
  export default {
      components: {
          vSelect,
      },
      data() {
          return {
              datosReport: [],
              periodo: '',
              arregloPeriodos: [],
              arregloNotasFacturas: [],
              arregloNotas: [],
              arregloFacturas: [],
              totales: {
                  total_notas: 0,
                  total_facturas: 0,
              },
              mostrarNotas: false,
              mostrarFacturas: false,
              totalFacturas: 0,
              totalFacturasNeto: 0,
              totalNotas: 0,
              totalNotasNeto:0,
              arrayCodigos:[],
              totalValores: 0,
              ventaBruta:0,
              mixinIdInicioFormatoNewData: null,

              //descuentos
              totalDescuentoFacturas:0,
              totalDescuentoNotas:0,
          }
      },
      props: {
          periodo_id: {
              type: Number,
              default: 0
          },
      },
      watch:{
        periodo_id(results){
          let me = this
          me.getDatosReporte()
          me.getfacturasNotasAll()
        }
      },
      mounted() {
          let me = this
          // Verifica si los datos existen en localStorage
        const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
        if (mixinData) {
        // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
        const parsedData = JSON.parse(mixinData);
        me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
        console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
        } else {
            console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
        }
        // FIN Verificación si los datos existen en localStorage
          me.periodo = me.periodo_id
          me.getDatosReporte()
          me.getfacturasNotasAll()
        //   me.getCodes()
      },
      methods: {
          abrirDetalles(parametro) {
              let me = this;
              if (parametro == 'notas') {
                  me.mostrarNotas = true;
                  me.mostrarFacturas = false;
              } else if (parametro == 'facturas') {
                  me.mostrarFacturas = true;
                  me.mostrarNotas = false;
              }
          },
          getPeriodos() {
              let me = this
              this.$http.get(this.$server_url + 'get_periodos_pedidos')
                  .then(res => {
                      let datos = res.data
                      me.arregloPeriodos = datos
                  })
                  .catch(function (error) {
                      me.$vs.loading.close();
                  })
          },
          getDatosReporte() {
              let me = this;
              me.datosReport = ''
              if (me.periodo == '' || me.periodo == null || me.periodo == undefined || me.periodo == 0) {
                  me.$vs.notify({
                      text: 'Debe seleccionar un período',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  })
                  return
              }
              this.$http.get(this.$server_url + `traerCobros?periodo=${me.periodo}`)
                  .then(function (res) {
                      if (res.data.status == 0) {
                          me.$vs.notify({
                              text: 'No se encontro datos',
                              color: 'warning',
                              iconPack: 'feather',
                              icon: 'icon-check'
                          })
                          return
                      }
                      me.datosReport = res.data['datosCobros']
                      me.totales = res.data['totalCobros'][0]
                  })
                  .catch(function (error) {
                      console.log(error + ' error');
                  })
          },
          getfacturasNotasAll() {
            //   let me = this;
            //   me.datosReport = ''
            //   if (me.periodo == '' || me.periodo == null || me.periodo == undefined || me.periodo == 0) {
            //       me.$vs.notify({
            //           text: 'Debe seleccionar un período',
            //           color: 'warning',
            //           iconPack: 'feather',
            //           icon: 'icon-check'
            //       })
            //       return
            //   }
            //   this.$http.get(this.$server_url + `get_facturasNotasAll?periodo=${me.periodo}`)
            //       .then(function (res) {
            //           let datos = res.data;
            //           me.arregloNotasFacturas = datos;

            //           if (me.arregloNotasFacturas.length > 0) {
            //               me.arregloFacturas = datos.filter(item => item.idtipodoc === 1);
            //               me.totalFacturas = me.arregloFacturas.reduce((total, factura) => total + factura.ven_subtotal, 0);
            //               me.totalFacturasNeto = me.arregloFacturas.reduce((total, factura) => total + factura.ven_valor, 0);

            //               me.totalDescuentoFacturas = me.arregloFacturas.reduce((total, nota) => total + nota.total_venta, 0);

            //               // const totalFormateado = totalFacturas.toLocaleString('en-US', {
            //               //   style: 'currency',
            //               //   currency: 'USD',
            //               //   minimumFractionDigits: 2,
            //               //   maximumFractionDigits: 2
            //               // });

            //               me.arregloNotas = datos.filter(item => item.idtipodoc === 4 || item.idtipodoc === 3 );
            //               me.totalNotas = me.arregloNotas.reduce((total, nota) => total + nota.ven_subtotal, 0);
            //               me.totalNotasNeto= me.arregloNotas.reduce((total, nota) => total + nota.ven_valor, 0);
            //               me.ventaBruta = me.totalFacturas + me.totalNotas;

            //               me.totalDescuentoNotas = me.arregloNotas.reduce((total, nota) => total + nota.total_venta, 0);
            //           } else {
            //               me.$vs.notify({
            //                   text: "Cliente sin documentos",
            //                   color: "warning",
            //                   iconPack: "feather",
            //                   icon: "icon-check",
            //               });
            //           }

            //           me.$vs.loading.close();
            //       })
            //       .catch(function (error) {
            //           console.log(error + ' error');
            //       })

            let me = this;
            this.$http.get(this.$server_url + 'getVentasXperioso', {
                params: {
                    periodo_id: this.periodo_id,
                }
            })
            .then(response => {
                console.log(response.data);
                me.arregloFacturas = response.data.facturas;
                me.arregloNotas = response.data.notas;

                me.totalFacturas = me.arregloFacturas.reduce((total, factura) => total + factura.total_venta, 0);
                me.totalDescuentoFacturas = me.arregloFacturas.reduce((total, factura) => total + factura.total_venta_neta, 0);

                me.totalNotas = me.arregloNotas.reduce((total, nota) => total + nota.total_venta, 0);
                me.totalDescuentoNotas = me.arregloNotas.reduce((total, nota) => total + nota.total_venta_neta, 0);

            })
            .catch(function (error) {
                console.log(error);
            })
                
          },
          async downloadReport() {
            const reportTitle = 'Reporte Ventas';
            const fecha = new Date(2024, 7, 30);
            const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            const wsData = this.prepareData(reportTitle,fechaFormateada);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Combinar celdas para el título y cabecera
            ws['!merges'] = [
              { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Combina el título en la primera fila
              { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
              // { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } },
              // { s: { r: 4, c: 2 }, e: { r: 4, c: 3 } },
            ];

            // Agregar la hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

            // Exportar el archivo
            XLSX.writeFile(wb, `${reportTitle}.xlsx`);
          },
          
          // Método para obtener abonos desde el backend
          async obtenerAbonosParaReporte() {
              let me = this;
              try {
                  const response = await me.$http.get(me.$server_url + 'obtenerAbonosCuentas', {
                      params: {
                          fecha_inicio: null,
                          fecha_final: null,
                          cuenta: 'todas',
                          busqueda: 'Todo',
                          temporada: me.periodo_id
                      }
                  });
                  return response.data || [];
              } catch (error) {
                  console.error('Error al obtener abonos:', error);
                  return [];
              }
          },

          // Método para preparar datos de abonos con 15 columnas (alineado con backend)
          prepareAbonosData(abonos) {
              const wsData = [];
              let totalAbono = 0;

              wsData.push(['Detalles Abonos']);
              wsData.push([]);

              // Columnas alineadas con el backend (reporteAbonosGlobal)
              wsData.push([
                  'N° ABONO/RETENCIÓN',
                  'AÑO',
                  'FECHA ABONO/RETENCIÓN',
                  'PERIODO',
                  'CUENTA DE PAGO',
                  'NÚMERO CUENTA',
                  'DOCUMENTO ABONO/RETENCIÓN',
                  'VALOR ABONO/RETENCIÓN',
                  'EMPRESA',
                  'CLIENTE',
                  'RUC CLIENTE',
                  'LUGAR DESPACHO',
                  'CONCEPTO',
                  'ESTADO',
                  'FECHA CREACIÓN'
              ]);

              abonos.forEach(item => {
                  // Lógica de valor igual al backend
                  const valorAbono = item.cue_pag_codigo == 8 
                      ? item.abono_valor_retencion * 1 
                      : (item.abono_facturas > 0 ? item.abono_facturas * 1 : item.abono_notas * 1);
                  
                  const abonoFecha = item.abono_fecha ? item.abono_fecha : 'No disponible';
                  const abonoDocumento = item.abono_documento ? item.abono_documento : '';
                  
                  // Mapeo de empresas igual al backend
                  const empresaNombre = item.abono_empresa == 1 ? 'PROLIPA' 
                      : item.abono_empresa == 3 ? 'CALMED S.A'
                      : item.abono_empresa == 5 ? 'PROLIPA 2026'
                      : item.abono_empresa == 4 ? 'CALMED 2026'
                      : 'OTRA';
                  
                  // Estado igual al backend
                  const estadoNombre = item.abono_estado == 0 ? 'Pendiente' 
                      : item.abono_estado == 2 ? 'Verificado' 
                      : 'Otro';
                  
                  // Extraer año de la fecha
                  const year = item.abono_fecha ? new Date(item.abono_fecha).getFullYear() : '';

                  totalAbono += valorAbono;

                  wsData.push([
                      item.abono_id,
                      year,
                      abonoFecha,
                      item.periodo_nombre || '',
                      item.cue_pag_nombre,
                      item.cue_pag_numero || '',
                      abonoDocumento,
                      valorAbono.toFixed(2) * 1,
                      empresaNombre,
                      item.cliente || '',
                      item.ruc_cliente || '',
                      item.institucion || '',
                      item.abono_concepto || '',
                      estadoNombre,
                      item.created_at || ''
                  ]);
              });

              wsData.push(['', '', '', '', '', '', 'Total Abono:', totalAbono.toFixed(2) * 1, '', '', '', '', '', '', '']);
              wsData.push([]);

              return wsData;
          },

          prepareData(reportTitle, fecha, tipo, temporada) {
            const wsData = [];

            // Inicializar variables de totales
            let totalSaldos = 0;
            let totalDevolucion = 0;
            let totalAbono = 0;
            let totalven_valor = 0;
            let totalsubtotal = 0; // Solo usado en tipo 'V'
            let totalRetencion = 0;
            let totalLiquidaciones = 0;
            let totalCruces = 0;
            let totalNotasCredito = 0;

            // Agregar título (primera fila)
            wsData.push([reportTitle]); // Aquí se establece el texto del título
            wsData.push(['TEMPORADA ' + temporada]); // Espacio vacío
            wsData.push([fecha]); // Espacio vacío
            wsData.push([]); // Espacio vacío

            if (tipo == 'L') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'LIBRERIA', 'CLIENTE', 'ASESOR', 'COMPRAS', 'PAGOS', 'DEVOLUCIONES', 'RETENCIONES', 'OTROS', 'SALDO']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;
                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS' || item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:(ven_valor - abono_total - devolucion - retencion_total).toFixed(2) * 1; // Convertir a número
                    const subtotal = item.subtotal_total ? parseFloat(item.subtotal_total) : 0;

                    const porcentajeSaldo = subtotal !== 0 ? (saldo / subtotal) : 0;
                    const devNeta = devolucion - (devolucion * porcentajeSaldo);

                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        ven_valor.toFixed(2) * 1, // Convertir a número
                        abono_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        // devNeta.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        (0).toFixed(2) * 1,
                        saldo // Ya es un número
                    ]);

                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalRetencion += retencion_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                });

                // Agregar totales
                wsData.push(['', '', '', '', 'TOTAL:', totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, (0).toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }

            if (tipo == 'V') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'INSTITUCION', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS', 'RETENCIÓN', 'DEVOlUCION', 'SALDO']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const descuento_total = item.descuento_total ? parseFloat(item.descuento_total) : 0;
                    const subtotal = item.subtotal_total ? parseFloat(item.subtotal_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;

                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS'|| item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:(ven_valor - abono_total - devolucion - retencion_total).toFixed(2) * 1; // Convertir a número
                    const porcentajeSaldo = subtotal !== 0 ? (saldo / subtotal) : 0;
                    const devNeta = devolucion - (devolucion * porcentajeSaldo);

                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        subtotal.toFixed(2) * 1, // Convertir a número
                        ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        // devNeta.toFixed(2) * 1,
                        saldo
                    ]);

                    totalsubtotal += subtotal;
                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                    totalRetencion += retencion_total;
                });

                // Agregar totales
                wsData.push(['', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }

            if (tipo == 'All') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'P.VENTA/INST', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS', 'DEVOLUCIONES', 'LIQUIDACIONES', 'RETENCIONES', 'CRUCES','NOTA DE CREDITO', 'SALDO']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.tdo_nombre == 'NOTA DE CREDITO'?0:item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const descuento_total = item.descuento_total ? parseFloat(item.descuento_total) : 0;
                    const subtotal = item.tdo_nombre == 'NOTA DE CREDITO'?0:item.subtotal_total ? parseFloat(item.subtotal_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const liquidaciones = item.abono_liquidacion ? parseFloat(item.abono_liquidacion) : 0;
                    const cruces = item.abono_cruce ? parseFloat(item.abono_cruce) : 0;
                    const notasCredito = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS'|| item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:  item.tdo_nombre == 'NOTA DE CREDITO'? item.valor_total*-1:(ven_valor - abono_total - devolucion - retencion_total - liquidaciones - cruces).toFixed(2) * 1; // Convertir a número
 
                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        // item.idInstitucion || item.institucion_id,
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        subtotal.toFixed(2) * 1, // Convertir a número
                        ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        liquidaciones.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        cruces.toFixed(2) * 1,
                        item.tdo_nombre == 'NOTA DE CREDITO'?notasCredito.toFixed(2) * 1:0,
                        saldo
                    ]);

                    totalsubtotal += subtotal;
                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                    totalRetencion += retencion_total;
                    totalLiquidaciones += liquidaciones;
                    totalCruces += cruces;
                    totalNotasCredito += notasCredito;
                });

                // Agregar totales
                wsData.push(['', '', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalLiquidaciones.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalCruces.toFixed(2) * 1, totalNotasCredito.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }
        },
          //   getCodes(){
        //     let me = this
        //     let url = '';
        //     console.log(me.periodo_id, "periodoselectedd");
        //     me.$vs.loading()
        //     if (me.periodo_id <= me.mixinIdInicioFormatoNewData) {
        //         url = `metodosGetCodigos?reporteBodega=1&periodo=${me.periodo_id}&puntoVenta=1449`;
        //     }else if (me.periodo_id > me.mixinIdInicioFormatoNewData) {
        //         url = `metodosGetCodigos?reporteBodega_new=1&periodo=${me.periodo_id}&puntoVenta=1449`;
        //     }
        //     this.$http.get(this.$server_url+url)
        //         .then(function (res) {
        //         me.$vs.loading.close()
        //         me.arrayCodigos = res.data
        //         if(me.arrayCodigos.length == 0) { return }
        //         //sumar en totalValores  el campo precio_total
        //         me.totalValores = me.arrayCodigos.reduce((acc, obj) => acc + (parseFloat(obj.precio_total) || 0), 0);

        //         })
        //         .catch(function (error) {
        //         me.$vs.loading.close()
        //         me.$vs.notify({
        //             title: 'Error',
        //             text: 'Error al cargar los datos',
        //             color: 'danger',
        //             iconPack: 'feather',
        //             icon: 'icon-alert-circle'
        //         })
        //             console.log(error + ' error');
        //         })
        //     },
      }
  }
  </script>

  <style scoped>
  .popophijo {
      z-index: 51003;
      position: fixed;
  }
  </style>
