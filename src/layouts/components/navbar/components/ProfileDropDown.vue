<template>
<div class="the-navbar__user-meta flex items-center" v-if="usuario.nombres">

    <div class="text-right leading-tight hidden sm:block">
        <p class="font-semibold text-white">{{ usuario.nombres }}</p>
        <p class="font-semibold text-white">{{ usuario.apellidos }}</p>
        <small v-if="usuario.id_group == 1" >Administrador</small>
        <small v-if="usuario.id_group == 4" >Estudiante</small>
        <small v-if="usuario.id_group == 5" >PostVenta</small>
        <small v-if="usuario.id_group == 6" >Docente</small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

        <div class="con-img ml-3">
            <img v-if="usuario.foto_user == 'default.png' " key="onlineImg" :src="activeUserInfo.photoURL" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
            <img v-else key="onlineImg" :src="$data_url+'archivos/'+'perfil/'+usuario.foto_user" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
        </div>

        <vs-dropdown-menu class="vx-navbar-dropdown">
            <ul style="min-width: 9rem">
                 <li v-if="usuario.id_group ==18 || usuario.id_group ==19">

                </li>
                <li v-else class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="perfil">
                    <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
                    <span class="ml-2">Perfil</span>
                </li>

                <!-- <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Inbox</span>
          </li>
          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Tasks</span>
          </li>
          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li>
          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="HeartIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Wish List</span>
          </li>
          <vs-divider class="m-1" /> -->

                <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white" @click="logout">
                    <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
                    <span class="ml-2">Salir</span>
                </li>
            </ul>
        </vs-dropdown-menu>
    </vs-dropdown>
</div>
</template>

<script>
export default {
    data() {
        return {
            usuario: []
        }
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.AppActiveUser
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        async logout() {
            let me = this;
            if(me.usuario.id_group == 18 || me.usuario.id_group == 19 || me.usuario.id_group == 20 || me.usuario.id_group == 21){
                 this.$router.push('/northospital');
                localStorage.clear();

                location.reload();
            }
            if(me.usuario.id_group == 16){
                 this.$router.push('/docente/ingreso');
                localStorage.clear();
                location.reload();
                return
            }
            else{
                await this.$store.dispatch('logout')
                this.$router.push('/');
            }

        },
        perfil() {
            this.$router.push('/perfil');
        }
    }
}
</script>
