<template>
    <div>
        <div class="flex justify-end">
            <vs-button color="primary" v-if="activeMenu" style="position: relative;right: 15px;" icon="close" @click="activeMenu = false;" type="flat"></vs-button>
            <vs-button color="primary" v-if="activeMenu == false" style="position: relative;right: 15px;" icon="check" @click="activeMenu = true;" type="flat">Mostrar series</vs-button>
        </div>
        <div id="menuSerie">
            <div class="flex"  style="flex-wrap:wrap">
                <vs-button type="border"   icon="book" class="m-3" v-for="(tr,key) in arregloSeries" :key="key" @click="serie=tr;getBooks(tr)"> {{ capitalizarPrimeraLetra(tr.nombre_serie) }}</vs-button>
                <!-- <div style="border:1px solid #ccc;padding:3px;margin:3px;" v-for="(tr,key) in arregloSeries" :key="key" class="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/5 p-6 flex justify-between flex-row-reverse items-center">
                    <span  class="inline-flex rounded-full feather-icon select-none relative text-primary" style="background: rgba(var(--vs-primary),.15);border:1px solid #ccc;">
                        <svg fill="#000000" width="28px" height="28px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <title>book</title>
                        <path d="M30.728 18.612l-2.112-0.697 0.050 0.052-11.683 4.24-11.184-11.823-2.745-0.906c-1.386 0.981-1.541 3.774-0.61 4.746l13.805 14.19 14.602-5.228c-1.33-0.727-2.409-2.796-0.123-4.573zM15.474 22.441l-11.504-11.928h0.344l11.453 11.693-0.294 0.235zM16.353 27.987c0 0-1.592-1.86 0.471-4.334l12.501-4.527c0 0-1.438 2.469 0.245 3.927l-13.217 4.935zM5.799 10.384l-0.382-0.404 11.654-4.138 11.544 12.073 2.112 0.697c-0.010 0.008-0.020 0.016-0.030 0.024l0.246-0.088-13.623-14.125-14.212 5.072 2.69 0.888z"></path>
                        </svg>
                    </span>
                    <div class="truncate titleBook" @click="serie=tr;getBooks(tr)" style="border:1px solid #ccc;">
                        <h6 style="font-size: 11px;" class="mb-1 font-bold"> {{ capitalizarPrimeraLetra(tr.nombre_serie) }}</h6>
                    </div>
                </div> -->
            </div>
        </div>
        <vs-divider>Seleccionar libros:</vs-divider>
        <div v-if="arregloLibros.length > 0">
            <!--PLAN LECTOR-->
            <vs-table max-items="15" v-if="serie.id_serie == 6" stripe search pagination :data="arregloLibros">
                <template slot="header">
                    <vs-chip  color="primary"> {{ capitalizarPrimeraLetra(serie.nombre_serie) }} | Cantidad: <b class="ml-1"> {{ arregloLibros.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th style="background-color: #fff;border: 1px solid #f2f2f2;font-weight: bold;">Libros</vs-th>
                    <vs-th style="border: 1px solid #f2f2f2;font-weight: bold;" colspan="10"><p class="text-center">Niveles</p></vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td style="background-color: #ECF5F8;color:black;border: none;">
                            {{data[indextr].nombrelibro}}<br>
                        </vs-td>
                        <td> 
                            <vs-checkbox v-model="tr.selected" label="Checkbox" @change="removeItemFromArrPlanLector(arregloLibros,tr)" />
                        </td>
                    </vs-tr>
                </template>
            </vs-table>  
            <!--LIBROS NORMALES-->
            <vs-table max-items="15" v-else stripe search pagination :data="arregloLibros">
                <template slot="header">
                    <vs-chip  color="primary"> {{ capitalizarPrimeraLetra(serie.nombre_serie) }} | Cantidad: <b class="ml-1"> {{ arregloLibros.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th style="background-color: #fff;border: 1px solid #f2f2f2;font-weight: bold;">Área</vs-th>
                    <vs-th style="border: 1px solid #f2f2f2;font-weight: bold;" colspan="10"><p class="text-center">Niveles</p></vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td style="background-color: #ECF5F8;color:black;border: none;">
                            {{data[indextr].nombrearea}}<br>
                        </vs-td>
                        <td  v-for="(item,key) in tr.libros">
                            <div v-if="item.nivel > 0" class="flex">
                                <span>{{ item.nivel }}</span>
                                <vs-checkbox v-model="item.selected" label="Checkbox" @change="removeItemFromArr(arregloLibros,tr,item)" />
                            </div>
                        </td>
                    </vs-tr>
                </template>
            </vs-table>  
        </div>
        <div class="flex justify-center">
            <vs-button color="success" type="relief" @click="guardarLibros()">Guardar libros</vs-button>
        </div>
    </div>
</template>
<script>
export default{
    data(){
        return{
            arregloSeries:[],
            arregloLibros:[],
            arregloEnviar:[],
            serie:{},
            activeMenu:true,
        }
    },
    props:{
        periodo_id:{
            type:Number,
            default:0,
        },
        institucion_id:{
            type:Number,
            default:0,
        },
        docente_id:{
            type:Number,
            default:0,
        },
    },
    watch:{
        docente_id(results){
            let me = this;
            me.arregloLibros = []
        },
        activeMenu(results){
            let me = this;
            const container = document.querySelector("#menuSerie");
            if(results == true){
                container.classList.remove("removeMenu");
            }else{
                container.classList.add("removeMenu");
            }
        }
    },
    mounted(){
        let me = this;
        me.getSeries()
    },
    methods:{
        removeItemFromArr (arrLibros, arr,item) {
            let me = this
            //obtener la posicion en el arreglo de libros
            const i = arrLibros.indexOf(arr)
            //obtener la posiciones en el arreglo  de area
            const j = arr.libros.indexOf(item)
            me.arregloLibros[i].libros[j].formato = 1
            // arr.splice(i, 1)
        },
        removeItemFromArrPlanLector(arrLibros,item){
            let me = this
            //obtener la posicion en el arreglo de libros
            const i = arrLibros.indexOf(item)
            me.arregloLibros[i].formato = 1
        },
        //para obtener el listado de las series
        getSeries() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'series')
                .then(function (res) {
                    me.arregloSeries = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        capitalizarPrimeraLetra(cadena) {
            return cadena.charAt(0).toUpperCase() + cadena.slice(1);
        },
        getBooks(tr){
            let me = this;
            if(me.docente_id == 0){
                me.$vs.notify({
                text:'Seleccione un docente por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.periodo_id == 0){
                me.$vs.notify({
                text:'Seleccione un período por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.loading();
            var url = ""
            if(me.serie.id_serie == 6){
                url = this.$server_url+'registroDocente?areasxSeriePlanLector=yes&id_serie='+me.serie.id_serie+'&docente_id='+me.docente_id+'&periodo_id='+me.periodo_id
            }else{
                url = this.$server_url+'registroDocente?areasxSerie=yes&id_serie='+me.serie.id_serie+'&docente_id='+me.docente_id+'&periodo_id='+me.periodo_id
            }
            this.$http.get(url)
                .then(function (res) {
                    me.arregloLibros = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        // openConfirmBook(tr){
        //     let me = this;
        //     me.arregloEnviar = []
        //     let preEnviar    = []
        //     me.arregloLibros.forEach(element => {
        //         let valores = element.libros.filter(p => p.formato == 1)
        //         if(valores.length > 0){
        //             preEnviar.push(valores)
        //         }
        //     });
        //     me.arregloEnviar  = preEnviar.flat()
        //     if(me.arregloEnviar.length == 0){
        //         me.$vs.notify({
        //         text:'No estas realizando ningun cambio',
        //         color:'warning',
        //         iconPack: 'feather',
        //         icon:'icon-check'})
        //         return
        //     }
        //     this.$vs.dialog({
        //         type:'confirm',
        //         color: 'danger',
        //         acceptText:'Si, deseo asignar',
        //         cancelText:'Cancelar',
        //         title: `Confirmar`,
        //         text: 'Estás seguro de asignar estos libros al docente?',
        //         accept:this.guardarLibros
        //     })
        // },
        guardarLibros(){
            let me = this
            var envioDatos = []
            if(me.docente_id == 0){
                me.$vs.notify({
                text:'Seleccione un docente por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.periodo_id == 0){
                me.$vs.notify({
                text:'Seleccione un período por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.arregloEnviar = []
            let preEnviar    = []
            //PLAN LECTOR
            if(me.serie.id_serie == 6){
                preEnviar = me.arregloLibros.filter(p => p.formato == 1)
            }
            //LIBROS NORMALES
            else{
                me.arregloLibros.forEach(element => {
                    let valores = element.libros.filter(p => p.formato == 1)
                    if(valores.length > 0){
                        preEnviar.push(valores)
                    }
                });
            }
            me.arregloEnviar  = preEnviar.flat()
            if(me.arregloEnviar.length == 0){
                me.$vs.notify({
                text:'No estas realizando ningun cambio',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            //setear false - true del array
            me.arregloEnviar.forEach(element => {
                var cal             = new Object();
                // cal.nivel           = element.nivel
                cal.nombrelibro     = element.nombrelibro
                cal.idlibro         = element.idlibro
                cal.idasiguser      = element.idasiguser
                cal.idasignatura    = element.idasignatura
                cal.formato         = element.formato
                if(element.selected == true){
                    cal.selected    = 1     
                }else{
                    cal.selected    = 0   
                }
                envioDatos.push(cal)
            });
            let formData = new FormData();
            formData.append('docente',me.docente_id)
            formData.append('periodo',me.periodo_id)
            formData.append('data_libros', JSON.stringify(envioDatos));
            me.$vs.loading()
            this.$http.post(this.$server_url+'registroDocente', formData)
            .then(res => {
            me.$vs.loading.close()
            me.getBooks()
            me.$vs.notify({
                text:'Se asigno los libros correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch((e) =>{
                me.$vs.loading.close()
            })
        },
    }
}
</script>
<style scoped>
.titleBook{
    cursor: pointer;
}
.removeMenu{
    display: none!important;
}

</style>