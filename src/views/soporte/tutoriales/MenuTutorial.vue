<template>
    <vx-card>
        <div class="vx-row mt-2">
            <div class="vx-col md:w-1/4 w-full mb-3 flex sidebar-left">
                <div v-if="usuario.id_group == 1 || usuario.id_group == 6" class="text-center p-2 tituloMenu" @click="menu = 1">Crear Tutorial</div>
                <p class="subtema">Grupos</p>
                <div class="flex mt-3 font-hairline" style="justify-content: space-around;">
                    <div style="width: 60%;">
                        <i class="fa-regular fa-file" style="font-size: 11px;"></i> <span class="ml-3 c_opciones">Todos</span>
                    </div>
                    <div style="width: 40%;" class="flex justify-end" >
                        <span @click="turno = 4;filtroTipo();" style="background-color: var(--colorverde);max-height: 18px;" class="c_cantidad">10</span>
                    </div>
                </div>
                <div class="flex mt-3 font-hairline" style="justify-content: space-around;">
                    <div style="width: 60%;">
                        <i class="fa-solid fa-ruler" style="font-size: 11px;"></i> <span class="ml-3 c_opciones">Docentes</span>
                    </div>
                    <div style="width: 40%;" class="flex justify-end" >
                        <span style="background-color: #3EA0EA;" @click="turno = 1;filtroTipo();" class="c_cantidad">12</span>
                    </div>
                </div>
                <div class="flex mt-3 font-hairline" style="justify-content: space-around;">
                    <div style="width: 60%;">
                        <i class="fa-solid fa-user" style="font-size: 11px;"></i> <span class="ml-3 c_opciones">Estudiantes</span>
                    </div>
                    <div style="width: 40%;" class="flex justify-end" >
                        <span @click="turno = 2;filtroTipo();" style="background-color: #F06060;max-height: 18px;" class="c_cantidad">15</span>
                    </div>
                </div>
                <div class="flex mt-3 font-hairline" style="justify-content: space-around;">
                    <div style="width: 60%;">
                        <i class="fa-brands fa-sellsy" style="font-size: 11px;"></i> <span class="ml-3 c_opciones">Asesores</span>
                    </div>
                    <div style="width: 40%;" class="flex justify-end" >
                        <span @click="turno = 3;filtroTipo();" style="background-color: #E8C65A;max-height: 18px;" class="c_cantidad">20</span>
                    </div>
                </div>
                <div class="flex mt-3 font-hairline" style="justify-content: space-around;">
                    <div style="width: 60%;">
                        <i class="fa-solid fa-school" style="font-size: 11px;"></i> <span class="ml-3 c_opciones">Directores</span>
                    </div>
                    <div style="width: 40%;" class="flex justify-end" >
                        <span @click="turno = 3;filtroTipo();" style="background-color: var(--azul);max-height: 18px;" class="c_cantidad">20</span>
                    </div>
                </div>
            </div>
            <div class="vx-col md:w-3/4 w-full flex">
                <!-- <ListadoComunicadosVue  :institucion_General="institucion_General" :arregloComunicaciones="tmparregloComunicaciones"  :totalTable="totalTable" v-if="menu == 0" @changeComunicados="changehandleUpdate" @changeOpen="changehandleOpenComunicado" class="fade-in"/>
                <CrearComunicadoVue     @changeUpdate="changehandleUpdate" :institucion_General="institucion_General"                                             v-if="menu == 1" class="fade-in"/>
                <VerComunicadoVue       @changeUpdate="changehandleUpdate" :institucion_General="institucion_General" :ComunicadoEnviar="ComunicadoEnviar"  v-if="menu == 2" class="fade-in"/> -->
            </div>
        </div>
    </vx-card>
</template>
<script>
import $ from 'jquery'
import vSelect from 'vue-select'
export default{
    data(){
        return{
            btnTipo:false,
            btnProfesores:false,
            btnMaterias:false,
            menu:0,
            instituciones:[],
            usuario:[],
            arregloComunicaciones:[],
            tmparregloComunicaciones:[],
            arregloMensajesDocentes:[],
            institucion_General:'',
            ComunicadoEnviar:{},
            //v listados
            totalTable:0,
            receptor_id:0,
            turno:0,
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this; 
    },
    components:{
        vSelect,
    },
    methods:{
        changehandleUpdate(e){
            let me = this;
            me.getComunicados()
            me.menu = 0
        },
        changehandleOpenComunicado(e){
            let me              = this
            me.ComunicadoEnviar = e.comunicado
            me.menu             = 2
        },
        getInstituciones(){
            let me = this;
            this.$http.get(this.$server_url + 'listaInsitucion?busqueda')
            .then(function (res) {
                me.instituciones = res.data;
                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                } 
                //incrustar la institucion del administrador por defecto
                let datos = me.instituciones.filter(p => p.idInstitucion == me.usuario.institucion_idInstitucion)
                me.institucion_General  = datos[0]
                me.getComunicados()
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        }, 
        setTeachers(tr){
            let me = this;
            let valores = []
            let p = new Promise(function(resolve,reject){
                if(tr.length){
                    resolve(tr)
                }else{
                    reject('No hay comunicados de profesores')
                }
            });
            p.then((res) => {
                let datos = res
                datos.forEach(element => {
                    var cal = new Object();
                    cal.docente      = element.emisor
                    cal.receptor_id  = element.user_created
                    valores.push(cal)
                });
                //obtener contador por docente
                let reducer = function(acc,valores){
                    acc[valores.docente] = (acc[valores.docente] || 0) +1;
                    return acc;
                }
                let filtro = valores.reduce(reducer,[])
                //setear valores
                const result = valores.map((obj) => {
                    obj["docenteContador"] = filtro[obj.docente];
                    return obj;
                });
                //quitar duplicados
                let hash = {};
                let resultado = result.filter(o => hash[o.docente] ? false : hash[o.docente] = true);
                me.arregloMensajesDocentes  = resultado
            }).catch((e) => {
                console.log(e)
            })  
        },
    }
}
</script>
<style lang="scss">
@import '@/assets/scss/general/general.scss';
.tituloMenu{
    margin-top: 25px;
    cursor: pointer;
    transition: 1s ease;
    background:#284DB4;color: white;font-weight: 400;border-radius: 5px;margin-top: 20px;
}
.subtema{
    font-weight: 600;
    margin-top: 25px;
}
.tituloMenu:hover{
    background-color: #1EB2FF;
}
.c_opciones{
    font-size: 11px;
    font-weight: 350;
}
.c_cantidad{
    color: white;
    font-size: 9px;
    border-radius: 5px;
    min-width: 25%;
    text-align: center;
    padding-top: 4px;
    cursor: pointer;
}
//SHOW / SHOW
.showTipo{
    display: flex;
    flex-wrap: wrap;
    transition: 1s ease all;
    opacity: 1;
    transform: translateY(0%);
}
.hideTipo{
    opacity: 0;
    position: relative;
    transition: 1s ease all;
    transform: translateY(-30%);
}
//fin hide/show
.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
    padding: 10px;
    border: 1px solid #f2f2f2;
    max-height: 90%;
    margin-top: -1px!important;
}
@keyframes fadeInOpacity {
    0% {
        transform: translateX(30%);
        opacity: 0;
    }
    50% {
        transform: translateX(10%);
        opacity: 0.5;
    }
    100% {
        opacity: 1;
        transform: translateX(0%);
    }
}
.sidebar-left{
    flex-direction: column;border: 1px solid #fff;  height: 800px;
}
/*RESPONSIVE*/
@media (max-width: 540px) {
    .sidebar-left{
        height: 100%;
    }
}
@media (max-width: 414px) {
    .sidebar-left{
        height: 100%;
    }
}
@media (max-width: 375px) {
    .sidebar-left{
        height: 100%;
    }
}
</style>