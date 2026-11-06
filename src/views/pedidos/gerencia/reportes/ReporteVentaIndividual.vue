<template>
    <div v-if="arregloVenta.length > 0">
        <div>
            <ul class="flex ml-5 mt-1">
                <li>
                <vs-radio v-model="tipo"  class="ml-2" vs-name="radios1tipo" vs-value="0">Contratos</vs-radio>
                </li>
                <li>
                <vs-radio class="ml-2" v-model="tipo" vs-name="radios1tipo" vs-value="1">Sin contratos</vs-radio>
                </li>
            </ul>
        </div>
        <div class="flex" style="flex-wrap: wrap;">
            <!--TODO BRUTA-->
            <div class="p-6 pb-0">
                <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
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
                <div class="truncate"><h2 class="mb-1 font-bold">{{ filtrarDecimal(arregloVenta[0].todoBruta) }}</h2><span>Venta bruta Total</span></div>
            </div>
            <!--TODO NETA-->
            <div class="p-6 pb-0">
                <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                    <svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                            width="24px" height="24px" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
                        <g>
                            <path fill="#F9EBB2" d="M56,62H10c-2.209,0-4-1.791-4-4s1.791-4,4-4h46V62z"/>
                            <g>
                                <path fill="#45AAB8" d="M6,4v49.537C7.062,52.584,8.461,52,10,52h2V2H8C6.896,2,6,2.896,6,4z"/>
                                <path fill="#45AAB8" d="M56,2H14v50h42h2v-2V4C58,2.896,57.104,2,56,2z"/>
                            </g>
                            <g>
                                <path fill="#394240" d="M60,52V4c0-2.211-1.789-4-4-4H8C5.789,0,4,1.789,4,4v54c0,3.313,2.687,6,6,6h49c0.553,0,1-0.447,1-1
                                    s-0.447-1-1-1h-1v-8C59.104,54,60,53.104,60,52z M6,4c0-1.104,0.896-2,2-2h4v50h-2c-1.539,0-2.938,0.584-4,1.537V4z M56,62H10
                                    c-2.209,0-4-1.791-4-4s1.791-4,4-4h46V62z M56,52H14V2h42c1.104,0,2,0.896,2,2v46v2H56z"/>
                                <path fill="#394240" d="M43,26H23c-0.553,0-1,0.447-1,1s0.447,1,1,1h20c0.553,0,1-0.447,1-1S43.553,26,43,26z"/>
                                <path fill="#394240" d="M49,20H23c-0.553,0-1,0.447-1,1s0.447,1,1,1h26c0.553,0,1-0.447,1-1S49.553,20,49,20z"/>
                                <path fill="#394240" d="M23,16h12c0.553,0,1-0.447,1-1s-0.447-1-1-1H23c-0.553,0-1,0.447-1,1S22.447,16,23,16z"/>
                            </g>
                            <path opacity="0.2" fill="#231F20" d="M6,4v49.537C7.062,52.584,8.461,52,10,52h2V2H8C6.896,2,6,2.896,6,4z"/>
                        </g>
                    </svg>
                </span>
                <div class="truncate"><h2 class="mb-1 font-bold">{{ filtrarDecimal(arregloVenta[0].todoNeta) }}</h2><span>Venta neta Total</span></div>
            </div>
            <!--VENTA BRUTA CONTRATOS-->
            <div class="p-6 pb-0" v-if="tipo == 0">
                <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                    <svg fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	                viewBox="0 0 482.14 482.14" xml:space="preserve">
                            <g>
                        <path d="M302.597,0H108.966C80.66,0,57.651,23.026,57.651,51.315v379.509c0,28.289,23.009,51.316,51.315,51.316h264.206
                            c28.273,0,51.316-23.026,51.316-51.316V121.449L302.597,0z M373.172,450.698H108.966c-10.97,0-19.89-8.905-19.89-19.874V51.315
                            c0-10.953,8.92-19.858,19.89-19.858l181.874-0.188v67.217c0,19.653,15.949,35.604,35.587,35.604l65.878-0.189l0.727,296.925
                            C393.032,441.793,384.142,450.698,373.172,450.698z"/>
                        <path d="M232.497,91.228c0-4.654-3.774-8.429-8.429-8.429h-97.47c-4.655,0-8.429,3.775-8.429,8.429v97.459
                            c0,4.654,3.774,8.429,8.429,8.429h97.47c4.655,0,8.429-3.774,8.429-8.429V91.228z"/>
                        <path d="M232.497,412.747c0,4.656,3.774,8.43,8.429,8.43h113.587c4.655,0,8.429-3.773,8.429-8.43V323.47
                            c0-4.655-3.774-8.429-8.429-8.429H240.926c-4.655,0-8.429,3.774-8.429,8.429V412.747z M256.703,339.249h82.033v57.723h-82.033
                            V339.249z"/>
                        <path d="M344.111,216.862H131.629c-6.683,0-12.103,5.421-12.103,12.104c0,6.683,5.421,12.104,12.103,12.104h212.482
                            c6.683,0,12.103-5.421,12.103-12.104C356.214,222.283,350.793,216.862,344.111,216.862z"/>
                        <path d="M260.739,192.654h83.372c6.683,0,12.103-5.421,12.103-12.104c0-6.683-5.421-12.104-12.103-12.104h-83.372
                            c-6.684,0-12.105,5.421-12.105,12.104C248.634,187.233,254.055,192.654,260.739,192.654z"/>
                        <path d="M344.111,265.277H131.629c-6.683,0-12.103,5.421-12.103,12.104c0,6.683,5.421,12.104,12.103,12.104h212.482
                            c6.683,0,12.103-5.421,12.103-12.104C356.214,270.698,350.793,265.277,344.111,265.277z"/>
                        <path d="M198.863,313.693h-67.233c-6.683,0-12.103,5.421-12.103,12.104c0,6.684,5.421,12.104,12.103,12.104h67.233
                            c6.683,0,12.105-5.421,12.105-12.104C210.967,319.114,205.546,313.693,198.863,313.693z"/>
                        <path d="M198.863,362.109h-67.233c-6.683,0-12.103,5.421-12.103,12.103c0,6.683,5.421,12.104,12.103,12.104h67.233
                            c6.683,0,12.105-5.421,12.105-12.104C210.967,367.53,205.546,362.109,198.863,362.109z"/>
                    </g>
                    </svg>
                </span>
                <div class="truncate"><h2 class="mb-1 font-bold">{{ filtrarDecimal(arregloVenta[0].brutaContratos) }}</h2><span>Venta bruta contratos</span></div>
            </div>
            <!--VENTA NETA CONTRATOS-->
            <div class="p-6 pb-0" v-if="tipo == 0">
                <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                    <svg height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 370.32 370.32" xml:space="preserve">
                        <g>
                            <path style="fill:#020202;" d="M320.816,63.219L261.94,4.339C259.156,1.561,255.39,0,251.457,0H74.271
                                C58.219,0,45.16,13.06,45.16,29.112v312.095c0,16.053,13.059,29.113,29.111,29.113h221.777c16.052,0,29.111-13.06,29.111-29.113
                                V73.703C325.16,69.769,323.6,65.998,320.816,63.219z M293.547,337.907H76.773V32.414h154.088v43.577
                                c0,10.554,8.554,19.106,19.105,19.106h43.58V337.907z"/>
                            <path style="fill:#020202;" d="M103.827,149.16c0,8.284,6.716,15,15,15h132.667c8.284,0,15-6.716,15-15s-6.716-15-15-15H118.827
                                C110.542,134.16,103.827,140.876,103.827,149.16z"/>
                            <path style="fill:#020202;" d="M251.494,224.16H118.827c-8.284,0-15,6.716-15,15s6.716,15,15,15h132.667c8.284,0,15-6.716,15-15
                                S259.778,224.16,251.494,224.16z"/>
                        </g>
                    </svg>
                </span>
                <div class="truncate"><h2 class="mb-1 font-bold">{{ filtrarDecimal(arregloVenta[0].NetaContratos) }}</h2><span>Venta neta contratos</span></div>
            </div>
            <!--VENTA BRUTA SIN CONTRATOS-->
            <div class="p-6 pb-0" v-if="tipo == 1">
                <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                    <svg fill="#000000" height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	                viewBox="0 0 482.14 482.14" xml:space="preserve">
                            <g>
                        <path d="M302.597,0H108.966C80.66,0,57.651,23.026,57.651,51.315v379.509c0,28.289,23.009,51.316,51.315,51.316h264.206
                            c28.273,0,51.316-23.026,51.316-51.316V121.449L302.597,0z M373.172,450.698H108.966c-10.97,0-19.89-8.905-19.89-19.874V51.315
                            c0-10.953,8.92-19.858,19.89-19.858l181.874-0.188v67.217c0,19.653,15.949,35.604,35.587,35.604l65.878-0.189l0.727,296.925
                            C393.032,441.793,384.142,450.698,373.172,450.698z"/>
                        <path d="M232.497,91.228c0-4.654-3.774-8.429-8.429-8.429h-97.47c-4.655,0-8.429,3.775-8.429,8.429v97.459
                            c0,4.654,3.774,8.429,8.429,8.429h97.47c4.655,0,8.429-3.774,8.429-8.429V91.228z"/>
                        <path d="M232.497,412.747c0,4.656,3.774,8.43,8.429,8.43h113.587c4.655,0,8.429-3.773,8.429-8.43V323.47
                            c0-4.655-3.774-8.429-8.429-8.429H240.926c-4.655,0-8.429,3.774-8.429,8.429V412.747z M256.703,339.249h82.033v57.723h-82.033
                            V339.249z"/>
                        <path d="M344.111,216.862H131.629c-6.683,0-12.103,5.421-12.103,12.104c0,6.683,5.421,12.104,12.103,12.104h212.482
                            c6.683,0,12.103-5.421,12.103-12.104C356.214,222.283,350.793,216.862,344.111,216.862z"/>
                        <path d="M260.739,192.654h83.372c6.683,0,12.103-5.421,12.103-12.104c0-6.683-5.421-12.104-12.103-12.104h-83.372
                            c-6.684,0-12.105,5.421-12.105,12.104C248.634,187.233,254.055,192.654,260.739,192.654z"/>
                        <path d="M344.111,265.277H131.629c-6.683,0-12.103,5.421-12.103,12.104c0,6.683,5.421,12.104,12.103,12.104h212.482
                            c6.683,0,12.103-5.421,12.103-12.104C356.214,270.698,350.793,265.277,344.111,265.277z"/>
                        <path d="M198.863,313.693h-67.233c-6.683,0-12.103,5.421-12.103,12.104c0,6.684,5.421,12.104,12.103,12.104h67.233
                            c6.683,0,12.105-5.421,12.105-12.104C210.967,319.114,205.546,313.693,198.863,313.693z"/>
                        <path d="M198.863,362.109h-67.233c-6.683,0-12.103,5.421-12.103,12.103c0,6.683,5.421,12.104,12.103,12.104h67.233
                            c6.683,0,12.105-5.421,12.105-12.104C210.967,367.53,205.546,362.109,198.863,362.109z"/>
                    </g>
                    </svg>
                </span>
                <div class="truncate"><h2 class="mb-1 font-bold">{{ filtrarDecimal(arregloVenta[0].brutaSinContrato) }}</h2><span>Venta bruta sin contratos</span></div>
            </div>
            <!--VENTA NETA SIN CONTRATOS-->
            <div class="p-6 pb-0" v-if="tipo == 1">
                <span class="p-3 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                    <svg height="24px" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                            viewBox="0 0 370.32 370.32" xml:space="preserve">
                        <g>
                            <path style="fill:#020202;" d="M320.816,63.219L261.94,4.339C259.156,1.561,255.39,0,251.457,0H74.271
                                C58.219,0,45.16,13.06,45.16,29.112v312.095c0,16.053,13.059,29.113,29.111,29.113h221.777c16.052,0,29.111-13.06,29.111-29.113
                                V73.703C325.16,69.769,323.6,65.998,320.816,63.219z M293.547,337.907H76.773V32.414h154.088v43.577
                                c0,10.554,8.554,19.106,19.105,19.106h43.58V337.907z"/>
                            <path style="fill:#020202;" d="M103.827,149.16c0,8.284,6.716,15,15,15h132.667c8.284,0,15-6.716,15-15s-6.716-15-15-15H118.827
                                C110.542,134.16,103.827,140.876,103.827,149.16z"/>
                            <path style="fill:#020202;" d="M251.494,224.16H118.827c-8.284,0-15,6.716-15,15s6.716,15,15,15h132.667c8.284,0,15-6.716,15-15
                                S259.778,224.16,251.494,224.16z"/>
                        </g>
                    </svg>
                </span>
                <div class="truncate"><h2 class="mb-1 font-bold">{{ filtrarDecimal(arregloVenta[0].NetaSinContrato) }}</h2><span>Venta neta sin contratos</span></div>
            </div>
        </div>
        <!--MODALES-->
    </div>
</template>
<script>

export default{
    data(){
        return{
            arregloVenta:[],
            usuario:[],
            tipo:0,
            id_periodo:0,
            nombre_periodo:'',
            popupVerContratos:false,
            arregloContratos: []
        }
    },
    components:{
       // VerContratosFacturacionVue,
    },
    created(){
        let me = this;
        this.id_periodo = this.$route.params.id
        this.nombre_periodo = this.$route.params.label
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this
        me.getValores()
    },
    methods:{
        filtrarDecimal(numero){
            let me = this
            if(numero == 0){
                return numero
            }else{
                const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }
        },
        getValores(){
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporteVentaIndividual?periodo_id='+me.id_periodo+'&idusuario='+me.usuario.idusuario)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arregloVenta = []
                    me.arregloContratos = res.data.contratos
                    if(res.data.status == 0){
                        return
                    }
                    var arregloPredatos = []
                    var datos = []
                    datos = res.data
                    var cal = new Object();
                    let array              = datos.contratos
                    cal.brutaContratos     = array.reduce((a, b) => parseFloat(a) + parseFloat((b["VEN_VALOR"] || 0)), 0);
                    cal.NetaContratos      = array.reduce((a, b) => parseFloat(a) + parseFloat((b["ven_neta"] || 0)), 0);
                    cal.brutaSinContrato   = datos.sin_contratos[0].ventaBrutaActual
                    cal.NetaSinContrato    = datos.sin_contratos[0].ven_neta_actual     
                    arregloPredatos.push(cal)
                    //FILTRO 2 
                    let preFiltro = arregloPredatos[0]
                    var cal2 = new Object();
                    cal2.brutaContratos    = preFiltro.brutaContratos
                    cal2.NetaContratos     = preFiltro.NetaContratos
                    cal2.brutaSinContrato  = preFiltro.brutaSinContrato
                    cal2.NetaSinContrato   = preFiltro.NetaSinContrato
                    var brutaContratos = 0
                    //validate si fueran cero
                    if(preFiltro.brutaContratos != 0 || preFiltro.brutaContratos != '0') {
                        brutaContratos = preFiltro.brutaContratos.toFixed(2)
                    }
                    var brutaSinContrato = 0
                    if(preFiltro.brutaSinContrato != 0 || preFiltro.brutaSinContrato != '0') {
                        brutaSinContrato = preFiltro.brutaSinContrato.toFixed(2)
                    }
                    var NetaContratos = 0
                    if(preFiltro.NetaContratos != 0 || preFiltro.NetaContratos != '0') {
                        NetaContratos = preFiltro.NetaContratos.toFixed(2)
                    }
                    var NetaSinContrato = 0
                    if(preFiltro.NetaSinContrato != 0 || preFiltro.NetaSinContrato != '0') {
                        NetaSinContrato = preFiltro.NetaSinContrato.toFixed(2)
                    }
                    //FIN VALIDATE SI FUERAN CERO
                    cal2.todoBruta         = parseFloat(brutaContratos) + parseFloat(brutaSinContrato)
                    cal2.todoNeta          = parseFloat(NetaContratos) + parseFloat(NetaSinContrato)
                    me.arregloVenta.push(cal2)
                    var resultado = []
                    resultado.push(cal2)
                    me.arregloVenta = resultado
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        }
    }
}
</script>