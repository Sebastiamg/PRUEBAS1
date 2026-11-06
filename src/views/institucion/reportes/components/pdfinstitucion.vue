<template>
    <div>
        <div>
         <vs-button color="danger" style="margin-left:20px;"  @click="reporte()" id="botonreporte" type="border" icon="folder"></vs-button>

              <div>
                <vs-list>
                <vs-list-header icon="supervisor_account" title="Visitas"></vs-list-header>
                <vs-list-item icon="check" title="Libros" :subtitle="recursos1insti"></vs-list-item>
                
                <vs-list-item icon="check" title="unidades" :subtitle="recursos2insti"></vs-list-item>
                
                <vs-list-item icon="check" title="cuadernos" :subtitle="recursos3insti"></vs-list-item>
                
                <vs-list-item icon="check" title="teletarea" :subtitle="recursos4insti"></vs-list-item>
                
                <vs-list-item icon="check" title="proyectos" :subtitle="recursos5insti"></vs-list-item>
                
                <vs-list-item icon="check" title="adaptaciones" :subtitle="recursos6insti"></vs-list-item>
                
                <vs-list-item icon="check" title="propuestas" :subtitle="recursos7insti"></vs-list-item>
                
                <vs-list-item icon="check" title="juegos" :subtitle="recursos8insti"></vs-list-item>
                
                <vs-list-item icon="check" title="material" :subtitle="recursos9insti"></vs-list-item>
                
                <vs-list-item icon="check" title="articulos" :subtitle="recursos10insti"></vs-list-item>
                
                <vs-list-item icon="check" title="tareas" :subtitle="recursos11insti"></vs-list-item>
                
                <vs-list-item icon="check" title="pdf guia" :subtitle="recursos12insti"></vs-list-item>
                
                <vs-list-item icon="check" title="pdf sin guia" :subtitle="recursos13insti"></vs-list-item>
                
                <vs-list-item icon="check" title="guia didactica" :subtitle="recursos14insti"></vs-list-item>
                </vs-list>
            </div> 
        </div>
      
    </div>
</template>

<script>
//para el reporte
import pdfMake from "pdfmake/build/pdfmake";
var pdfFonts = require ('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
    data(){
        return{
            filtro:[],
            nombreinstitucion:'',
            recursos1insti: "",
            recursos2insti: "",
            recursos3insti: "",
            recursos4insti: "",
            recursos5insti: "",
            recursos6insti: "",
            recursos7insti: "",
            recursos8insti: "",
            recursos9insti: "",
            recursos10insti: "",
            recursos11insti: "",
            recursos12insti: "",
            recursos13insti: "",
            recursos14insti: "",  
        }
    },
    methods:{
        
        //para generar el reporte
        reporte() {
             var docDefinition = {
            content: [
                
                {image: 'snow',   fit: [100, 100], alignment:'center'},
                {text:" "},
                {text:" "},
                { text: `Reporte de visitas de ${this.nombreinstitucion}`, bold: true, color:"red" ,alignment:'center',fontSize: 22},
                {text:" "},
                {text:" "},
                {text:"Visitas de recursos por institucion:"},
                {text:" "},
                {
                ul: [
                   
                      
                      { text: `libros :${this.recursos1insti}`, bold: false , color:"#2DADE8"  },
                      { text: `unidades :${this.recursos2insti}`, bold: false , color:"#2DADE8" },
                      { text: `cuadernos :${this.recursos3insti}`, bold: false , color:"#2DADE8" },
                      { text: `teletarea :${this.recursos4insti}`, bold: false , color:"#2DADE8" },
                      { text: `proyectos :${this.recursos5insti}`, bold: false , color:"#2DADE8" },
                      { text: `adaptaciones :${this.recursos6insti}`, bold: false , color:"#2DADE8" },
                      { text: `propuestas :${this.recursos7insti}`, bold: false , color:"#2DADE8" },
                      { text: `juegos :${this.recursos8insti}`, bold: false , color:"#2DADE8" },
                      { text: `material :${this.recursos9insti}`, bold: false , color:"#2DADE8" },
                      { text: `articulos :${this.recursos10insti}`, bold: false , color:"#2DADE8" },
                      { text: `tareas :${this.recursos11insti}`, bold: false , color:"#2DADE8" },
                      { text: `pdf guia :${this.recursos12insti}`, bold: false  , color:"#2DADE8" },
                      { text: `pdf sin guia :${this.recursos13insti}`, bold: false , color:"#2DADE8" },
                      { text: `guia didactica :${this.recursos14insti}`, bold: false , color:"#2DADE8" },
                     

              
                ]
                },
          
                

                
            ],
            //para colocar la imagen de prolipa
              images: {

                    snow: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHCBUUEhUTFRYXFxcZGR0aGhkYGhkiGhwdGBkgIBghFxwaICwjGh0pIBcdJDYkKS0yMzMzGSU4PjgyPSwyMzMBCwsLDw4PHhISHi8pIikyNDIyMj00MjI6MjI0NDIyMjIyMjIyMjIyMjIyMjIyMjIyMjQyMjIyMjIyMjIyMjIyMv/AABEIAF0BLAMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAABwUGAwQIAgH/xABNEAACAQIDAwYHCQ0IAwEAAAABAgMAEQQSIQUGMQcTQVFxkSIyNWFzgbMUMzRyk6GxssEWFyNCUlRiY5LC0dLhNkNTZIKio+MVJUQk/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAEEBQMC/8QAJREAAgICAQQBBQEAAAAAAAAAAAECEQMEIRIyM0FxEzFRYYEi/9oADAMBAAIRAxEAPwC4bwTvc+E3eaXW1XObie+rNtrFY8k54IR2SX/eqnY55SfDRQfMf61r68aXox9uXVwYosbJGbpJInxWYfQacm6+Kd9mwu7MXKtdmN2NnYC56dAKSLE9Qpt7EkmXY+HMEaSPrdXbKMudrkHr4V524ppfJOm2pP4Inb8zG92Y+s1RsQ5zHU99WDauIxhJzxRL2Pf96qzOWubqB2Gu2GNROOy+qSJfd3ak64qBVlkCtLGpXO2UguAQRexFqbm3pmAsCRp0GkrsAn3XhtP76P64ppb3z4tXtFFG8eUeEz2bNc3FrjTh31V2Ip5IlrVk1jlZS9uyNrqe81W+eZTdWZT5iR9FSW05cQb85HGvY39ahpCekDvq7jVRKWVtzsZPJbtCWSSdJJHdVVSodibEk3tfhTIpW8kZPO4j4ifWNNKsnZVZHRr6rbxKz7RRRXAsBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQBRRRQC83m2jGhbMT3Gl5tHHIzXBPdVn3z8Zu2qDiK18MVGNox87650zK2KXr+anRunMBsiBuize0akQad263kSDsf2r1y2naS/Za18SjbX4Kxt7asVyLm/Yap+IxaknU91b+8Hvhquy8aswXTHgpSX1J8+ia2BiFOMw3po+j9YKcu8+JRB4Rtp1Gkbu78Mwvp4/aLTi354eqqub/WSNl2EVjg6KHtfFRvfK6n1/ZUBJWHG+Me2taPEkGx1H0VcjUVRnuDm+pDM5I/fcR8RPrGmjSu5IvfcR8RPrGmjWTteVmrqeJf0+0UUVwLIUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAUUUUAoN8/Gbtqg4ir9vn4zdtUHEVs4uxGNk8hqmndut5Eg7H9q9JE07t1vIkHY/tXqvs+vkv4/t/Bb7weOarsvGrFvB45quy8atrtRnw738m7u78Mwvp4/aLTi35+yk7u78Mwvp4/aLTi35+yqmTyxL77GJ/G+Me2o1qksb4x7ajWq2yjr/cZvIy93xA6kT6xpsGlHyMH8NiR+rT6xq/b9H/ANbivRn6RWTs+RmrijUaJ3OOsd9GcdY765bw6PI6xpcszBVF+JY2A7zVi+4faf5vJ+3H/NXA9dR0GDevtcz43C4rByBZBJDJa41IJHWrKdfUaYe529UmKwWNw87F5I8PI6ufGZMhBDHpIJGvnpZKduhp5x1jvozjrHfXLCsxIAJudONWX7h9p/m8n7cf81COo6CDA9Ir1XNW1NjYzB5WmjkjufBa+l/Myki9Xjky3xmadcHO5kVwebZjdlZRfKSdSCAePA2oTfobtY5JVUXJAHnIH00uuUbfl8M/uXDECW15H45LjRVB0zW1v0XHTwWWFwmMxztkEs78WJJNr/lMxsPWaBs6RjnRvFZW7CD9FZa5t2lu9jcGA8kUkQv44NwD0eEhIBq0bj8oMsUiQ4pzJExCh3N3jJ0BLcWXrvw6OqgsdBYDjQGB6RS45aG//Nh7H+9PD4hqr8kTk7RNyfen+laC+aHjRRRUknjOOsV6uONc8b+uf/J4rU++df6Iq67KY/cxKbm9pPa1FkJ80NHOOsd9GcdY765cwySSOsaXZnYKovxLGwGvnNWH7h9p/m8n7cf81BZ0ENa9VzNjcNisHIFkEkMlrjUg261IOo06DTX5Lt6pMWsmHnbPJGAyufGZCbHN1kG2vTegT9DBJr5nHWO+lZyybZtzOEU/rXt61jH1j3UrEnZSGDEEEEG50I4UDkkdUUVF7ubTGKwkOIH46At5mGjj1MDUpUkig3z8Zu2qDiKv2+fjN21QcRWzi7EY2TyGqad263kSDsf2r0kTTu3W8iQdj+1eq+z6+S/j+38FvvB45quy8asW8Hjmq7Lxq2u1GfDvfybu7vwzC+nj9otOLfn7KTu7vwzC+nj9otOLfn7KqZPLEvvsYn8b4x7ajWqSxvjHtqNarbKOv9xk8i4/DYo/oJ9Y1fd+vJmL9Gfsqj8jSWkxHnRD/uNXjfryZi/RH7KydnyM1cUuqNiA2NOseJgkc2VJY2Y9QVwToOOgp5ffG2b/AI5+Tl/lpE4DDc5LHHe3OOqXte2ZgL26eNM370H+b/4v+yuBMbIHlL3ngxrwiC7LEGu5BFy9tADrYZenrrzyc4Ziu0JLeCuDkUnzuLgdyHuqxw8kKX8PFMR1LEAe8ubd1W99hw4PZuJihWy8zISTqzHmzqx6TQ9JO7Zz1E9mU9RB7jTe++7B+by/tJSiiW7KD0kD56dGO5LsGYpOa5wSZTkLPcZreDcW4XoeY2U3fjfxcfCsEcRRQ4cszAkkAgAADTxjWlyZ7PeXaUTKDljvI7dAABAv2kgd9VZkKOVZdVazKetTqD3Wro3dQYc4SKTDRpHHIobKo6eDBjxYggi56qErl2znvbOKMuJmlbUvI7d7G3zU+uT/AGasGzoAoAMiCVz0lpBfXsBA9VIPauHMc8sbaFJHU/6WIroLcjFrLs7Csp4RKh8xj8E/OtBH7sl8ZhUljeKRQyOpVgekEa1zHjsPzcskf5Dsn7LEfZXUMkgUFmNgASSeAA4k1zBtLEc5PLIODyO/7TE/bQmX2L9vzijLsbZsjak2BPWVQqT/ALa0eSDykfQv9K1u77YYx7F2ajaHif8AWhb96tLkg8pH0L/StCH3DyoooqT0c67/AHlPFek/dFXfZP8AZiXsk9rVI3+8p4r0n7oq77J/sxL2Se1rz6PK7mLTYmIWPFQSObKksbMeNgrgnQcdBTx++Ns3/HPycv8ALSK2bhedmjivl5yRUva9s7AXt08aZn3oP83/AMX/AGVIjdEByl7zQY2SEQXKxK13IIuXI0AOthl6eupDkZhPunESnREiyk9F2cEfMhqSg5IUv4eKYjqWIA95Y27qlN60h2XsqSHDjKZDzYJN2YuPDZj0nICPNpQlLm2KnenapxeMmn6GchPiLonzAVM76bs+5MPgpMti8WWX0l8+vns9v9FVvZM0cc8ckqsyK6syra7BTe2vXa1XzfHfzC47CPAIpVe6sjNksGU9NjexUsPXQ8rlMkuRra11mwjHxTzidhsHA9eU+s00q5t3Q2t7kxsM17KGyv8AEfRu4G/qrpG9D1F2hQ75+M3bVAnpx7xRKSbqp7QKXW04lDaKo9QrYwS6o0ZOyuifUVg07t1vIkHY/tHpStGOodwpy7pKP/EwCwtlb67Vy2lST/Z31svXar0Kzb/vhquycaZu3oE18Bf2RVKxKLc6Dj1CrON9USpN/SnzzZqbu/DML6eP2i04t+ejspXbAQe68NoPfo+gflinNvEotwHCqub/ADkiXcU/qY5ehGYuNixsCdeqtZMLY3bu/jVx2501WpauQ/0rM6UnCXSi+8kfvuI+In1jVy368mYv0Z+yqbyR++4j4ifWNMzEQJIjI6h0YWZWFwR5weNZO15Wa2p4l/TmnYHwzDemj9oK6cqIj3bwasGXDQhgQQRGlwRqCNONS9cCwlQVG7w/A8V6CX2bVJViljDKVYBlYEEHUEEWII6RQk5cw/jr8YfTXU68KiBuvgh/8sHyafwqYqCEqEfyr7D5jFjEIPwc/hHqDjx+/RvWaluR3btmkwTnQ3kiv1j3xR6rN6jTPx+z4p1CyxpIoNwHUMAesA9Ota2G3fwkbq8eHhR11DLGoI7CBpQVzYuuU7c12kbG4dC4YfhUUXYEDx1A4gga9l+nSm7t724rAZliIKE3aOQErfrFiCp7D0V0XUXjtgYSY5pMPE7flFFzd9r0FexK7f5QcXi4zEckUbCzCIEFh1EsSbeYVl3F3LkxcqyyoUw6kFmYW5y34qdYPSeAHnpv4bdbBRnMmFhB6ygJ9V71MgWoK/IteWgWwuGA/wAU/UNLHYG3JcHLz0OXPlK+ELixtfS/mro3HbOinAWaJJADcB1DAHrF60vuWwP5pB8kn8KBrmxS/fRx/wCq+TP81b2w+U3FPiYkm5vm2cK9lsQGNr3v0Xv6qZn3LYH80g+ST+FH3L4H81g+ST+FBT/Ijt/vKeK9J+6Ku+yf7MS9kntav2I3fwkjl5MPC7txZo1JPaSNa2I9lwrEYBFGIje8YUZDc3N14caBLmznPdv4bhfTR+0FdM1ERbt4NWV1w0KspBBEaggg3BBtoal6BKgpJcru2Odxa4dT4MK2Px3sW7hlHfTtqJn3cwbszvhoWZiSzNGpJJ4kkjU0JfKFbyebkRY2CSfEZwufLHkYC+UeGTcG+pA9Rq3feswHXN8oP5auWDwkcSCONFRBeyqAFFzc2A85rYpQpHNW9GyfcmLlw+uVW8AniVbVCfPYj106uT7bYxGz4izDOn4J7kXulrH1qVPrqZx2xMNM2eWCKRrWzOik2HAXI89fIdg4VBZcPEBe9hGtvooRVFa3g4ml3tTxqae8Gz+JzfN/WlltaCzHX5q1dVpmXup0QjGnLuj5Jg7G9o1LnYu7nuk++5L/AKF/3hTb2RsgQYVMOHJCAjNa17sTwvpx6687k1SXuydKDTb9NFE2701R8TxPbTG3iwFr+Ff1f1qg4iDwrX+au+u04nHbVSR52D8Mw3po/rinNvDw9VUbdXc4O8c5mIyOrZQnGzA2vm04dVMLbGEzrxt6qqbE08ir0W9WDWN/sVe3emqzLVw2/grEjN839aruFwHONbNl9V/tq7ja6LM/NF/Vot/JL77iPiJ9JpoNe2nGqnuTuuMHnk53nC6gWy5QLE/pG/GrdWVsSUsjaNjWi440mQg2s3MMxUc6H5vLrbNfTz2t9FesXtVkkVLAqoXnW/JL6C2unXWOTCD3YGvplz5ejMLgH7axQbLWWN5HZszlibGw0Pg6dNqrclrg2tobVMUyIQDGVux1uLki/Zwr5JtcrzxsGyMqoB+MWGlzWHBQ53jLm/4EqRbiLka1jw2ylyzx5joVKnpBUG3b1U5FI3cPipQ+WQw6gnKreGDa4Fida8Dab+5Ofsufq1t4+Xr6q1NnI00ys5W8d9QgBbS3hG9YeYbN7kz/AIPN1a2ve170siiS2ntRo8gRQxy538yC17d/zV72jjnUxCPJ+Evq97WABHDtrWh2eszyu5bxsgANgFA4eesMeCDcwjnMqNIuo4iwtfXopyTSMkm2JFSW4jLoyC63KnP9tbUWNlWRI5lTw75WQm1x0EGoyXD5YpoQfBV1INtdTwPXwrd2fG8ziWR75L5VAsASOJ11pyODJDtU+5jMwGa5AAvYnNZRWzsrFmRDmGV1Yqw6iP6VE4fBZ1hiZjlzOxtoSQTbW+lq28JhRDiCqklWS5DG5uDxvUpsNI+Y3aTrM0atEgCg3kuL36rGvM+13iaIOEZWTM7JewubAr5uFa+1lK4hnGQ3VRZ0zDT11sYaPnJYy9iDCwIAsLZiOF9NKCkb2BxhkklXTKhXKR0hhfWo+XaknOSIGgQI1hzhYE9xrNsPCCJ5lBJGYAX6LA99RuLuk0tghzNfw0vbs1qG+AkrJJsXOZWjjEZyorHNm1LDWxHnrym1mbmvBClpDG4OtiONu+tPETOkxZWALol/Bv8AijhrWxiNnc3AGVznRudzEeMx43HVUikbWJ2kY5ZFYDIsefTiSWtb56MLLiWKMyxhG1IBOZQeHmJrWwGF58SSSNcuuTQWyga6a9etY9n4iUyc1nGWPpy6sAOBN9KWRRtYnapWcIACgKq7dTPfLXufGSNK0UITwACzPe1zwAArQw+yllhMjM2d8zE30vc206bV5naSMJiFcZpFCuCtwSvBuOhqLZNIkTjJFeBJFUF8+a1zbKLi1abzyzjnURDGjFlVi2ZsvTpp2XrLzTF8KzvmPhkmwF8w4adVasqPCxgR7Ix0utyobiAb1IRsS7esYmC+A6ktxzLY2PqBrDj9vOkjIqoyi1j5ioPX562VwKpLCg1URMLEcb8b1DYvZYWRlDaA6acB1cah2SqP/9k='
                },
            };

            
            pdfMake.createPdf(docDefinition).download("institucionvisitas.pdf");
        
        },
    },
     created() {
         //para traer el nombre de la institucion
            let visitasnombreinstitucionparse =  JSON.parse(localStorage.getItem("visitasnombreinstitucion"));
            this.nombreinstitucion =visitasnombreinstitucionparse;

            let transformaraParse = JSON.parse(
            localStorage.getItem("historicoinstitucionArreglo")
            );
            //paa obtener el historico de recusos
            this.recursos1insti = transformaraParse.filter(
            (p) => p.recurso == "1"
            ).length;
            this.recursos2insti = transformaraParse.filter(
            (p) => p.recurso == "2"
            ).length;
            this.recursos3insti = transformaraParse.filter(
            (p) => p.recurso == "3"
            ).length;
            this.recursos4insti = transformaraParse.filter(
            (p) => p.recurso == "4"
            ).length;
            this.recursos5insti = transformaraParse.filter(
            (p) => p.recurso == "5"
            ).length;
            this.recursos6insti = transformaraParse.filter(
            (p) => p.recurso == "6"
            ).length;
            this.recursos7insti = transformaraParse.filter(
            (p) => p.recurso == "7"
            ).length;
            this.recursos8insti = transformaraParse.filter(
            (p) => p.recurso == "8"
            ).length;
            this.recursos9insti = transformaraParse.filter(
            (p) => p.recurso == "9"
            ).length;
            this.recursos10insti = transformaraParse.filter(
            (p) => p.recurso == "10"
            ).length;
            this.recursos11insti = transformaraParse.filter(
            (p) => p.recurso == "11"
            ).length;
            this.recursos12insti = transformaraParse.filter(
            (p) => p.recurso == "12"
            ).length;
            this.recursos13insti = transformaraParse.filter(
            (p) => p.recurso == "13"
            ).length;
            this.recursos14insti = transformaraParse.filter(
            (p) => p.recurso == "14"
            ).length;

    }
}
</script>