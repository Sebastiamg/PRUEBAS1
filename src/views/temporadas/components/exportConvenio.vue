<template>
    <div>
        <div align="center">
            <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
            <vs-button @click="imprimirEval()" style="font-size: 12px">Imprimir</vs-button>
        </div>
        <vx-card id="seccionImprimir2">
            <h3 class="text-center font-bold">CONVENIO PARA USO DE PROGRAMA {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRAL</h3>
            <p class="letra" style="margin-top: 25px;">
                En la ciudad de Quito, hoy a los {{ getDay(arregloContrato[0]) }} días del mes de {{ mes }} del año
                {{ numeroALetras(year) }},
                comparecen a la celebración del presente convenio por una parte la compañía
                <b>{{ empresaSelected.descripcion_corta.toUpperCase() }} ,</b> con domicilio en la ciudad de Quito, en la avenida La Prensa
                N. 58 - 154 y Vaca de Castro, debidamente representada por el  señor
                <b>{{ gerente }},</b> a quien en adelante y para efectos del presente
                convenio se le podrá llamar simplemente <b>{{ empresaSelected.descripcion_corta.toUpperCase() }};</b> y, por otra parte la
                <b>{{ arregloContrato[0].nombreInstitucion.toUpperCase() }}</b> con domicilio
                en {{ arregloContrato[0].nombre_ciudad }}, debidamente representada por su representante
                legal, el sr/a {{ arregloContrato[0].beneficiario.toUpperCase() }}, como consta en el nombramiento
                a quien en adelante y para efectos de este convenio se la podrá llamar simplemente
                <b>EL COLEGIO. </b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                Las partes de común acuerdo y siendo legalmente capaces para contratar,
                suscriben este Convenio en las siguientes cláusulas:
            </p>
            <p class="letra" style="margin-top: 15px;">
               <b>CLAUSULA PRIMERA. - ANTECEDENTES. -</b>
            </p>
            <p class="letra2">
                <b>1.1 {{ empresaSelected.descripcion_corta.toUpperCase() }}</b> es una Compañía ecuatoriana legalmente constituida,
                domiciliada en la ciudad de Quito, provincia de Pichincha, cuyo objeto social
                principal es la edición de libros, revistas o folletos de carácter científico y
                cultural y la comercialización y distribución nacional e internacional de los mismos.
            </p>
            <p class="letra2">
                <b>1.2 {{ empresaSelected.descripcion_corta.toUpperCase() }}</b> ha desarrollado un programa llamado {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA
                en adelante <b>“PI”</b>, el mismo comprende:
            </p>
            <p class="letra2">
                <b class="ml-5">a)</b> <span class="ml-4">Dos componentes: Proyectos Educativos <b>“PE”,</b> y Libros Digitales <b>“LD”;</b></span>
            </p>
            <p class="letra2" style="margin-top: 0!important;">
                <b class="ml-5">b)</b> <span class="ml-4">Tres procesos: formación, evaluación y usos de tic’s.</span>
            </p>
            <p class="letra2">
                La descripción de cada uno de estos componentes consta en la
                “Tabla de Componentes” que hace parte integrante del presente convenio
            </p>
            <p class="letra2">
                <b>1.3 El Colegio</b> manifiesta que conoce el proyecto de {{ empresaSelected.descripcion_corta.toUpperCase() }}
                descrito en los antecedentes anteriores y que desea implementarlo en su institución
                educativa como sistema de trabajo y enseñanza durante los ciclos escolares, {{ aniosConvenios }} según las pautas de implantación y desarrollo que {{ empresaSelected.descripcion_corta.toUpperCase() }} prevé y
                ambos acuerdan.
            </p>
            <p class="letra" style="margin-top: 15px;">
               <b>CLAUSULA SEGUNDA. - OBJETO. -</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                En base a los antecedentes expuestos,
                las partes libre y voluntariamente acuerdan implementar el programa
                <b>{{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA,</b> con los componentes y procesos descritos lo que implica
                que EL COLEGIO en el nivel de Educación Básica y Bachillerato,
                se compromete a implementar de acuerdo al siguiente detalle:
            </p>
            <table class="encabezado tabla1" style="margin-top: 25px;"  border="1">
                <thead>
                    <tr>
                        <td colspan="1" style="width: 150px;" class="rotar"><b>Areas</b></td>
                        <td colspan="1" class="rotar"><b>Inicial 1</b></td>
                        <td colspan="1" class="rotar"><b>Inicial 2</b></td>
                        <td colspan="1" class="rotar"><b>1</b></td>
                        <td colspan="1" class="rotar"><b>2</b></td>
                        <td colspan="1" class="rotar"><b>3</b></td>
                        <td colspan="1" class="rotar"><b>4</b></td>
                        <td colspan="1" class="rotar"><b>5</b></td>
                        <td colspan="1" class="rotar"><b>6</b></td>
                        <td colspan="1" class="rotar"><b>7</b></td>
                        <td colspan="1" class="rotar"><b>8</b></td>
                        <td colspan="1" class="rotar"><b>9</b></td>
                        <td colspan="1" class="rotar"><b>10</b></td>
                        <td colspan="1" class="rotar"><b>1 {{ letraBachillerato }}</b></td>
                        <td colspan="1" class="rotar"><b>2 {{ letraBachillerato }}</b></td>
                        <td colspan="1" class="rotar"><b>3 {{ letraBachillerato }}</b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in arregloAreas" :key="key">
                        <td class="font1"><b>{{ tr.serieArea.charAt(0).toUpperCase() + tr.serieArea.slice(1) }}</b></td>
                        <td><span v-if="tr.inicial1.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.inicial2.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.uno.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.dos.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.tres.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.cuatro.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.cinco.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.seis.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.siete.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.ocho.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.nueve.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.diez.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.bgu1.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.bgu2.length > 0">&#10004;</span></td>
                        <td><span v-if="tr.bgu3.length > 0">&#10004;</span></td>
                    </tr>
                </tbody>
            </table>
            <p class="letra" style="margin-top: 15px;">
               <b>CLAUSULA TERCERA. - MODO DE EJECUCIÓN DEL CONVENIO:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                La implementación y ejecución de <b>PI</b> en EL COLEGIO por parte de
                <!-- <b>Prolipa</b> deberá estar conforme a las siguientes características y condiciones: -->
                <b>{{ empresaSelected.descripcion_corta }}</b> deberá estar conforme a las siguientes características y condiciones:
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>3.1.</b> Para garantizar un buen funcionamiento de todos los componentes del programa,
                el departamento pedagógico de {{ empresaSelected.descripcion_corta.toUpperCase() }} conjuntamente con el área académica del Colegio,
                deberán determinar, anualmente el plan de trabajo a seguir, es decir acordarán anualmente
                el listado de materias y material a proveer, lo que deberá acordarse por escrito con la
                firma de ambas partes y se incorporará al presente convenio.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>3.2.- </b> Adicionalmente, a la parte digital del programa,
                <b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b> proporcionará a los directivos, coordinadores y docentes
                del COLEGIO, la capacitación ofertada del presente convenio.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>3.3 {{ empresaSelected.descripcion_corta.toUpperCase() }}</b> entregará a EL COLEGIO información de los
                lugares o puntos de comercialización de los materiales del
                sistema PI al inicio de cada año lectivo de conformidad a
                las listas entregadas por EL COLEGIO, para que puedan ser
                distribuidos a cada uno de sus estudiantes.
            </p>
            <p class="letra" style="margin-top: 15px;">
               <b>CLÁUSULA CUARTA. - OBLIGACIONES DE {{ empresaSelected.descripcion_corta.toUpperCase() }}:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
               Sin perjuicio de las obligaciones propias que surgen
                con motivo de la celebración de este convenio, <b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b> se obliga a:
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>4.1.-</b> Subir textos a la Plataforma.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>4.2.-</b> Presentar las actualizaciones a los distintos componentes del PI
                durante los años lectivos: {{ aniosConvenios }}
                incorporando las mejoras tanto educativas como tecnológicas.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>4.3.-</b> Brindar asesoría permanente al plantel.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>4.4.-</b> Facilitar a los docentes y coordinadores los posters, flashcards, recortables,
                tablas de planeación, que se incluyen dentro de los recursos que proporciona {{ empresaSelected.descripcion_corta.toUpperCase() }}.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>4.5.-</b> Dar capacitación a los docentes de EL COLEGIO.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>4.6.-</b> Otorgar el {{ arregloContrato[0].descuento }}% a la institución.
            </p>
            <!--QUINTA CLAUSULA-->
            <p class="letra" style="margin-top: 15px;">
               <b>CLÁUSULA QUINTA. - OBLIGACIONES DE EL COLEGIO:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
               <b>Sin perjuicio de las obligaciones derivadas de la celebración de este convenio,
                EL <b>COLEGIO</b> se obliga a:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>5.1.-</b> Posicionar y sostener ante su comunidad educativa, directivos, coordinadores,
                docentes, padres de familia y alumnos la decisión de incorporar
                {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA en todos los grados y aulas de <b>primaria y bachillerato</b> comprendidos
                <b>desde Inicial I , II, Primero a Decimo de Básica, Primero  BG.</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>5.2.-</b> Implementar {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA, en EL <b>COLEGIO</b> durante los
                años lectivos: {{ aniosConvenios }}.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>5.3.-</b> Disponer el uso del material de {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA a todos los alumnos que forman
                 parte de EL COLEGIO comprendidos de inicial a decimo.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>5.4.-</b> Garantizar el uso del material original de los textos de {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA
                en todos los alumnos que forman parte de EL COLEGIO comprendidos de desde
                Inicial I y II, Primero a Decimo de Básica y Primero BG.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>5.5.-</b> El COLEGIO ni ninguna de sus autoridades, coordinadores, profesores o alumnos,
                podrá reproducir parcial o totalmente, ninguno de los recursos que forman parte de {{ empresaSelected.descripcion_corta.toUpperCase() }}
                INTEGRA, ya sea de forma digital, literal o de cualquier otro medio, que pueda afectar los
                derechos patrimoniales de <b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b> sobre los mismos y prohibirá el uso de fotocopias o
                reproducciones del material producido por {{ empresaSelected.descripcion_corta.toUpperCase() }}.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>CLAUSULA SEXTA. - VALOR, CANTIDAD Y FORMA DE PAGO:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>6.1.-</b> Las partes acuerdan como justo precio para la utilización de
                {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA los siguientes precios:
            </p>
            <table class="tabla2"  border="1">
                <thead>
                    <tr>
                        <!-- <td colspan="1"><b>AÑO BASICO</b></td> -->
                        <td colspan="1"><b>LIBRO</b></td>
                        <td colspan="1"><b>PRECIO</b></td>
                        <td colspan="1"><b>CANTIDAD</b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in arregloLibros" :key="key">
                        <!-- <td>{{ tr.nombrenivel }}</td> -->
                        <td>{{ tr.nombrelibro }}  </td>
                        <td>{{ tr.precio }}</td>
                        <td>{{ tr.valor}} </td>
                    </tr>
                </tbody>
            </table>
            <p class="letra" style="margin-top: 25px;">
                <b>6.2.-</b> El valor antes mencionado, será cancelado en su totalidad por cada estudiante al inicio del año lectivo en
                los puntos de ventas ya dispuestos por {{ empresaSelected.descripcion_corta.toUpperCase() }} para la comercialización de los materiales de
                sistema {{ empresaSelected.descripcion_corta.toUpperCase() }} INTEGRA.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>6.3.-</b> La cantidad de libros solo puede incrementar durante los años de contrato, en ningún caso podrá
                disminuir la cantidad pactada en el presente acuerdo.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>CLAUSULA SEPTIMA. - VIGENCIA:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                El plazo de vigencia del presente convenio será de {{ totalAnios }} años lectivos, contados a partir de la fecha de inicio de clases determinada por el Ministerio de Educación, para el año lectivo {{ aniosConvenios }} podrá renovarse de común acuerdo entre las partes para lo cual
                bastará únicamente un aviso por escrito de una de las partes.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>CLÁUSULA OCTAVA. - TERMINACIÓN DE CONVENIO:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                El presente convenio se terminará en uno de los siguientes casos:
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>8.1.-</b> Por vencimiento del plazo contractual y ausencia de renovación.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>8.2.-</b> Por incumplimiento de este convenio, si ello no fuere subsanado dentro de los treinta días
                siguientes de notificado dicho incumplimiento.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>CLAUSULA NOVENA. -  MODIFICACIONES AL CONVENIO:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                Cualquier reforma posterior a este convenio, deberá hacérsela por escrito, de común acuerdo y en documentos firmados por ambas partes que se incorporarán al convenio principal, como adendum al mismo. Estas reformas, sin embargo,
                no podrán dejar sin efecto la esencia del convenio principal.
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>CLAUSULA DECIMA.- CORRESPONDENCIA Y NOTIFICACIONES:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                Para los distintos efectos previstos en este convenio, las comunicaciones, solicitudes, avisos o notificaciones que deban ser enviadas por una parte a la otra respecto del presente convenio se las realizará en forma escrita en idioma castellano por una persona previamente autorizada por cada una de las partes; estas comunicaciones deberán ser remitidas a la otra parte a través de
                correspondencia tradicional, para el efecto las partes señalan como su domicilio el siguiente:
            </p>
            <!--DATOS PROLIPA-->
            <p class="letra" style="margin-top: 15px;">
                <b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b>
            </p>
            <div class="letra3">
                <div style="width: 100px;">Att.</div>
                <div>{{ gerente }}</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">Dirección:</div>
                <div>Av. La Prensa y Vaca de Castro.</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">Teléfono:</div>
                <div>(02) 3976100</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">E-mail:</div>
                <div>gerenciag@prolipa.com.ec</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">Ciudad:</div>
                <div>Quito</div>
            </div>
              <!--DATOS COLEGIO-->
              <p class="letra" style="margin-top: 15px;">
                <b>EL COLEGIO</b>
            </p>
            <div class="letra3">
                <div style="width: 100px;">Att.</div>
                <div>{{ arregloContrato[0].beneficiario.toUpperCase() }}  </div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">Dirección:</div>
                <div>{{ arregloContrato[0].direccionInstitucion }}</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">Teléfono:</div>
                <div>{{ arregloContrato[0].telefonoInstitucion }}</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">E-mail:</div>
                <div>{{ arregloContrato[0].email }}</div>
            </div>
            <div class="letra3">
                <div style="width: 100px;">Ciudad:</div>
                <div>{{ arregloContrato[0].nombre_ciudad}} </div>
            </div>
            <p class="letra" style="margin-top: 15px;">
                <b>CLAUSULA DECIMA PRIMERA.- COMPROMISO ARBITRAL:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                En caso de que existan divergencias entre las partes en relación a lo que se ha estipulado por las mismas
                en el presente convenio, estas deciden acudir a un proceso de mediación ante un mediador de la Cámara de Comercio de Quito. En caso de
                que los conflictos no fueren resueltos mediante el procedimiento de mediación, las Partes convienen
                en someter sus controversias y divergencias a la resolución de un Tribunal de Arbitraje en Derecho de
                la Cámara de Comercio de Quito, que se sujetará en lo dispuesto en la Ley de Arbitraje y Mediación,
                en el Reglamento del Centro de Arbitraje y Mediación de la Cámara de Comercio de Quito y a las siguientes normas:
            </p>
            <p class="letra4">
                <b>a)</b>
                <span class="ml-2">
                    El Tribunal estará integrado por tres árbitros designados por el Centro de Arbitraje
                    y Mediación, de conformidad con lo dispuesto en la Ley de Arbitraje y Mediación;
                </span>
            </p>
            <p class="letra4">
                <b>b)</b>
                <span class="ml-2">
                    El Tribunal decidirá en Derecho;
                </span>
            </p>
            <p class="letra4">
                <b>c)</b>
                <span class="ml-2">
                    Los asuntos resueltos mediante el laudo arbitral tendrán el mismo valor de las
                    sentencias de última instancia dictadas por la justicia ordinaria;
                </span>
            </p>
            <p class="letra4">
                <b>d)</b>
                <span class="ml-2">
                    Las Partes renuncian a la jurisdicción ordinaria, se obligan a acatar el laudo que
                    expida el Tribunal Arbitral y se comprometen a no interponer ningún tipo
                    de recurso en contra del laudo arbitral;
                </span>
            </p>
            <p class="letra4">
                <b>e)</b>
                <span class="ml-2">
                    Para la ejecución de las medidas cautelares el Tribunal Arbitral está facultado
                    para solicitar de los funcionarios públicos, judiciales, policiales y
                    administrativos su cumplimiento, sin que sea necesario recurrir a juez ordinario alguno;
                </span>
            </p>
            <p class="letra4">
                <b>f)</b>
                <span class="ml-2">
                    El procedimiento arbitral será confidencial;
                </span>
            </p>
            <p class="letra4">
                <b>g)</b>
                <span class="ml-2">
                    El lugar del arbitraje serán las instalaciones del Centro de Arbitraje
                    y Mediación de la Cámara de Comercio de Quito;
                </span>
            </p>
            <p class="letra4">
                <b>h)</b>
                <span class="ml-2">
                    El idioma del arbitraje será el Castellano; y,
                </span>
            </p>
            <p class="letra4">
                <b>i)</b>
                <span class="ml-2">
                    Los costos de la mediación serán asumidos por LA PARTE que
                    determine el Tribunal o por ambas PARTES por igual, si así lo determina el Tribunal.
                </span>
            </p>
            <p class="letra" style="margin-top: 15px;">
                <b>CLAUSULA DECIMA SEGUNDA. - ACEPTACIÓN:</b>
            </p>
            <p class="letra" style="margin-top: 15px;">
                Los intervinientes declaran que están de acuerdo y aceptan cada una de las
                cláusulas constantes en el presente instrumento y piden que se les haga el reconocimiento de
                firma y rubrica ante uno de los jueces de lo civil del cantón Quito o ante uno de los notarios
                de la ciudad.
            </p>
            <p class="letra" style="margin-top: 15px;">
                Para constancia y aprobación de lo aquí estipulado firman por
                triplicado en la ciudad de Quito, a {{  day }} de {{ mes}} del {{ year}}.
            </p>
            <div class="letra5">
                <div style="width: 50%;">
                    <p>{{ gerente }}</p>
                    <p><b>Gerente</b></p>
                    <p><b>{{ empresaSelected.descripcion_corta.toUpperCase() }}</b></p>
                </div>
                <div style="width: 42%;">
                    <p>{{ arregloContrato[0].beneficiario.toUpperCase()}}</p>
                    <p><b>Representante Legal.</b></p>
                    <p><b>{{ arregloContrato[0].nombreInstitucion.toUpperCase() }}</b></p>
                </div>
            </div>
            <div class="flex justify-end" >
                <p  style="margin-top:110px;margin-right: 57px;font-size:12px;">{{ arregloContrato[0].iniciales_facturador }} - {{ arregloContrato[0].codigo_contrato }}</p>
            </div>
        </vx-card>
        <!-- <div class="w-full p-2 bg-gray-400 text-center">
            <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
        </div> -->

    </div>

</template>
<script>
import moment from "moment";
import html2pdf from "html2pdf.js"
export default{
    data(){
        return{
           gerente:'',
            // gerente:'DANIEL CALDERÓN',
            // gerente:'ING. MIGUEL CALDERÓN MEDIAVILLA',
            arregloContrato:[],
            arregloLibros:[],
            arregloAreas:[],
            aniosConvenios:'',
            day:'',
            mes:'',
            year:'',
            anio:'',
            fecha:'',
            telefono:'',
            nombrearchivo:'',
            representanteActual:'',
            totalAnios:0,
            letraBachillerato:'BG',
        }
    },
    props:{
        id_beneficiario_pedido:{
            type:Number,
            default:0
        },
        id_pedido:{
            type:Number,
            default:0
        },
        id_periodo:{
            type:Number,
            default:0
        },
        aniosAnteriorSelect:{
          type:String,
          default:''
        },
        anioEmpieza:{
            type:String,
            default:'',
        },
        empresaSelected:{
          type:Object,
          default:function(){
            return {}
          }
        }
    },
    created(){
        let me = this;
        moment.lang("es")
        me.day = moment().format('DD');
        me.mes = moment().format('MMMM');
        me.year = moment().format('YYYY')
        me.fecha = me.day+'-'+me.mes.substring(0,3)+'-'+me.year
        // me.nombrearchivo = 'ReporteConvenio'+".pdf"
        //me.contrato = me.$route.params.id
    },
    mounted(){
        let me = this
        this.gerente = this.empresaSelected.representante
        this.getPedidos();
    },
    methods:{
      getPedidos(){
        let me = this
        me.$vs.loading();
        this.$http.get(this.$server_url+'get_pedidos_periodo_Only_pedido/'+me.id_pedido+'/'+me.id_beneficiario_pedido)
        .then(res => {
            me.$vs.loading.close();
            me.arregloContrato = res.data
            me.nombrearchivo    = "Convenio "+res.data[0].contrato_generado+".pdf"
            me.aniosConvenios = ''
            var arregloPre    = []
            var contador = 1;
            let contadorAnios = me.aniosAnteriorSelect - me.anioEmpieza
            me.totalAnios = contadorAnios;
            for(var i = 0; i<contadorAnios; i++){
                var cal = ''
                cal = (parseInt(me.anioEmpieza)  + i) + " - "+ (parseInt(me.anioEmpieza) + contador)
                arregloPre.push(cal)
                contador++;
            }
            me.aniosConvenios =  arregloPre.join(',')

            me.getLibros(me.arregloContrato[0].id_pedido)
        })
        .catch((e) => {
            me.$vs.loading.close();
        })
      },
        //funcion para obtener el dia de 365
        getDay(item){
          let me = this
          const fechaGenerarC =  item.fecha_generar_contrato.substring(0,10)
          var preFechaLimite = ""
          var preyear        = me.aniosAnteriorSelect
            //costa -> hasta 30 de septiembre
            if(item.tregion == 2){
            return me.calculoFechaLimite(preyear,2,fechaGenerarC)
            //preFechaLimite = preyear + "-"+ '09'+"-"+"30"
          }
          //sierra -> hasta 31 de diciembre
          else{
            return me.calculoFechaLimite(preyear,1,fechaGenerarC)
              //preFechaLimite = preyear + "-"+ '12'+"-"+"31"
          }
        },
        calculoFechaLimite(fechaFin,region,fechaGenerarC){
          let me = this;
          //SIERRA
          if(region == 1){
            return me.obtenerDiasXAnio(region,fechaGenerarC,fechaFin)
          }
          //COSTA
          const arrayDeAnios = me.generarArrayDeAnios(me.year, fechaFin);
          var anioUltimo = 0
          if(arrayDeAnios.length > 1){
            anioUltimo = arrayDeAnios.length -1
          }
          let  resultadoDays = 0
          for(let i = 0; i< arrayDeAnios.length; i++){
            let FInicio = ""
            let FFin    = ""
            var anioEnCurso = arrayDeAnios[i]
            var result      = 0
            if(arrayDeAnios.length == 1){
              if(i == 0){
                //fecha inicio del contrato
                FInicio = fechaGenerarC
                FFin    = arrayDeAnios[i] + "-"+ '09'+"-"+"30"
                // result = me.obtenerDiasXAnio(region,FInicio,arrayDeAnios[i])+1
                result = me.obtenerDiasXAnio(region,FInicio,FFin)+1
              }
            }else{
              if(i == 0){
                //fecha inicio del contrato
                FInicio = fechaGenerarC
                FFin    = arrayDeAnios[i] + "-"+ '12'+"-"+"31"
                // result = me.obtenerDiasXAnio(region,FInicio,arrayDeAnios[i])+1
                result = me.obtenerDiasXAnio(region,FInicio,FFin)+1
              }
              if(i == anioUltimo){
                //fecha inicio del año
                FInicio = anioEnCurso+'/01/01'
                FFin    = arrayDeAnios[i] + "-"+ '09'+"-"+"30"
                result = me.obtenerDiasXAnio(region,FInicio,FFin) +1
              }
              if(i != anioUltimo && i != 0){
                //fecha inicio del año
                FInicio = anioEnCurso+'/01/01'
                FFin    = arrayDeAnios[i] + "-"+ '12'+"-"+"31"
                result = me.obtenerDiasXAnio(region,FInicio,FFin) +1
              }
            }
            console.log("ii",result)
            resultadoDays += result
          }
          if(arrayDeAnios.length == 1){
            resultadoDays = resultadoDays
            return resultadoDays
          }else{
            console.log("uno",resultadoDays)
            resultadoDays = resultadoDays
            console.log("dos",resultadoDays)
            return resultadoDays
          }
        },
        obtenerDiasXAnio(region,FInicio,FFin){
          let me = this;
          var preFechaLimite = ""
            //costa -> hasta 30 de septiembre
            if(region == 2){
              // preFechaLimite = FFin + "-"+ '09'+"-"+"30"
              preFechaLimite = FFin

            }
            //sierra -> hasta 31 de diciembre
            else{
              preFechaLimite = FFin + "-"+ '12'+"-"+"31"
            }
            var fechaInicio = new Date(FInicio);
            var fechaFin = new Date(preFechaLimite);
            //proceso de calcular los dias
            // Calcular la cantidad de tiempo en milisegundos entre las dos fechas
            var tiempoMilisegundos = fechaFin.getTime() - fechaInicio.getTime();
            // Convertir la cantidad de tiempo de milisegundos a días
            var diasEntreFechas = tiempoMilisegundos / (1000 * 3600 * 24);
            // Redondear el resultado a un número entero
            diasEntreFechas = Math.round(diasEntreFechas);
            return diasEntreFechas
        },
        generarArrayDeAnios(inicio, fin) {
            const arrayAnios = [];
            for (let i = inicio; i <= fin; i++) {
              arrayAnios.push(i);
            }
          return arrayAnios;
        },
        numeroALetras(numero) {
            let unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
            let especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
            let decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
            let centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
            let bloques = ['', 'mil', 'millón', 'mil millones', 'billón', 'mil billones', 'trillón', 'mil trillones'];

            if (numero === 0) {
                return 'cero';
            }

            if (numero < 0) {
                return 'menos ' + numeroALetras(Math.abs(numero));
            }

            let palabras = [];
            let indiceBloque = 0;

            while (numero > 0) {
                let bloque = numero % 1000;
                if (bloque !== 0) {
                let palabrasBloque = [];
                let centenasBloque = Math.floor(bloque / 100);
                let decenasBloque = bloque % 100;
                let unidadesBloque = bloque % 10;
                if (centenasBloque === 1 && decenasBloque === 0 && unidadesBloque === 0) {
                    palabrasBloque.push('cien');
                } else if (centenasBloque !== 0) {
                    palabrasBloque.push(centenas[centenasBloque]);
                }
                if (decenasBloque >= 10 && decenasBloque <= 19) {
                    palabrasBloque.push(especiales[decenasBloque - 10]);
                } else if (decenasBloque !== 0) {
                    palabrasBloque.push(decenas[Math.floor(decenasBloque / 10)]);
                }
                if (decenasBloque !== 1 && unidadesBloque !== 0) {
                    palabrasBloque.push(unidades[unidadesBloque]);
                }
                palabrasBloque.push(bloques[indiceBloque]);
                palabras.push(palabrasBloque.join(' '));
                }
                indiceBloque++;
                numero = Math.floor(numero / 1000);
            }
            return palabras.reverse().join(' ');
        },

        getLibros(id_pedido){
            let me = this
            me.arregloAreas = []
            me.arregloLibros = []
            var verificacionperiodo = '';
            if (me.id_periodo > 26) {
                verificacionperiodo = 'get_val_pedidoInfoTodo_new/';
            }else if(me.id_periodo <= 26) {
                verificacionperiodo = 'get_val_pedidoInfoTodo/';
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+verificacionperiodo+id_pedido)
            // this.$http.get(this.$server_url+'get_val_pedidoInfo/'+id_pedido)
            .then(res => {
              me.$vs.loading.close()
              let datos = res.data
              if(datos.length > 0){
                let datos2 = datos.filter(p => p.valor > 0)
                //setear ARRAY
                let preSetear = []
                datos2.forEach(element => {
                  let cal                 = new Object();
                  cal.serieArea           = element.serieArea
                  cal.idlibro             = element.idlibro
                  cal.anio                = element.anio
                  cal.version             = element.version
                  cal.codigo_liquidacion  = element.codigo_liquidacion
                  cal.nombrelibro         = element.nombrelibro
                  cal.valor               = element.valor
                  cal.precio              = element.precio
                  preSetear.push(cal)
                });
                //Generate unique array
                var preTemplate = []
                datos2.forEach(element => {
                  let cal = new Object();
                  cal.serieArea           = element.serieArea
                  cal.idlibro             = element.idlibro
                  cal.anio                = element.anio
                  cal.version             = element.version
                  cal.codigo_liquidacion  = element.codigo_liquidacion
                  cal.nombrelibro         = element.nombrelibro
                  cal.precio              = element.precio
                  preTemplate.push(cal)
                });
                //CLEAR REPEAT
                //quitar duplicados
                let hash = {};
                var preArrayUnico = []
                let resultado = preTemplate.filter(o => hash[o.nombrelibro] ? false : hash[o.nombrelibro] = true);
                preArrayUnico  = resultado
                //////
                //SUMAR VALORES PEDIDO + ALCANCES
                const sumarValores = preSetear.reduce((acc,valor) =>{
                  if(acc[valor.idlibro]){
                    acc[valor.idlibro] += valor.valor
                  }else{
                    acc[valor.idlibro] = valor.valor
                  }
                  return acc
                },{})
                //PASAR AL AREGLO UNICO LOS VALORES SUMADOS POR  LIBRO
                const result = preArrayUnico.map((obj) => {
                    obj["valor"] = sumarValores[obj.idlibro];
                    return obj;
                });
                //OBTENER VALORES DE VALOR * CANTIDAD
                var arrayListo = []
                result.forEach(element => {
                  let cal3 = new Object();
                  cal3.serieArea          = element.serieArea
                  cal3.idlibro            = element.idlibro
                  cal3.anio                = element.anio
                  cal3.version             = element.version
                  cal3.nombrelibro        = element.nombrelibro
                  cal3.codigo_liquidacion = element.codigo_liquidacion
                  cal3.precio             = element.precio
                  cal3.valor              = element.valor
                  cal3.subtotal           = element.valor * element.precio
                  arrayListo.push(cal3)
                });
                ///===ORDENAR ARRAY ==
                me.arregloLibros = arrayListo.sort(function(a, b) {
                var nombreA = a.nombrelibro.toLowerCase();
                var nombreB = b.nombrelibro.toLowerCase();
                var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final

                if (nombreA < nombreB) {
                    return -1;
                }
                if (nombreA > nombreB) {
                    return 1;
                }
                if (numA && !numB) { // si a tiene número y b no, b va primero
                    return 1;
                }
                if (!numA && numB) { // si b tiene número y a no, a va primero
                    return -1;
                }
                if (numA && numB) { // si ambos tienen número, compararlos
                    if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                    return -1;
                    }
                    if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                    return 1;
                    }
                    return numA - numB; // comparar los números directamente
                }
                return 0; // si son iguales en todo, no hay diferencia
                });
                me.renderAreas(me.arregloLibros)
              }//end if
            })
            .catch((e) => {
                me.$vs.loading.close()
            })
        },
        renderAreas(tr){
            let me = this
            var agruparAreas = []
            var datosSeteados = []
            tr.forEach(element => {
                var cal = new Object();
                cal.serieArea = element.serieArea
                agruparAreas.push(cal)
            });
            //QUITAR ARRAYS DUPLICADOS
            let hash = {};
            let resultado = agruparAreas.filter(o => hash[o.serieArea] ? false : hash[o.serieArea] = true);
            datosSeteados  = resultado
            datosSeteados.map(p => {
                p["valores"]    = tr.filter(s => s.serieArea == p.serieArea)
                return p
            });
            let ArregloOrdenar = []
            datosSeteados.forEach(element => {
                var cal = new Object();
                cal.serieArea   = element.serieArea
                cal.inicial1    = element.valores.filter(p => p.idlibro == 115 || p.idlibro == 658 || p.idlibro == 115 || p.idlibro == 662)
                cal.inicial2    = element.valores.filter(p => p.idlibro == 114 || p.idlibro == 529 || p.idlibro == 663)
                cal.uno         = element.valores.filter(p => (p.anio == 1) && (p.version == '' || p.version == null) && (p.idlibro != 115 && p.idlibro != 658 && p.idlibro != 115 && p.idlibro != 662))
                cal.dos         = element.valores.filter(p => (p.anio == 2) && (p.version == '' || p.version == null) && (p.idlibro != 114 && p.idlibro != 529 && p.idlibro != 663))
                cal.tres        = element.valores.filter(p => p.anio == 3 && (p.version == '' || p.version == null))
                cal.cuatro      = element.valores.filter(p => p.anio == 4 && (p.version == '' || p.version == null))
                cal.cinco       = element.valores.filter(p => p.anio == 5 && (p.version == '' || p.version == null))
                cal.seis        = element.valores.filter(p => p.anio == 6 && (p.version == '' || p.version == null))
                cal.siete       = element.valores.filter(p => p.anio == 7 && (p.version == '' || p.version == null))
                cal.ocho        = element.valores.filter(p => p.anio == 8 && (p.version == '' || p.version == null))
                cal.nueve       = element.valores.filter(p => p.anio == 9 && (p.version == '' || p.version == null))
                cal.diez        = element.valores.filter(p => p.anio == 10 && (p.version == '' || p.version == null))
                cal.bgu1        = element.valores.filter(p => p.anio == 1 && (p.version == me.letraBachillerato))
                cal.bgu2        = element.valores.filter(p => p.anio == 2 && (p.version == me.letraBachillerato))
                cal.bgu3        = element.valores.filter(p => p.anio == 3 && (p.version == me.letraBachillerato))
                ArregloOrdenar.push(cal)
            });
            //ORDENAR ARRAY
            me.arregloAreas  = ArregloOrdenar.sort((a, b) => {
            if (a.serieArea < b.serieArea) {
                return 1;
            }
            if (a.serieArea > b.serieArea) {
                return -1;
            }
            return 0;
            });
            // setTimeout(function() {me.imprimirEval()}, 1000);
        },
        imprimirEval() {
            let me = this;

            // Crear el overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fondo semitransparente
            overlay.style.zIndex = '99999998'; // Asegúrate de que esté debajo de la notificación
            document.body.appendChild(overlay);

            // Crear y mostrar el aviso de notificación
            const notifyDiv = document.createElement('div');
            notifyDiv.style.position = 'fixed';
            notifyDiv.style.top = '50%';
            notifyDiv.style.left = '50%';
            notifyDiv.style.transform = 'translate(-50%, -50%)';
            notifyDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            notifyDiv.style.color = '#fff';
            notifyDiv.style.borderRadius = '5px';
            notifyDiv.style.padding = '20px';
            notifyDiv.style.zIndex = '99999999'; // Asegúrate de que esté por encima del overlay
            notifyDiv.style.display = 'flex';
            notifyDiv.style.alignItems = 'center';
            notifyDiv.style.justifyContent = 'center';
            notifyDiv.style.fontSize = '16px';
            notifyDiv.innerHTML = `
        <span style="margin-right: 10px;">⚠️</span>
        <span>Espere mientras se descarga el pdf.</span>
    `;
            document.body.appendChild(notifyDiv);

            // Función para generar el PDF
            const generateAndSavePDF = () => {
                var element = document.getElementById('seccionImprimir2');
                var opt = {
                    margin: [0.5, 0.5, 0.5, 0.5],
                    filename: me.nombrearchivo,
                    image: {
                        type: 'jpeg',
                        quality: 0.98
                    },
                    html2canvas: {
                        dpi: 192,
                        scale: 2,
                        letterRendering: true
                    },
                    pagebreak: {
                        mode: 'avoid-all',
                        inside: "avoid",
                        before: '#page2el'
                    },
                    jsPDF: {
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                    }
                };

                // Generar y guardar el PDF
                html2pdf().from(element).set(opt).toPdf().get('pdf').then(pdf => {
                    // Guardar el archivo PDF
                    pdf.save(me.nombrearchivo);

                    // Eliminar el overlay y la notificación después de que se haya generado el PDF y se haya guardado
                    document.body.removeChild(notifyDiv);
                    document.body.removeChild(overlay);

                    // Limpiar el arreglo de pedidos
                    me.arregloContrato = []
                    me.arregloLibros   = []
                    me.$vs.notify({
                        text: "Archivo descargado correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-file',
                        time:2000
                    });
                }).catch(err => {
                    // En caso de error, también eliminar el overlay y la notificación
                    document.body.removeChild(notifyDiv);
                    document.body.removeChild(overlay);
                    console.error('Error al generar el PDF:', err);
                });
            };
            // Esperar 1 segundo antes de generar el PDF
            setTimeout(generateAndSavePDF, 1000);
        },
    }
}
</script>
<style scoped>
.html2canvas-container { width: 3000px !important; height: 3000px !important; }
*{
    font-family: Arial;
}
.letra{
    padding:0px 60px 0px 0px;
    font-size: 11px;
    margin-left: 35px;
    text-align: justify;
}
.letra2{
    margin-top: 15px;
    margin-left: 60px;
    padding-right:60px;
    font-size: 11px;
    text-align: justify;
}
.letra3{
    display: flex;
    font-size: 11px;
    margin-left: 35px;
    padding-right:35px;
    text-align: justify;
}
.letra4{
    margin-top: 15px;
    margin-left: 55px;
    padding-right:55px;
    font-size: 11px;
    text-align: justify;
}
.letra5{
    display: flex;
    justify-content: space-evenly;
    width: 90%;
    margin-left: 35px;
    padding-right:35px;
    font-size: 11px;
    margin-top: 115px;
}
.tabla1 {
  table-layout: fixed;
  width: 95%;
  border-collapse: collapse;
  border: none;
  margin-left: 15px;
}
.tabla2{
    table-layout: fixed;
    width: 90%;
    border-collapse: collapse;
    border: none;
    font-size: 11px;
    margin-top: 15px;
    margin-left: 35px;
}

@media print {
    td {page-break-before: always;}
    p  {page-break-before: always;}
}
.encabezado ,td,th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
}
.rotar{
    font-size: 8px;
    /* writing-mode: vertical-lr;
     transform: rotate(180deg); */
}
.font1{
    font-size: 8px;
}
</style>
