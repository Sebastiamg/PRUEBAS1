<template>
<div class="h-screen flex w-full" id="page-login">
    <div class="w-full sm:m-0">
        <vx-card>
            <div slot="no-body" class="full-page-bg-color">
                <div class="vx-row">
                    <login-form v-if="status == true" v-on:status="resp"></login-form>
                    <div class="hidden h-screen lg:block lg:w-2/3 items-center">
                        <div class="app m-auto px-8 self-center h-full flex items-center">
                            <div class="">
                                <img src="@/assets/images/bexterno.svg" class="w-11/12" alt="login">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vx-card>
    </div>
</div>
</template>

<script>
import LoginForm  from "./login.vue";
export default {
    data() {
        return {
            status:true,
        }
    },
    components: {
      LoginForm,
    },
    mounted() {
        
    },
    methods: {
        
        resp(res){
          this.status = res
        }
    },
}
</script>

<style lang="scss">
.title {
    font-family: 'Montserrat';
    font-style: normal;
    color: #0E369E;
}

#page-login {
    .social-login-buttons {
        .bg-facebook {
            background-color: #1551b1
        }

        .bg-twitter {
            background-color: #00aaff
        }

        .bg-google {
            background-color: #4285F4
        }

        .bg-github {
            background-color: #333
        }
    }
}

/*Estilos del slider*/
.app {
    display: flex;
    justify-content: center;
}

.carousel {
    position: relative;
    overflow: hidden;
    width: 800px;
    height: 500px;
    z-index: 10;
}

.btn {
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid transparent;
    margin: 5px 10px;
    color: #FFF;
    height: 50px;
    width: 50px;
    position: absolute;
    margin-top: -25px;
    z-index: 2;
}

.btn:hover {
    cursor: pointer;
}

.btn:focus {
    outline: none;
}

.btn-next {
    top: 50%;
    right: 0;
}

.btn-prev {
    top: 50%;
    left: 0;
}

.carousel-slider {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.carousel-slider img {
    width: 100%;
    height: 100%;
}

.embed-responsive-item {
    width: 60% !important;
    margin: auto;
    height: 450px;
}
</style>
