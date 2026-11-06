<template>

    <div class="carousel"  @keydown="checkSlide($event)" tabindex="0">
        <slot></slot>
        
       
        <!-- <vs-button size="small" icon-pack="feather" class="btn btn-next" icon="icon-arrow-right"  color="primary" @click.prevent="next"></vs-button> -->
        
         
         <!-- <vs-button size="small" icon-pack="feather" class="btn btn-prev" icon="icon-arrow-left"  color="primary" @click.prevent="prev"></vs-button> -->
        <button @click.prevent="next" class="btn btn-next"><i class="fa fa-angle-right"></i></button>
        <button @click.prevent="prev" class="btn btn-prev"><i class="fa fa-angle-left"></i></button>
        
    </div>
</template>
<script>
export default {
    data () {
        return {
            index : 0,
            slides : [],
            slideDirection: '',
        }
    },
    computed: {
        slidesLength() {
            return this.slides.length;
        }
    },
    mounted(){
        this.slides = this.$children;
        this.slides.map( (slide,index) => {
            slide.index = index;
        });

        this.sayHi()
    },
    methods: {
        
        next(){
            this.index++;
            if(this.index >= this.slidesLength){
                this.index = 0;
            }
            this.slideDirection = 'slide-right';
        },
        prev(){
            this.index--;
            if(this.index < 0){
                this.index = this.slidesLength - 1;
            }
             this.slideDirection = 'slide-left';
        },
        
        checkSlide(event){
            if(event.keyCode === 39){
                this.next();
            }else if (event.keyCode === 37){
                this.prev();
            }else {
                return;
            }
        },
         sayHi() {
          let me = this;
            setInterval(function () {
               
                me.next();
            }, 3000)
         },
         
    }
}
</script>
<style>
    
</style>