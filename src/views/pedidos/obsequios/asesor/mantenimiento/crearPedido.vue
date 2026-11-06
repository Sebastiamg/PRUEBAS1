<template>
    <div>
        <div v-if="mostrarContainer && vReal > 0">
            <div  class="flex" style="flex-wrap: wrap;">
                <!--VENTA REAL-->
                <div class="p-6 pb-0">
                    <div class="flex justify-center">
                        <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                            <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    width="24px" height="24px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                                <g>
                                    <path fill="#394240" d="M56,0H8C5.789,0,4,1.789,4,4v52c0,4.418,3.582,8,8,8h44c2.211,0,4-1.789,4-4V4C60,1.789,58.211,0,56,0z
                                        M52,56H16c-2.211,0-4-1.789-4-4s1.789-4,4-4h36V56z M52,40H12V8h40V40z"/>
                                    <path fill="#F9EBB2" d="M52,56H16c-2.211,0-4-1.789-4-4s1.789-4,4-4h36V56z"/>
                                    <rect x="12" y="8" fill="#45AAB8" width="40" height="32"/>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div class="flex justify-center">
                        <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ filtrarDecimal(vReal) }}</h2>
                    </div>
                    <div class="truncate"><span class="">Venta Bruta</span></div>
                </div>
                <!--PORCENTAJE DE DESCUENTO-->
                <div class="p-6 pb-0">
                  <div class="flex justify-center">
                      <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                        <feather-icon icon="PercentIcon"  svgClasses="h-8 w6" class="ml-1" />
                      </span>
                  </div>
                    <div class="flex justify-center">
                        <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">{{ descuentoEscuela }}%</h2>
                    </div>
                    <div class="truncate"><span class="">Comisión Escuela</span></div>
                </div>
                  <!--=======VALORES VENTA REAL O NETA======-->
                <div class="p-6 pb-0">
                  <div class="flex justify-center">
                    <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                      <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M951.87 253.86c0-82.18-110.05-144.14-256-144.14s-256 61.96-256 144.14c0 0.73 0.16 1.42 0.18 2.14h-0.18v109.71h73.14v-9.06c45.77 25.81 109.81 41.33 182.86 41.33 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98h-73.12v73.14h73.12c67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0 28.27-72.93 71-182.86 71l-25.89 0.12c-15.91 0.14-31.32 0.29-46.34-0.11l-1.79 73.11c8.04 0.2 16.18 0.27 24.48 0.27 7.93 0 16-0.05 24.2-0.12l25.34-0.12c67.44 0 127.02-13.35 171.81-35.69 6.97 7.23 11.04 14.41 11.04 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c67.44 0 127.01-13.35 171.81-35.69 6.98 7.22 11.05 14.4 11.05 20.62 0 28.27-72.93 71-182.86 71h-73.12v73.14h73.12c145.95 0 256-61.96 256-144.14 0-0.68-0.09-1.45-0.11-2.14h0.11V256h-0.18c0.03-0.72 0.2-1.42 0.2-2.14z m-438.86 0c0-28.27 72.93-71 182.86-71s182.86 42.73 182.86 71c0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98z" fill="#0F1F3C" /><path d="M330.15 365.71c-145.95 0-256 61.96-256 144.14 0 0.73 0.16 1.42 0.18 2.14h-0.18v256c0 82.18 110.05 144.14 256 144.14s256-61.96 256-144.14V512h-0.18c0.02-0.72 0.18-1.42 0.18-2.14 0-82.18-110.05-144.15-256-144.15zM147.29 638.93c0-6.32 4.13-13.45 11.08-20.62 44.79 22.33 104.36 35.67 171.78 35.67 67.39 0 126.93-13.33 171.71-35.64 6.94 7.18 11.15 14.32 11.15 20.58 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.72-182.86-70.97z m182.86-200.07c109.93 0 182.86 42.73 182.86 71 0 28.25-72.93 70.98-182.86 70.98s-182.86-42.73-182.86-70.98c0-28.27 72.93-71 182.86-71z m0 400.14c-109.93 0-182.86-42.73-182.86-71 0-6.29 4.17-13.43 11.11-20.6 44.79 22.32 104.34 35.66 171.75 35.66 67.4 0 126.96-13.33 171.74-35.65 6.95 7.17 11.11 14.31 11.11 20.6 0.01 28.26-72.92 70.99-182.85 70.99z" fill="#0F1F3C" /></svg>
                    </span>
                  </div>
                  <div class="flex justify-center">
                      <h2 class="mb-1 font-bold text-success">${{ (vReal - (vReal * descuentoEscuela )/100) | filtrarDecimal }}</h2>
                  </div>
                  <div class="truncate"><span class="ml-5 text-success">VENTA NETA</span></div>
                </div>
                <!--PORCENTAJE OBSERQUIO-->
                <div class="p-6 pb-0" v-if="userRoot">
                    <div class="flex justify-center">
                        <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                            <svg width="28px" height="28px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.1456 3.44124C13.7936 2.84127 14.7609 2 16 2C17.2391 2 18.2064 2.84127 18.8544 3.44124C19.0003 3.57633 19.1308 3.70074 19.2544 3.81862C19.4534 4.0084 19.6348 4.18138 19.8341 4.35462C20.1373 4.61813 20.3785 4.78624 20.583 4.8761C20.8189 4.96834 21.1301 5.02544 21.5384 5.05782C21.8208 5.08021 22.0952 5.08819 22.3954 5.09692C22.5519 5.10147 22.7153 5.10622 22.8905 5.11332C23.7647 5.14876 25.0437 5.22945 25.9071 6.09289C26.7706 6.95634 26.8512 8.23529 26.8867 9.10949C26.8938 9.28461 26.8985 9.44798 26.9031 9.60437C26.9118 9.90451 26.9198 10.1792 26.9422 10.4616C26.9746 10.8698 27.0317 11.181 27.1239 11.417C27.2137 11.6215 27.3819 11.8627 27.6454 12.1659C27.8186 12.3652 27.9915 12.5465 28.1813 12.7455C28.2992 12.8691 28.4236 12.9996 28.5588 13.1456C29.1587 13.7936 30 14.7609 30 16C30 17.2391 29.1587 18.2064 28.5588 18.8544C28.4237 19.0002 28.2994 19.1307 28.1815 19.2542C27.9918 19.4533 27.8186 19.6348 27.6454 19.8341C27.3819 20.1373 27.2137 20.3785 27.1239 20.583C27.0317 20.819 26.9746 21.1302 26.9422 21.5384C26.9198 21.8208 26.9118 22.0952 26.9031 22.3954C26.8985 22.5518 26.8938 22.7154 26.8867 22.8905C26.8512 23.7647 26.7706 25.0437 25.9071 25.9071C25.0437 26.7706 23.7647 26.8512 22.8905 26.8867C22.7154 26.8938 22.552 26.8985 22.3956 26.9031C22.0955 26.9118 21.8208 26.9198 21.5384 26.9422C21.1302 26.9746 20.819 27.0317 20.583 27.1239C20.3785 27.2137 20.1373 27.3819 19.8341 27.6454C19.6348 27.8186 19.4535 27.9915 19.2545 28.1813C19.1309 28.2991 19.0002 28.4237 18.8544 28.5588C18.2064 29.1587 17.2391 30 16 30C14.7609 30 13.7936 29.1587 13.1456 28.5588C12.9996 28.4236 12.8691 28.2992 12.7455 28.1813C12.5465 27.9915 12.3652 27.8186 12.1659 27.6454C11.8627 27.3819 11.6215 27.2137 11.417 27.1239C11.181 27.0317 10.8698 26.9746 10.4616 26.9422C10.1792 26.9198 9.90476 26.9118 9.60461 26.9031C9.44823 26.8985 9.28461 26.8938 9.10949 26.8867C8.23529 26.8512 6.95634 26.7706 6.09289 25.9071C5.22945 25.0437 5.14876 23.7647 5.11332 22.8905C5.10622 22.7153 5.10147 22.5519 5.09692 22.3954C5.08819 22.0952 5.08021 21.8208 5.05782 21.5384C5.02544 21.1301 4.96834 20.8189 4.8761 20.583C4.78624 20.3785 4.61813 20.1373 4.35462 19.8341C4.18138 19.6348 4.00853 19.4535 3.81875 19.2545C3.70093 19.131 3.57626 19.0002 3.44124 18.8544C2.84127 18.2064 2 17.2391 2 16C2 14.7609 2.84127 13.7936 3.44124 13.1456C3.57638 12.9996 3.70083 12.8691 3.81874 12.7455C4.00851 12.5465 4.18138 12.3652 4.35462 12.1659C4.61813 11.8627 4.78625 11.6215 4.8761 11.417C4.96834 11.1811 5.02544 10.8698 5.05782 10.4616C5.08021 10.1792 5.08819 9.90476 5.09692 9.60461C5.10147 9.44817 5.10622 9.28468 5.11332 9.10949C5.14876 8.23529 5.22945 6.95634 6.09289 6.09289C6.95634 5.22945 8.23529 5.14876 9.10949 5.11332C9.28468 5.10622 9.44811 5.10147 9.60455 5.09692C9.90469 5.08819 10.1792 5.08021 10.4616 5.05782C10.8698 5.02544 11.1811 4.96834 11.417 4.8761C11.6215 4.78625 11.8627 4.61813 12.1659 4.35462C12.3652 4.18138 12.5464 4.00854 12.7455 3.81877C12.8691 3.70085 12.9996 3.57638 13.1456 3.44124ZM19.8 12.6C20.1314 12.1582 20.0418 11.5314 19.6 11.2C19.1582 10.8686 18.5314 10.9582 18.2 11.4L12.2 19.4C11.8686 19.8418 11.9582 20.4686 12.4 20.8C12.8418 21.1314 13.4686 21.0418 13.8 20.6L19.8 12.6ZM17 19C17 17.8954 17.8954 17 19 17C20.1046 17 21 17.8954 21 19C21 20.1046 20.1046 21 19 21C17.8954 21 17 20.1046 17 19ZM13 11C11.8954 11 11 11.8954 11 13C11 14.1046 11.8954 15 13 15C14.1046 15 15 14.1046 15 13C15 11.8954 14.1046 11 13 11Z" fill="#3A52EE"/>
                            </svg>
                        </span>
                    </div>
                    <div class="flex justify-center">
                        <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">{{ porcentajeObsequio }}%</h2>
                    </div>
                    <div class="truncate"><span class="">Porcentaje obsequio</span></div>
                    <p></p>
                </div>
                <!--VALOR OBSEQUIOS-->
                <div class="p-6 pb-0" v-if="userRoot">
                    <div class="flex justify-center">
                        <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                            <svg version="1.0"  id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                width="28px" height="28px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                                <g>
                                    <g>
                                        <path fill="#F76D57" d="M6,60c0,1.104,0.896,2,2,2h20V30H6V60z"/>
                                        <path fill="#F76D57" d="M4,16c-1.104,0-2,0.895-2,2v8c0,1.104,0.896,2,2,2h24V16H4z"/>
                                        <path fill="#F76D57" d="M36,62h20c1.104,0,2-0.896,2-2V30H36V62z"/>
                                        <path fill="#F76D57" d="M60,16H36v12h24c1.104,0,2-0.896,2-2v-8C62,16.895,61.104,16,60,16z"/>
                                    </g>
                                    <g>
                                        <path fill="#394240" d="M60,14H47.279C48.944,12.535,50,10.393,50,8c0-4.418-3.582-8-8-8s-8,3.582-8,8v6h-4V8c0-4.418-3.582-8-8-8
                                            s-8,3.582-8,8c0,2.393,1.056,4.535,2.721,6H4c-2.211,0-4,1.789-4,4v8c0,2.211,1.789,4,4,4v30c0,2.211,1.789,4,4,4h48
                                            c2.211,0,4-1.789,4-4V30c2.211,0,4-1.789,4-4v-8C64,15.789,62.211,14,60,14z M28,62H8c-1.104,0-2-0.896-2-2V30h22V62z M28,28H4
                                            c-1.104,0-2-0.896-2-2v-8c0-1.105,0.896-2,2-2h24V28z M22,14c-3.313,0-6-2.686-6-6c0-3.312,2.687-6,6-6s6,2.688,6,6v6H22z M34,62
                                            h-4V30h4V62z M34,28h-4V16h4V28z M36,8c0-3.312,2.687-6,6-6s6,2.688,6,6c0,3.314-2.687,6-6,6h-6V8z M58,60c0,1.104-0.896,2-2,2H36
                                            V30h22V60z M62,26c0,1.104-0.896,2-2,2H36V16h24c1.104,0,2,0.895,2,2V26z"/>
                                        <path fill="#394240" d="M22,4c-2.209,0-4,1.791-4,4s1.791,4,4,4h4V8C26,5.791,24.209,4,22,4z M24,10h-2c-1.104,0-2-0.896-2-2
                                            c0-1.105,0.896-2,2-2s2,0.895,2,2V10z"/>
                                        <path fill="#394240" d="M46,8c0-2.209-1.791-4-4-4s-4,1.791-4,4v4h4C44.209,12,46,10.209,46,8z M40,8c0-1.105,0.896-2,2-2
                                            s2,0.895,2,2c0,1.104-0.896,2-2,2h-2V8z"/>
                                    </g>
                                    <g>
                                        <rect x="30" y="30" fill="#F9EBB2" width="4" height="32"/>
                                        <rect x="30" y="16" fill="#F9EBB2" width="4" height="12"/>
                                        <path fill="#F9EBB2" d="M22,2c-3.313,0-6,2.688-6,6c0,3.314,2.687,6,6,6h6V8C28,4.688,25.313,2,22,2z M26,12h-4
                                            c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4V12z"/>
                                        <path fill="#F9EBB2" d="M42,2c-3.313,0-6,2.688-6,6v6h6c3.313,0,6-2.686,6-6C48,4.688,45.313,2,42,2z M42,12h-4V8
                                            c0-2.209,1.791-4,4-4s4,1.791,4,4S44.209,12,42,12z"/>
                                    </g>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div class="flex justify-center">
                        <vx-tooltip text="Venta Bruta * Porcentaje Obsequio / 100" position="top" color="primary">
                            <h2 class="mb-1 font-bold text-success">${{ filtrarDecimal(SumaObsequios) }}</h2>
                        </vx-tooltip>
                    </div>
                    <div class="truncate"><span class="">Valor obsequios</span></div>
                </div>
                <div hidden>{{SumaObsequios}}</div>
                <!--TOTAL GASTADO ESCUELA-->
                <div class="p-6 pb-0" v-if="userRoot">
                    <div class="flex justify-center">
                        <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                            <svg height="28px" width="28px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                    viewBox="0 0 512 512" xml:space="preserve">
                                <path style="fill:#0055B8;" d="M256.001,113.647c62.767,0,105.048-94.439,105.048-94.439C365.778,8.645,360.177,0,348.602,0H163.399
                                    c-11.574,0-17.175,8.644-12.446,19.208C150.954,19.208,193.236,113.647,256.001,113.647z"/>
                                <path style="opacity:0.2;enable-background:new    ;" d="M255.99,115.819c-1.358,0-2.734-0.335-4.006-1.04
                                    c-11.917-6.621-23.852-20.799-35.475-42.144c-8.408-15.441-14.342-30.543-15.513-34.84c-1.2-4.403,1.396-8.947,5.8-10.148
                                    c4.407-1.196,8.947,1.397,10.148,5.801c2.047,7.51,21.871,55.106,43.068,66.881c3.99,2.217,5.428,7.249,3.212,11.239
                                    C261.711,114.285,258.894,115.819,255.99,115.819z"/>
                                <path style="opacity:0.2;enable-background:new    ;" d="M256.011,115.819c-2.905,0-5.721-1.534-7.232-4.251
                                    c-2.217-3.99-0.779-9.023,3.211-11.239c21.192-11.772,41.022-59.371,43.07-66.882c1.201-4.403,5.75-7,10.148-5.799
                                    c4.403,1.201,7,5.745,5.798,10.148c-1.172,4.298-7.108,19.401-15.514,34.838c-11.623,21.345-23.559,35.524-35.475,42.144
                                    C258.746,115.484,257.37,115.819,256.011,115.819z"/>
                                <path style="fill:#0071CE;" d="M499.948,326.411c0-134.731-109.22-243.951-243.948-243.951S12.052,191.68,12.052,326.411
                                    C12.052,461.141,91.42,512,256,512S499.948,461.141,499.948,326.411z"/>
                                <path style="fill:#FF9E16;" d="M490.574,259.219H21.427c-6.103,21.344-9.375,43.885-9.375,67.192c0,6.954,0.224,13.672,0.647,20.182
                                    h486.602c0.424-6.51,0.648-13.229,0.648-20.182C499.948,303.106,496.677,280.564,490.574,259.219z"/>
                                <circle style="fill:#FFFFFF;" cx="255.997" cy="300.041" r="148.665"/>
                                <path style="fill:#00A8E1;" d="M258.627,180.074c8.015,0,14.378,6.351,14.378,14.372v3.866c14.923,2.215,28.198,6.638,40.084,13.275
                                    c5.25,3.039,9.946,8.287,9.946,16.583c0,10.503-8.292,18.52-18.801,18.52c-3.319,0-6.63-0.829-9.672-2.489
                                    c-7.74-4.144-15.478-7.459-22.941-9.395v42.017c42.011,11.33,59.984,28.476,59.984,59.429c0,30.96-23.775,50.863-58.601,54.737
                                    v14.648c0,8.018-6.363,14.375-14.378,14.375c-8.018,0-14.373-6.357-14.373-14.375v-14.925c-19.627-2.49-38.15-9.399-54.454-19.352
                                    c-5.808-3.596-9.405-9.121-9.405-16.586c0-10.78,8.296-18.799,19.078-18.799c3.598,0,7.467,1.385,10.784,3.596
                                    c11.609,7.464,22.67,12.716,35.383,15.48V311.1c-39.81-10.782-59.435-25.983-59.435-58.882c0-30.407,23.219-50.861,58.051-54.459
                                    v-3.312C244.254,186.425,250.609,180.074,258.627,180.074z M245.638,269.633v-37.318c-13.27,1.936-19.075,8.569-19.075,17.413
                                    C226.564,258.297,230.432,264.104,245.638,269.633z M271.622,318.011v38.421c12.986-1.934,19.625-8.02,19.625-17.97
                                    C291.247,329.343,286.546,323.262,271.622,318.011z"/>
                            </svg>
                        </span>
                    </div>
                    <div class="flex justify-center">
                        <h2 class="mb-1 font-bold text-danger">${{ filtrarDecimal(total_gastado) }}</h2>
                    </div>
                    <div class="truncate"><span class="">Total gastado</span></div>
                </div>
                <!--VALOR DISPONIBLE-->
                <div class="p-6 pb-0" v-if="(valueAvaible > 0 || id > 0) && userRoot">
                    <div class="flex justify-center">
                        <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                            <svg width="28px" height="28px" viewBox="0 -196 1416 1416" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M324.358919 22.140541H1361.643243c18.819459 0 33.210811 14.391351 33.210811 33.21081v645.396757c0 18.819459-14.391351 33.210811-33.210811 33.210811H324.358919c-18.819459 0-33.210811-14.391351-33.210811-33.210811V55.351351c0-18.819459 14.391351-33.210811 33.210811-33.21081z" fill="#9DBE87" /><path d="M1361.643243 756.099459H324.358919c-30.996757 0-55.351351-24.354595-55.351351-55.351351V55.351351c0-30.996757 24.354595-55.351351 55.351351-55.351351H1361.643243c30.996757 0 55.351351 24.354595 55.351352 55.351351v645.396757c0 29.88973-24.354595 55.351351-55.351352 55.351351zM324.358919 44.281081c-6.642162 0-11.07027 4.428108-11.07027 11.07027v645.396757c0 6.642162 4.428108 11.07027 11.07027 11.07027H1361.643243c6.642162 0 11.07027-4.428108 11.070271-11.07027V55.351351c0-6.642162-4.428108-11.07027-11.070271-11.07027H324.358919z" fill="#131313" /><path d="M230.261622 116.237838h1038.391351c18.819459 0 33.210811 14.391351 33.210811 33.210811v645.396756c0 18.819459-14.391351 33.210811-33.210811 33.210811H230.261622c-18.819459 0-33.210811-14.391351-33.210811-33.210811V149.448649c0-18.819459 14.391351-33.210811 33.210811-33.210811z" fill="#9DBE87" /><path d="M1267.545946 850.196757H230.261622c-30.996757 0-55.351351-24.354595-55.351352-55.351352V149.448649c0-30.996757 24.354595-55.351351 55.351352-55.351352h1038.391351c30.996757 0 55.351351 24.354595 55.351351 55.351352v645.396756c-1.107027 29.88973-25.461622 55.351351-56.458378 55.351352zM230.261622 138.378378c-6.642162 0-11.07027 4.428108-11.070271 11.070271v645.396756c0 6.642162 4.428108 11.07027 11.070271 11.070271h1038.391351c6.642162 0 11.07027-4.428108 11.07027-11.070271V149.448649c0-6.642162-4.428108-11.07027-11.07027-11.070271H230.261622z" fill="#131313" /><path d="M143.913514 208.121081h1038.391351c18.819459 0 33.210811 14.391351 33.210811 33.210811v645.396757c0 18.819459-14.391351 33.210811-33.210811 33.21081H143.913514c-18.819459 0-33.210811-14.391351-33.210811-33.21081V241.331892c0-17.712432 14.391351-33.210811 33.210811-33.210811z" fill="#9DBE87" /><path d="M1182.304865 942.08H143.913514c-30.996757 0-55.351351-24.354595-55.351352-55.351351V241.331892c0-30.996757 24.354595-55.351351 55.351352-55.351351h1038.391351c30.996757 0 55.351351 24.354595 55.351351 55.351351v645.396757c0 29.88973-25.461622 55.351351-55.351351 55.351351zM143.913514 230.261622c-6.642162 0-11.07027 4.428108-11.070271 11.07027v645.396757c0 6.642162 4.428108 11.07027 11.070271 11.07027h1038.391351c6.642162 0 11.07027-4.428108 11.07027-11.07027V241.331892c0-6.642162-4.428108-11.07027-11.07027-11.07027H143.913514z" fill="#131313" /><path d="M55.351351 290.041081h1038.391352c18.819459 0 33.210811 14.391351 33.210811 33.210811v645.396757c0 18.819459-14.391351 33.210811-33.210811 33.21081H55.351351c-18.819459 0-33.210811-14.391351-33.21081-33.21081V323.251892c0-17.712432 14.391351-33.210811 33.21081-33.210811z" fill="#9DBE87" /><path d="M1093.742703 1024H55.351351c-30.996757 0-55.351351-24.354595-55.351351-55.351351V323.251892c0-30.996757 24.354595-55.351351 55.351351-55.351351h1038.391352c30.996757 0 55.351351 24.354595 55.351351 55.351351v645.396757c0 30.996757-25.461622 55.351351-55.351351 55.351351zM55.351351 312.181622c-6.642162 0-11.07027 4.428108-11.07027 11.07027v645.396757c0 6.642162 4.428108 11.07027 11.07027 11.07027h1038.391352c6.642162 0 11.07027-4.428108 11.07027-11.07027V323.251892c0-6.642162-4.428108-11.07027-11.07027-11.07027H55.351351z" fill="#131313" /><path d="M954.257297 902.227027H194.836757c0-52.03027-43.174054-95.204324-95.204325-95.204324V472.700541c52.03027 0 95.204324-43.174054 95.204325-95.204325h759.42054c0 52.03027 43.174054 95.204324 95.204325 95.204325v334.322162c-53.137297 0-95.204324 43.174054-95.204325 95.204324z" fill="#D6F0C5" /><path d="M954.257297 924.367568H194.836757c-12.177297 0-22.140541-9.963243-22.140541-22.140541 0-39.852973-33.210811-73.063784-73.063784-73.063784-12.177297 0-22.140541-9.963243-22.14054-22.14054V472.700541c0-12.177297 9.963243-22.140541 22.14054-22.140541 39.852973 0 73.063784-33.210811 73.063784-73.063784 0-12.177297 9.963243-22.140541 22.140541-22.14054h759.42054c12.177297 0 22.140541 9.963243 22.140541 22.14054 0 39.852973 33.210811 73.063784 73.063784 73.063784 12.177297 0 22.140541 9.963243 22.14054 22.140541v334.322162c0 12.177297-9.963243 22.140541-22.14054 22.14054-39.852973 0-73.063784 33.210811-73.063784 73.063784 0 12.177297-9.963243 22.140541-22.140541 22.140541z m-739.494054-44.281082h718.460541c8.856216-46.495135 46.495135-84.134054 92.99027-92.99027V492.627027c-46.495135-8.856216-84.134054-46.495135-92.99027-92.99027H214.763243c-8.856216 46.495135-46.495135 84.134054-92.99027 92.99027V785.989189c46.495135 9.963243 84.134054 47.602162 92.99027 94.097297z" fill="#131313" /><path d="M576.761081 790.417297c-35.424865 0-73.063784-13.284324-99.632432-47.602162-7.749189-9.963243-5.535135-23.247568 3.321081-30.996757 9.963243-7.749189 23.247568-5.535135 30.996756 3.321081 26.568649 34.317838 67.528649 35.424865 94.097298 26.568649 22.140541-7.749189 35.424865-22.140541 35.424865-37.638919 0-14.391351-34.317838-24.354595-64.207568-33.210811-46.495135-14.391351-105.167568-30.996757-105.167567-86.348108 0-26.568649 16.605405-50.923243 45.388108-65.314594 35.424865-17.712432 95.204324-24.354595 151.662702 16.605405 9.963243 7.749189 12.177297 21.033514 4.428108 30.996757-7.749189 9.963243-21.033514 12.177297-30.996756 4.428108-37.638919-27.675676-79.705946-26.568649-105.167568-13.284324-13.284324 6.642162-22.140541 16.605405-22.14054 26.568648 0 21.033514 30.996757 30.996757 73.063783 44.281081 45.388108 13.284324 95.204324 28.782703 95.204325 75.277838 0 34.317838-25.461622 65.314595-65.314595 79.705946-11.07027 3.321081-26.568649 6.642162-40.96 6.642162z" fill="#131313" /><path d="M574.547027 549.085405c-12.177297 0-22.140541-9.963243-22.140541-22.14054v-48.709189c0-12.177297 9.963243-22.140541 22.140541-22.140541s22.140541 9.963243 22.140541 22.140541v48.709189c0 13.284324-9.963243 22.140541-22.140541 22.14054z" fill="#131313" /><path d="M574.547027 832.484324c-12.177297 0-22.140541-9.963243-22.140541-22.14054v-36.531892c0-12.177297 9.963243-22.140541 22.140541-22.140541s22.140541 9.963243 22.140541 22.140541v36.531892c0 12.177297-9.963243 22.140541-22.140541 22.14054z" fill="#131313" /><path d="M285.612973 653.145946m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" fill="#AECD99" /><path d="M285.612973 715.139459c-34.317838 0-63.100541-27.675676-63.100541-63.10054s27.675676-63.100541 63.100541-63.100541c34.317838 0 63.100541 27.675676 63.100541 63.100541s-28.782703 63.100541-63.100541 63.10054z m0-80.812973c-9.963243 0-18.819459 7.749189-18.819459 18.81946s7.749189 18.819459 18.819459 18.819459c9.963243 0 18.819459-7.749189 18.819459-18.819459s-8.856216-18.819459-18.819459-18.81946z" fill="#131313" /><path d="M865.695135 653.145946m-40.96 0a40.96 40.96 0 1 0 81.92 0 40.96 40.96 0 1 0-81.92 0Z" fill="#AECD99" /><path d="M865.695135 715.139459c-34.317838 0-63.100541-27.675676-63.10054-63.10054s27.675676-63.100541 63.10054-63.100541c34.317838 0 63.100541 27.675676 63.100541 63.100541s-28.782703 63.100541-63.100541 63.10054z m0-80.812973c-9.963243 0-18.819459 7.749189-18.819459 18.81946s7.749189 18.819459 18.819459 18.819459 18.819459-7.749189 18.81946-18.819459-8.856216-18.819459-18.81946-18.81946z" fill="#131313" /></svg>
                        </span>
                    </div>
                    <div class="flex justify-center">
                        <vx-tooltip text="Valor Obsequios - Total Gastado" position="top" color="primary">
                            <h2 class="mb-1 font-bold text-dark">${{ filtrarDecimal(valueAvaible) }}</h2>
                        </vx-tooltip>
                    </div>
                    <div class="truncate"><span class="">Valor Disponible</span></div>
                </div>
            </div>
        </div>
        <vs-divider v-if="userAsesor || userRoot || userAdmin">{{ id == 0 ? 'CREAR':'EDITAR' }} PEDIDO OBSEQUIO</vs-divider>
        <vs-divider v-else>DETALLE PEDIDO OBSEQUIOS</vs-divider>
        <div v-if="id == 0">
            <TableSelectInstitucionVue @change="changeHandle" class="mt-2" :nombreInstitucionExterna="nombreInstitucion"/>
        </div>
        <div v-if="id > 0">
          <p class="font-ligth ml-3">Institucion: {{ pedido.nombreInstitucion }}</p>
        </div>
        <vs-alert color="danger" v-if="valueAvaible < 1" class="text-danger">{{ msgError }} <b v-if="institucion_id > 0">para la institución {{ nombreInstitucion }}</b></vs-alert>
        <!--FORMULARIO-->
        <vx-card class="mt-3" v-if="institucion_id > 0">
            <div class="flex mt-2" v-if="valueAvaible > 1 || userRoot || userAdmin|| id > 0">
                <p class="text-2xl font-medium">Registro de obsequios <span v-if="(pedido.id != null || pedido.id != undefined)">- pedido #{{ pedido.id }}</span></p>
                <div>
                    <vs-chip  transparent color="success" class="ml-2 mt-1">Contrato: {{ contrato }}</vs-chip>
                </div>
                <vs-chip transparent color="warning" class="ml-3 mt-1" style="font-size:16px;font-weight: bold;"><ion-icon name="cloud-download-outline" style="font-size: 24px;"></ion-icon> <span class="ml-1 cursor-pointer" @click="activePrompt = true;">Exportar</span></vs-chip>
            </div>
            <small v-if="(userAsesor || userRoot || userAdmin || id > 0)  && valueAvaible > 1 ">Presione el + de color verde para <b>agregar</b> otra fila</small>
            <div v-if="valueAvaible > 1 || userRoot || userAdmin || id > 0">
                <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
                <br>
                <vs-row v-for="(input,k) in inputs" :key="k">
                    <vs-col vs-type="flex" style="flex-direction: column;" vs-justify="center" vs-align="center" vs-lg="2" vs-w="2" vs-xs="2" vs-sm="2">
                        <vs-list-item title="Cantidad"></vs-list-item>
                        <vs-input :disabled="userAsesor == true || userRoot  || userAdmin == true ? false : true"  type="number" style="width: 95%;" v-model="input.cantidad" />
                    </vs-col>
                    <vs-col vs-type="flex" style="flex-direction: column;" vs-justify="center" vs-align="center" vs-lg="4" vs-w="4" vs-xs="4" vs-sm="4">
                        <vs-list-item title="Descripción"></vs-list-item>
                        <vs-input :disabled="userAsesor == true || userRoot  || userAdmin == true ? false : true" style="width: 95%;" v-model="input.descripcion" />
                    </vs-col>
                    <vs-col vs-type="flex" style="flex-direction: column;" vs-justify="center" vs-align="center" vs-lg="4" vs-w="4" vs-xs="4" vs-sm="4">
                        <vs-list-item title="Especificación"></vs-list-item>
                        <vs-input :disabled="userAsesor == true || userRoot  || userAdmin == true ? false : true" style="width: 95%;" v-model="input.especificacion" />
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="mt-5">
                        <vx-tooltip style="display: inline-block;" text="Eliminar fila" position="top" color="primary">
                            <vs-button color="danger" size="large" radius icon="delete" type="line" v-if="k>0 && changeValues == true" @click="remove(k)" v-show="k == inputs.length-1"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Agregar fila" position="top" color="primary">
                            <vs-button color="success" size="small" class="ml-2" icon="add" type="filled" @click="add(k)" v-show="k == inputs.length-1 && changeValues == true">
                                Más registros
                            </vs-button>
                        </vx-tooltip>
                    </vs-col>
                </vs-row>
                <!--APROBAR-->
                <div class="vx-row mt-5">
                    <div class="vx-col w-full">
                        <vs-button class="ml-1" v-if="(changeValues || userRoot || userAdmin) && ((pedido.estado == 1 || pedido.estado == 0) || id == 0)" icon="save" @click="openConfirm();">{{ id == 0 ? 'GUARDAR':'EDITAR' }}</vs-button>
                        <div v-if="userFacturador || userRoot || userAdmin || usuario.id_group == 23 || usuario.id_group == 22">
                            <vs-divider>Aprobación pedido obsequio</vs-divider>
                            <vs-textarea  class="ml-1" counter="300" :disabled="(pedido.estado == 1 ? false: true)" style="width: 82%;" label="Comentario (Máximo 300 caracteres)" :counter-danger.sync="counterDanger" v-model="observacion_facturador" />
                            <div v-if="pedido.estado == 1" class="flex">
                                <vs-button  class="ml-1" icon="check" @click="openConfirmarAprobar(3)">Aprobar pedido</vs-button>
                                <vs-button  type="line" color="danger" class="ml-3" icon-pack="feather" icon="icon-x" @click="openConfirmarAprobar(2)">Rechazar pedido</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
                <!--ANULAR PEDIDO-->
                <div v-if="pedido.estado == 3 || pedido.comentario_anulado">
                  <vs-divider>Anulación pedido obsequio</vs-divider>
                  <div class="vx-row">
                    <div class="vx-col w-1/2">
                      <!--input-->
                      <vs-input v-model="ObjectSelected.comentario_anulado" label="Comentario anulación del pedido de obsequio" class="w-full" />
                    </div>
                    <div class="vx-col w-1/2" v-if="pedido.estado == 3">
                      <!--boton de anular-->
                      <vs-button class="ml-1 mt-5 p-3" color="warning" icon="save" @click="openConfirmarAnular()">Anular pedido</vs-button>
                    </div>
                  </div>
                </div>
            </div>
        </vx-card>
        <!--modal exportar-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
         </vs-prompt>
    </div>
</template>
<script>
import $ from 'jquery'
import TableSelectInstitucionVue from '../../../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue';
export default{
    data(){
        return{
            usuario:[],
            arregloObsequios:[],
            vReal:0,
            contrato:'',
            porcentajeObsequio:0,
            descuentoEscuela:0,
            maximo_porcentaje_autorizado:0,
            total_gastado:0,
            valor_obsequios:0,
            valueAvaible:0,
            institucion_id:0,
            nombreInstitucion:'',
            error:false,
            statusPeriodo:0,
            msgError:'!No hay valores de obsequios',
            inputs: [{
                id:0,
                cantidad:'',
                descripcion:'',
                especificacion:'',
            }],
            changeValues:false,
            //aprobacion
            observacion_facturador: '',
            counterDanger: false,
            estado:0,
            mostrarContainer:true,
            //fin aprobacion
            //variables export
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            fileName:null,
            selectedFormat: 'xls',
            cellAutoWidth: true,
            activePrompt: false,
            ObjectSelected:'',
            //fin variables export
        }
    },
    components:{
        TableSelectInstitucionVue,
    },
    props:{
        pedido:{
            type:Object,
            default:{},
        },
        arregloPeriodo:{
            type:Object,
            default:{},
        },
        periodo_id:{
            type:String,
            default:"0",
        },
        id:{
            type:Number,
            default:0,
        },
        userAdmin:{
          type:Boolean,
          default:false,
        },
        userRoot:{
          type:Boolean,
          default:false,
        },
        userAsesor:{
          type:Boolean,
          default:false,
        },
        userFacturador:{
          type:Boolean,
          default:false,
        }
    },
    watch:{
        valueAvaible(results){
            let me = this;
            if(results == 0 || results < 1){
              me.mostrarContainer = false
                if(me.usuario.id_group == 1)  { me.changeValues = true }
                else                          { me.changeValues = false }

            }else{
                if(me.usuario.id_group == 11 || me.usuario.id_group == 1 || me.usuario.id_group == 22 || me.usuario.id_group == 23){
                    me.changeValues = true
                }else{
                    me.changeValues = false
                }
                me.mostrarContainer = true
            }
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        //comentario facturador
        me.observacion_facturador = me.pedido.observacion_facturador
        me.ObjectSelected         = me.pedido
        if(me.id > 0){
          if(me.userRoot || me.userAdmin) { me.changeValues = true }
          me.getPedido()
          me.institucion_id = me.pedido.institucion_id
          me.getInfoPedidoInstitucion()
        }
    },
    computed:{
        SumaObsequios(){
            let me              = this;
            let preCalculo2     = ((me.vReal * me.porcentajeObsequio)/100)
            me.valor_obsequios  =  ((me.vReal * me.porcentajeObsequio)/100)
            me.valueAvaible     = preCalculo2 - me.total_gastado
            return preCalculo2
        },
    },
    methods:{
      openConfirmarAnular(){
        let me = this;
        this.$vs.dialog({
          type: 'confirm',
          color: 'danger',
          title: 'Anular pedido',
          text: '¿Está seguro que desea anular el pedido?',
          acceptText: 'Aceptar',
          accept: () => {
            me.anularPedido()
          }
        })
      },
      anularPedido(){
        let me = this;
        if(me.ObjectSelected.comentario_anulado == null || me.ObjectSelected.comentario_anulado == ''){
          me.$vs.notify({
            title: 'Error',
            text: 'Debe ingresar un comentario para anular el pedido',
            color: 'danger',
          })
          return
        }
        let data = {
          id:me.pedido.id,
          comentario_anulado:me.ObjectSelected.comentario_anulado,
          anularPedido:1,
          user_created:me.usuario.idusuario
        }
        this.$http.post(this.$server_url+'metodosPostObsequios',data)
        .then(function (res) {
          if(res.data.status == 0){
            me.$vs.notify({
              title: 'Error',
              text: res.data.message,
              color: 'danger',
              position: 'top-right'
            })
            return
          }
          me.$vs.notify({
            title: 'Correcto',
            text: 'Pedido anulado correctamente',
            color: 'success',
            position: 'top-right'
          })
          me.$emit('changeRecharge',true)
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
      },
      filtrarDecimal(numero){
          let me = this
          if(numero == 0){
              return numero
          }else{
              const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              return transformar
          }
      },
      getPedido(){
          let me = this;
          me.inputs = []
          this.$http.get(this.$server_url+'obsequio/'+me.id)
          .then(function (res) {
              let datos = res.data.detalle
              if(datos.length > 0){
                  datos.forEach(element => {
                  var cal                 = new Object();
                  cal.id                  = element.id
                  cal.valor_obsequios     = res.data.pedido[0].valor_obsequios
                  cal.obsequios_id        = element.obsequios_id
                  cal.cantidad            = element.cantidad
                  cal.descripcion         = element.descripcion
                  cal.especificacion      = element.especificacion
                  cal.created_at          = element.created_at
                  cal.updated_at          = element.updated_at
                  cal.asesor              = me.pedido.asesor
                  cal.asesor              = me.pedido.asesor
                  cal.nombreInstitucion   = me.pedido.nombreInstitucion
                  cal.ciudad              = me.pedido.ciudad
                  cal.periodo             = me.pedido.periodo
                  me.inputs.push(cal)
                  });
              }
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
      },
      changeHandle(e){
          let me = this
          me.descuentoEscuela                 = 0
          me.porcentajeObsequio               = 0
          me.total_gastado                    = 0
          me.contrato                         = ''
          me.vReal                            = 0
          me.valueAvaible                     = 0
          me.valor_obsequios                  = 0
          me.inputs= [{
              id:0,
              cantidad:'',
              descripcion:'',
              especificacion:'',
          }]
          // me.institucion_id                   = 0
          me.msgError =  '!No hay valores de obsequios'
          // $('#containerH').css('display', 'none');
          me.mostrarContainer = false
          if(me.userRoot || me.userAdmin)                     { me.changeValues = true }
          else                                { me.changeValues = false }
          let valor = e.change
          if(valor == 'institucion')          me.institucion_id    = e.value
          if(valor == 'nombreInstitucion')    me.nombreInstitucion = e.value
          if(valor == 'noPeriodo')            me.error             = e.value
          if(valor == 'periodo')              me.statusPeriodo     = e.value
          if(me.institucion_id > 0){
              me.getInfoPedidoInstitucion()
          }
      },
      getInfoPedidoInstitucion(){
        let me = this;
        this.$http.get(this.$server_url+'obsequio?institucionPedido=yes&institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id)
            .then(function (res) {
                console.log("uno",res.data)
                if(res.data.status == 0){
                    me.msgError =  res.data.message
                }else{
                    me.msgError =  '!No hay valores de obsequios'
                }
                let datos = res.data
                if( datos.length > 0 ){
                    me.maximo_porcentaje_autorizado = datos[0].maximo_porcentaje_autorizado
                    let porcentaje_obsequio         = datos[0].porcentaje_obsequio
                    console.log("porcentaje_obsequio",porcentaje_obsequio)
                    //porcentaje maximo - 5% de obsequios
                    let preMaximoDescuento = me.maximo_porcentaje_autorizado - porcentaje_obsequio
                    console.log("preMaximoDescuento",preMaximoDescuento)
                    me.vReal             = datos[0].veN_VALOR
                    me.total_gastado     = datos[0].total_gastado
                    me.descuentoEscuela  = datos[0].veN_DESCUENTO
                    me.contrato          = datos[0].veN_CODIGO
                    //si la comision de la escuela supera el maximo porcentaje de descuento
                    if( me.descuentoEscuela >= me.maximo_porcentaje_autorizado ){
                        me.porcentajeObsequio = 0
                        me.msgError =  'La escuela supera el porcentaje de descuento permitido de '+me.maximo_porcentaje_autorizado+'%'
                        // me.mostrarContainer   = true
                        // $('#containerH').css('display', 'block');
                        return
                    }
                    if( me.descuentoEscuela <= preMaximoDescuento ){
                        me.porcentajeObsequio = porcentaje_obsequio
                        me.mostrarContainer   = true
                        return
                    }else{
                        let resultado = 0
                        resultado             = me.maximo_porcentaje_autorizado - me.descuentoEscuela
                        me.porcentajeObsequio = resultado
                        me.mostrarContainer   = true
                        return
                    }
                }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        openConfirm(){
            let me = this
            let valCantidad     = []
            let ValDescripcion  = []
            valCantidad         = me.inputs.filter(p => (p.cantidad == 0 || p.cantidad == "" || p.cantidad < 0 ))
            ValDescripcion      = me.inputs.filter(p => (p.descripcion == '' || p.descripcion == null || p.descripcion < undefined ))
            if(valCantidad.length > 0){
                me.$vs.notify({
                text:'Complete todos los campos o elimine los registros vacios',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check',
                time:6000,
                })
                return false;
            }
            if(ValDescripcion.length > 0){
                me.$vs.notify({
                text:'Campo descripción obligatorio llene por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check',
                time:4000,
                })
                return false;
            }
            if(me.error && me.id == 0){
                me.$vs.notify({
                text:'La institución no tiene período',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.periodo_id <= 0 && me.id == 0){
                me.$vs.notify({
                text:'Seleccione una período por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            if(me.institucion_id <= 0){
                me.$vs.notify({
                text:'Seleccione una institución por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            if(me.statusPeriodo == 0 && me.id == 0){
                me.$vs.notify({
                text:'La institución tiene período inactivo, consulte con el administrador por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            this.$vs.dialog({
                type:'confirm',
                color: 'warning',
                acceptText:'Si deseo guardar',
                cancelText:'Cancelar',
                title: `Confirmar`,
                text: 'Estás seguro de guardar el pedido?',
                accept:this.saveOrder
            })
        },
        saveOrder(){
            let me = this
            let formData = new FormData();
            formData.append('id',                   me.id)
            formData.append('institucion_id',       me.institucion_id);
            formData.append('periodo_id',           me.periodo_id);
            formData.append('asesor_id',            me.usuario.idusuario);
            formData.append('data_obsequios',       JSON.stringify(me.inputs))
            formData.append('maximo_porcentaje_autorizado',me.maximo_porcentaje_autorizado)
            me.$vs.loading()
            this.$http.post(this.$server_url+'obsequio', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                me.$emit('changeRecharge',true)
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        add(k) {
            let me = this;
            this.inputs.push({
                id:0,
                cantidad: '',
                descripcion: '',
                especificacion:''
            })
        },
        remove(index) {
            let me = this;
            let preId = 0
            preId = this.inputs[index].id
            if (preId > 0) {
                let formData = new FormData();
                formData.append('id', preId)
                this.$http.post(this.$server_url+'deleteDetalleObsequio', formData)
                .then(res => {
                    this.inputs.splice(index, 1)
                })
            }else{
                this.inputs.splice(index, 1)
            }
        },
        //======METODOS PARA APROBAR===========
        openConfirmarAprobar(tip){
            let me = this;
            me.estado = 0
            me.estado = tip
            let message = tip == 3 ? 'aprobar' : 'anular'
            this.$vs.dialog({
                type:'confirm',
                color: 'warning',
                acceptText:`Si deseo ${ message }`,
                cancelText:'Cancelar',
                title: `Confirmar`,
                text: `Estás seguro de ${ message } el pedido de obsequios?`,
                accept:this.TypechangeEstado
            })
        },
        TypechangeEstado(){
            let me = this
            let formData = new FormData();
            formData.append('id',                       me.pedido.id);
            formData.append('estado',                   me.estado);
            formData.append('id_facturador',            me.usuario.idusuario)
            formData.append('observacion_facturador',   me.observacion_facturador)
            formData.append('valor_real_actual',        me.vReal)
            formData.append('comision_escuela',         me.descuentoEscuela)
            formData.append('porcentaje_obsequio',      me.porcentajeObsequio)
            formData.append('valor_obsequios',          me.valor_obsequios)
            formData.append('valor_disponible',         me.valueAvaible)
            me.$vs.loading()
            this.$http.post(this.$server_url+'changeEstadoObsequio', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                    text:res.data.message,
                    color:'danger',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                me.$emit('changeRecharge',true)
                me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'
                })
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        limpiar(){
            let me = this
            me.contrato = ''
        },
        //======FIN METODOS PARA APROBAR==============
        //========METODOS EXPORTAR EXCEL==============
        //para importar a excel
        exportToExcel() {
            let me = this;
            //this.fileName   = 'Obsequios_'+me.pedido.nombreInstitucion +'_'+me.pedido.periodo
            let headerTitle = ['Escuela','Ciudad','Asesor', 'Cantidad', 'Descripción', 'Especificación','Período','valor total para obsequios'];
            let headerVal = ['nombreInstitucion','ciudad','asesor', 'cantidad','descripcion', 'especificacion','periodo','valor_obsequios'];
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, this.inputs)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
            //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //========FIN METODOS PARA EXPORTAR EXCEL=====
    }
}
</script>

