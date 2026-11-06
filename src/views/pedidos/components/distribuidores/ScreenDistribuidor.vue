<template>
    <div>
        <!--MENU-->
        <nav class="breadcrumbs mt-3">
          <a href="#Distribuidores" class="breadcrumbs__item btnMenu activeBtn menu0" @click="filtro = 0;estadoMenu();">Listado Distribuidores</a>
          <a href="#Temporada-Distribuidor" class="breadcrumbs__item btnMenu menu1"   @click="filtro = 1;estadoMenu();">Temporadas Distribuidores</a>
          <a href="#Distribuidor-Movimientos" class="breadcrumbs__item btnMenu menu2"   @click="filtro = 2;estadoMenu();">Movimientos</a>
        </nav>
        <div v-if="filtro == 0">
            <ListadoDistribuidorVue
            :arregloDistribuidores="arregloDistribuidores"
            :usuario="usuario"
            @recharge="recharge"
            />
        </div>
        <div v-if="filtro == 1">
            <ListadoTemporadasDistribuidorVue
            :arregloDistribuidores="arregloDistribuidores"
            :usuario="usuario"
            @recharge="recharge"
            />
        </div>
         <div v-if="filtro == 2">
            <MovimientosDistribuidorVue
            :usuario="usuario"
            @recharge="recharge"
            />
        </div>
    </div>
</template>
<script>
import ListadoDistribuidorVue from './ListadoDistribuidor.vue';
import ListadoTemporadasDistribuidorVue from './ListadoTemporadasDistribuidor.vue';
import MovimientosDistribuidorVue from './componentes/MovimientosDistribuidor'
export default{
    components:{
        ListadoDistribuidorVue,
        ListadoTemporadasDistribuidorVue,
        MovimientosDistribuidorVue,
    },
    data(){
        return{
            filtro:0,
            arregloDistribuidores:[],
        }
    },
    created(){
        let me = this
        me.usuario              = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
        let me = this;
        me.getDistribuidores()
    },
    methods:{
        recharge(e){
            let me = this;
            if(e == 2) me.getDistribuidores()
        },
        getDistribuidores() {
            let me = this;
            me.$vs.loading()
            var url = ""
            url = this.$server_url + 'distribuidor?getDistribuidores=yes'
            this.$http.get(url)
                .then(res => {
                    me.$vs.loading.close()
                    me.arregloDistribuidores = res.data
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.loading.close()
                })
        },
        estadoMenu(){
            let me = this;
            localStorage.setItem('menuSelectDistribuidor',me.filtro)
            var divs = document.querySelectorAll(".btnMenu");
            for (var i = 0; i < divs.length; i++) {
                divs[i].classList.remove("activeBtn");
            }
            const container = document.querySelector(".menu"+me.filtro);
            container.classList.add("activeBtn");
        },
    }
}
</script>
<style scoped>
*{
  color:black;
}
  /*MENU*/
  .activeBtn{
    background-color: #1cbeb3;
    color: white!important;
  }
/**ESTILOS SUB MENU */
.breadcrumbs {
  border: 1px solid #cbd2d9;
  border-radius: 0.3rem;
  display: inline-flex;
  overflow: hidden;
}

.breadcrumbs__item {
outline: none;
padding: 0.75em 0.75em 0.75em 1.25em;
position: relative;
text-decoration: none;
transition: background 0.2s linear;
color:black;
}

.breadcrumbs__item:hover:after,
.breadcrumbs__item:hover {
background: #edf1f5;
}

.breadcrumbs__item:focus:after,
.breadcrumbs__item:focus,
.breadcrumbs__item.is-active:focus {
background: #1cbeb3;
color: #fff;
}

.breadcrumbs__item:after,
.breadcrumbs__item:before {
background: white;
bottom: 0;
clip-path: polygon(50% 50%, -50% -50%, 0 100%);
content: "";
left: 100%;
position: absolute;
top: 0;
transition: background 0.2s linear;
width: 1em;
z-index: 1;
}

.breadcrumbs__item:before {
background: #cbd2d9;
margin-left: 1px;
}

.breadcrumbs__item:last-child {
border-right: none;
}

.breadcrumbs__item.is-active {
background: #edf1f5;
}
</style>
