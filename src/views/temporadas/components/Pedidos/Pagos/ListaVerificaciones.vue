<template>
    <vx-card class="mt-4" :title="tituloCard" title-color="primary">
      <div  class="flex" style="flex-wrap: wrap;">
        <!--VALOR COMISION-->
        <div class="p-6 pb-0">
          <div class="flex justify-center">
              <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path opacity="0.4" d="M8.32031 15.27L14.8603 8.72998" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path opacity="0.4" d="M8.73001 10.3701C9.40932 10.3701 9.95999 9.81948 9.95999 9.14017C9.95999 8.46086 9.40932 7.91016 8.73001 7.91016C8.0507 7.91016 7.5 8.46086 7.5 9.14017C7.5 9.81948 8.0507 10.3701 8.73001 10.3701Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path opacity="0.4" d="M15.269 16.0899C15.9484 16.0899 16.4991 15.5392 16.4991 14.8599C16.4991 14.1806 15.9484 13.6299 15.269 13.6299C14.5897 13.6299 14.0391 14.1806 14.0391 14.8599C14.0391 15.5392 14.5897 16.0899 15.269 16.0899Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
          </div>
          <div class="flex justify-center">
              <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ valor_comision | filtrarDecimal }}</h2>
          </div>
          <div class="truncate"><span class="">Valor Comisión</span></div>
        </div>
        <!--TOTAL PAGADO CLIENTES-->
        <div class="p-6 pb-0">
          <div class="flex justify-center">
              <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                  <svg width="28px" height="28px" viewBox="0 0 1024 1024" class="icon"  version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M732.1 399.3C534.6 356 696.5 82.1 425.9 104.8s-527.2 645.8-46.8 791.7 728-415 353-497.2z" fill="#464BD8" /><path d="M539.5 838.8c-1.4 0-2.9-0.3-4.2-1L330.1 730.3a8.95 8.95 0 0 1-3.8-12.1L529 331.1a8.92 8.92 0 0 1 8-4.8c1.4 0 2.9 0.3 4.2 1l205.2 107.5c4.4 2.3 6.1 7.7 3.8 12.1L547.4 834a8.92 8.92 0 0 1-7.9 4.8z" fill="#514DDF" /><path d="M537 335.3l205.2 107.5-202.7 387-205.2-107.4L537 335.3m0-17.9c-1.8 0-3.6 0.3-5.3 0.8-4.5 1.4-8.3 4.6-10.5 8.8L318.4 714.1a17.9 17.9 0 0 0 7.6 24.2l205.2 107.5c2.6 1.4 5.4 2 8.3 2 1.8 0 3.6-0.3 5.3-0.8 4.5-1.4 8.3-4.6 10.5-8.8L758.1 451a17.88 17.88 0 0 0-7.6-24.1L545.3 319.4c-2.5-1.3-5.4-2-8.3-2z" fill="#151B28" /><path d="M538.4 835.5c-1 0-2-0.2-2.9-0.5l-254-87a8.98 8.98 0 0 1-5.6-11.4L440 257.4c1.3-3.7 4.7-6.1 8.5-6.1 1 0 1.9 0.2 2.9 0.5l254 87c2.2 0.8 4.1 2.4 5.1 4.5s1.2 4.6 0.4 6.8l-164 479.3c-0.8 2.2-2.4 4.1-4.5 5.1-1.3 0.7-2.6 1-4 1z" fill="#FFFFFF" /><path d="M448.6 260.4l254 87-164.2 479.1-254-87 164.2-479.1m0-17.9c-2.7 0-5.4 0.6-7.9 1.8a18.1 18.1 0 0 0-9.1 10.3L267.5 733.7c-3.2 9.4 1.8 19.5 11.1 22.7l254 87c1.9 0.6 3.8 1 5.8 1 2.7 0 5.4-0.6 7.9-1.8 4.3-2.1 7.5-5.8 9.1-10.3l164.1-479.2c3.2-9.4-1.8-19.5-11.1-22.7l-254-87c-1.9-0.6-3.9-0.9-5.8-0.9z" fill="#151B28" /><path d="M448.6 323c-6.9 0-13.7-1.1-20.3-3.4-2.2-0.8-4.1-2.4-5.1-4.5s-1.2-4.6-0.4-6.8l17.4-50.8c1.3-3.7 4.7-6.1 8.5-6.1 1 0 1.9 0.2 2.9 0.5l50.8 17.4c2.2 0.8 4.1 2.4 5.1 4.5s1.2 4.6 0.4 6.8a62.83 62.83 0 0 1-59.3 42.4z" fill="#FFFFFF" /><path d="M448.6 260.4l50.8 17.4a53.82 53.82 0 0 1-50.8 36.3c-5.8 0-11.6-0.9-17.4-2.9l17.4-50.8m0-17.9c-7.4 0-14.4 4.7-16.9 12.1l-17.4 50.8c-1.5 4.5-1.2 9.4 0.9 13.7 2.1 4.3 5.8 7.5 10.3 9.1 7.5 2.6 15.3 3.9 23.2 3.9a71.6 71.6 0 0 0 67.7-48.4c1.5-4.5 1.2-9.4-0.9-13.7a18.1 18.1 0 0 0-10.3-9.1l-50.8-17.4c-2-0.7-3.9-1-5.8-1z" fill="#151B28" /><path d="M685.1 407.1c-1 0-2-0.2-2.9-0.5a62.74 62.74 0 0 1-39-79.6c1.3-3.7 4.7-6.1 8.5-6.1 1 0 1.9 0.2 2.9 0.5l50.8 17.4c4.7 1.6 7.2 6.7 5.6 11.4L693.6 401c-0.8 2.2-2.4 4.1-4.5 5.1-1.3 0.7-2.6 1-4 1z" fill="#FFFFFF" /><path d="M651.7 330l50.8 17.4-17.4 50.8a53.8 53.8 0 0 1-33.4-68.2m0-17.9c-2.7 0-5.4 0.6-7.9 1.8a18.1 18.1 0 0 0-9.1 10.3c-12.8 37.3 7.2 78.1 44.5 90.9 1.9 0.7 3.9 1 5.8 1 7.4 0 14.4-4.7 16.9-12.1l17.4-50.8c1.5-4.5 1.2-9.4-0.9-13.7a18.1 18.1 0 0 0-10.3-9.1L657.5 313c-1.8-0.6-3.8-0.9-5.8-0.9z" fill="#151B28" /><path d="M335.3 765.9c-1 0-2-0.2-2.9-0.5L281.6 748c-2.2-0.8-4.1-2.4-5.1-4.5s-1.2-4.6-0.4-6.8l17.4-50.8c0.8-2.2 2.4-4.1 4.5-5.1a8.9 8.9 0 0 1 6.8-0.4 62.74 62.74 0 0 1 39 79.6c-0.8 2.2-2.4 4.1-4.5 5.1-1.3 0.5-2.7 0.8-4 0.8z" fill="#FFFFFF" /><path d="M301.9 688.8c28.1 9.6 43 40.1 33.4 68.2l-50.8-17.4 17.4-50.8m0-17.9c-2.7 0-5.4 0.6-7.9 1.8a18.1 18.1 0 0 0-9.1 10.3l-17.4 50.8c-3.2 9.4 1.8 19.5 11.1 22.7l50.8 17.4c1.9 0.6 3.8 1 5.8 1 2.7 0 5.4-0.6 7.9-1.8 4.3-2.1 7.5-5.8 9.1-10.3 6.2-18.1 5-37.5-3.4-54.7-8.4-17.2-23-30-41.1-36.2-1.9-0.7-3.9-1-5.8-1z" fill="#151B28" /><path d="M538.4 835.5c-1 0-1.9-0.2-2.9-0.5l-50.8-17.4c-2.2-0.8-4.1-2.4-5.1-4.5s-1.2-4.6-0.4-6.8a62.75 62.75 0 0 1 59.2-42.4c6.9 0 13.8 1.1 20.4 3.4 2.2 0.8 4.1 2.4 5.1 4.5s1.2 4.6 0.4 6.8l-17.4 50.8a9.01 9.01 0 0 1-8.5 6.1z" fill="#FFFFFF" /><path d="M538.4 772.8c5.8 0 11.7 0.9 17.5 2.9l-17.4 50.8-50.8-17.4a53.56 53.56 0 0 1 50.7-36.3m0-17.9v17.9-17.9a71.6 71.6 0 0 0-67.7 48.4c-3.2 9.4 1.8 19.5 11.1 22.7l50.8 17.4c1.9 0.6 3.8 1 5.8 1 2.7 0 5.4-0.6 7.9-1.8 4.3-2.1 7.5-5.8 9.1-10.3l17.4-50.8c3.2-9.4-1.8-19.5-11.1-22.7-7.6-2.6-15.4-3.9-23.3-3.9z" fill="#151B28" /><path d="M493.6 692.4c-16.4 0-32.6-2.7-48.3-8.1-1-0.4-2.2-0.7-3.4-1.3a148.5 148.5 0 0 1-97.2-143c0-0.8 0.2-1.7 0.4-2.4l27.6-80.6c0.3-0.8 0.7-1.5 1.2-2.2 27.9-37.8 72.7-60.3 119.7-60.3 16.4 0 32.6 2.7 48.2 8.1 51.5 17.6 89.2 61.9 98.4 115.5 1.7 9.5 2.5 19.2 2.3 28.8 0 0.8-0.2 1.6-0.4 2.4l-27.6 80.6c-0.3 0.8-0.7 1.5-1.2 2.2-28 37.7-72.7 60.3-119.7 60.3z" fill="#FFFFFF" /><path d="M493.5 402.6c15.1 0 30.5 2.5 45.6 7.6 50.3 17.2 84.6 60.1 93 109.2 1.6 8.9 2.4 18.1 2.2 27.2l-27.6 80.6a141.19 141.19 0 0 1-113.1 57.1c-15.1 0-30.5-2.5-45.7-7.6-1-0.3-2-0.7-3-1.2-0.1 0-0.2-0.1-0.2-0.1-57.7-21.3-93.3-76.6-91.9-135.2l27.6-80.6c26.4-35.8 68.7-57 113.1-57m0-16.3c-49.6 0-96.8 23.8-126.3 63.6-1 1.3-1.8 2.8-2.3 4.4l-27.6 80.6c-0.5 1.6-0.8 3.2-0.9 4.9a156.78 156.78 0 0 0 102.3 150.7l3.8 1.5c16.5 5.7 33.6 8.5 50.9 8.5 49.6 0 96.7-23.8 126.2-63.6 1-1.3 1.8-2.8 2.3-4.4l27.6-80.6c0.5-1.6 0.8-3.2 0.9-4.9 0.3-10.1-0.6-20.4-2.4-30.5a156.69 156.69 0 0 0-103.8-121.7c-16.3-5.6-33.4-8.5-50.7-8.5z" fill="#151B28" /><path d="M634.3 546.6l-27.6 80.6c-35.5 48-99.2 69.8-158.8 49.4-1-0.3-2-0.7-3-1.2-0.1 0-0.2-0.1-0.2-0.1-43.1-31.7-62.9-88.9-44.6-142.2 22.5-65.7 94-100.7 159.6-78.3a125.1 125.1 0 0 1 72.5 64.4 140 140 0 0 1 2.1 27.4z" fill="#2AEFC8" /><path d="M456.5 496.9c-11 5.4-18 10.7-22.3 23.3-4.8 14.1 1.3 26.5 14.5 31 34.1 11.7 45.7-54.8 94.4-38.1 21.3 7.3 31.1 25.7 26.7 47.7l22.3 7.6-4.2 12.2-22.1-7.6c-6.4 14-18.5 25.7-30.3 32l-8.6-11.7c11.4-6.4 22.1-15.5 26.9-29.6 5.9-17.3-0.5-29.3-15.1-34.3-38.1-13.1-50.7 53.1-94.9 37.9-19.7-6.7-29.4-24.9-25.7-44.9l-22.3-7.6 4.2-12.2 22.1 7.6c6.3-13.8 16.3-20.7 27.4-25.6l7 12.3z" fill="" /></svg>
              </span>
          </div>
          <div class="flex justify-center">
              <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ totalPagado | filtrarDecimal }}</h2>
          </div>
          <div class="truncate"><span class="">Total Pagado a Clientes</span></div>
      </div>
        <!--TOTAL VALOR LIQUIDACIONES-->
        <div class="p-6 pb-0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                  <svg fill="#000000" width="28px" height="28px" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5c-.655 0-.66 1.01 0 1h22c.286 0 .5.214.5.5v13c0 .66 1 .66 1 0v-13c0-.822-.678-1.5-1.5-1.5h-22zm-2 2c-.654 0-.654 1 0 1h22c.286 0 .5.214.5.5v13c0 .665 1.01.66 1 0v-13c0-.822-.678-1.5-1.5-1.5h-22zm-2 2C.678 9 0 9.678 0 10.5v12c0 .822.678 1.5 1.5 1.5h22c.822 0 1.5-.678 1.5-1.5v-12c0-.822-.678-1.5-1.5-1.5h-22zm0 1h22c.286 0 .5.214.5.5v12c0 .286-.214.5-.5.5h-22c-.286 0-.5-.214-.5-.5v-12c0-.286.214-.5.5-.5zm1 1c-.276 0-.5.224-.5.5v2c0 .672 1 .656 1 0V12h1.5c.672 0 .656-1 0-1h-2zm10 0C9.468 11 7 13.468 7 16.5S9.468 22 12.5 22s5.5-2.468 5.5-5.5-2.468-5.5-5.5-5.5zm8 0c-.656 0-.672 1 0 1H22v1.5c0 .656 1 .672 1 0v-2c0-.276-.224-.5-.5-.5h-2zm-8 1c2.49 0 4.5 2.01 4.5 4.5S14.99 21 12.5 21 8 18.99 8 16.5s2.01-4.5 4.5-4.5zm0 1c-.277 0-.5.223-.5.5v.594c-.578.21-1 .76-1 1.406 0 .82.68 1.5 1.5 1.5.28 0 .5.212.5.5 0 .288-.22.5-.5.5h-1c-.338-.005-.5.248-.5.5s.162.505.5.5h.5v.5c0 .277.223.5.5.5s.5-.223.5-.5v-.594c.578-.21 1-.76 1-1.406 0-.82-.68-1.5-1.5-1.5-.28 0-.5-.212-.5-.5 0-.288.22-.5.5-.5h1c.338.005.5-.248.5-.5s-.162-.505-.5-.5H13v-.5c0-.277-.223-.5-.5-.5zm-10 6.002c-.25-.002-.5.162-.5.498v2c0 .276.224.5.5.5h2c.656 0 .672-1 0-1H3v-1.5c0-.328-.25-.496-.5-.498zm20 0c-.25.002-.5.17-.5.498V21h-1.5c-.672 0-.656 1 0 1h2c.276 0 .5-.224.5-.5v-2c0-.336-.25-.5-.5-.498z"/></svg>
                </span>
            </div>
            <div class="flex justify-center">
                <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ totalPorPagar | filtrarDecimal }}</h2>
            </div>
            <div class="truncate"><span class="">Pendiente por Liquidar</span></div>
        </div>
        <!--TOTAL PAGADO PROLIPA-->
        <div class="p-6 pb-0" v-if="totalPagadoProlipa > 0">
            <div class="flex justify-center">
                <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="28" height="28" viewBox="0 0 512 512" xml:space="preserve">
                    <g>
                      <path fill="#000000" d="M494.422,238.219v-72.281c-0.016-34.063-23.641-62.5-55.422-70.063c-3.063-37-33.969-66.125-71.781-66.125 H108.156C53.984,29.766,9.297,69.594,1.406,121.547H0v16.359v42.125v194.063c0.016,59.75,48.422,108.156,108.156,108.156h314.125 c39.844,0,72.125-32.281,72.141-72.141v-45.672c10.141-2.891,17.563-12.109,17.578-23.156v-79.875 C511.984,250.344,504.563,241.125,494.422,238.219z M470.219,410.109c-0.016,13.266-5.344,25.172-14.047,33.891 c-8.703,8.688-20.609,14.031-33.891,14.031H108.156c-23.219,0-44.125-9.375-59.359-24.578 c-15.203-15.234-24.578-36.141-24.578-59.359V180.031v-41.156l0.203-4.688c1.953-44.625,38.641-80.25,83.734-80.219h259.063 c23.719-0.016,43.328,17.219,47.156,39.844H65.938c-6.688,0-12.125,5.406-12.125,12.094s5.438,12.109,12.125,12.109 h357.828 l2.484,0.203c24.594,2.031,43.969,22.609,43.969,47.719v71.25H358.406c-17.688,0-33.766,7.203-45.344,18.781l-0.016,0.016 c-11.578,11.578-18.797,27.656-18.766,45.359c-0.031,17.688,7.188,33.75,18.781,45.344l0,0 c11.578,11.594,27.656,18.797,45.344,18.781h111.813V410.109z M487.781,341.266H358.406c-11.141-0.016-20.875-4.406-28.219-11.703 c-7.313-7.344-11.688-17.094-11.703-28.219c0.016-11.141,4.391-20.891,11.703-28.25l-0.094,0.094l0.078-0.094h0.016 c7.344-7.281,17.078-11.656,28.219-11.688h129.375V341.266z"/>
                      <path fill="#000000" d="M341.969,301.344c0,9.578,7.75,17.344,17.344,17.344c9.563,0,17.344-7.766,17.344-17.344 c0-9.594-7.781-17.359-17.344-17.359C349.719,283.984,341.969,291.75,341.969,301.344z"/>
                    </g>
                  </svg>
                </span>
            </div>
            <div class="flex justify-center">
                <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ totalPagadoProlipa | filtrarDecimal }}</h2>
            </div>
            <div class="truncate"><span class="">Total Pagado a la Empresa</span></div>
        </div>
          <!--PAGO PENDIENTE REAL-->
          <!-- <div class="p-6 pb-0">
          <div class="flex justify-center">
              <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-warning),0.15);">
                <svg width="28px" height="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14H12.5M7 10H17M10 19H6.2C5.0799 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H17.8C18.9201 5 19.4802 5 19.908 5.21799C20.2843 5.40973 20.5903 5.71569 20.782 6.09202C21 6.51984 21 7.0799 21 8.2V8.5M14 20L16.025 19.595C16.2015 19.5597 16.2898 19.542 16.3721 19.5097C16.4452 19.4811 16.5147 19.4439 16.579 19.399C16.6516 19.3484 16.7152 19.2848 16.8426 19.1574L21 15C21.5523 14.4477 21.5523 13.5523 21 13C20.4477 12.4477 19.5523 12.4477 19 13L14.8426 17.1574C14.7152 17.2848 14.6516 17.3484 14.601 17.421C14.5561 17.4853 14.5189 17.5548 14.4903 17.6279C14.458 17.7102 14.4403 17.7985 14.405 17.975L14 20Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
          </div>
          <div class="flex justify-center">
              <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ totalPorPagar | filtrarDecimal }}</h2>
          </div>
          <div class="truncate"><span class="">Total a Pagar</span></div>
      </div> -->
      </div>
      <!--OTROS VALORES-->
      <div class="mt-3">
        <p class="mr-2" v-if="totalCobroVentaDirecta > 0"><vs-chip tranparent color="primary">Cobro Venta directa: {{ totalCobroVentaDirecta }}</vs-chip></p>
        <p class="mr-2" v-if="TotalConvenio > 0"><vs-chip tranparent color="primary">Total Convenio: {{ TotalConvenio }}</vs-chip></p>
        <p class="mr-2" v-if="totalDescuento > 0"><vs-chip tranparent color="primary">Total descuentos: {{ totalDescuento }}</vs-chip></p>
      </div>
      <br><br>
      <div>
      <ListadoPagosVue
        class="mt-5"
        :usuario="usuario"
        :contrato="contrato"
        :userRoot="userRoot"
        :totalLiquidacion="totalLiquidacion"
        :totalPorPagar="totalPorPagar"
        :sendPedido="sendPedido"
        :arregloVerificaciones="arregloVerificaciones"
        :datosInstitucion="datosInstitucion"
        @rechargeValores="rechargeValores"
        @changeReturn="changeReturn"
        />
      </div>
      <!--MODALES-->
      <!--DETALLE DE PAGOS-->
      <!--VERIFICACIONES-->
      <vs-popup :title="'Verificaciones Información '+sendPedido.contrato_generado" fullscreen :active.sync="popupVerificaciones">
        <ListadoVerificacionesPagosVue v-if="popupVerificaciones" :arregloVerificaciones="arregloVerificaciones"/>
      </vs-popup>
      <!--PORCENTAJES-->
      <vs-popup :title="'Porcentajes '+sendPedido.contrato_generado" fullscreen :active.sync="popupPorcentajes">
        <ScreenPorcentajesVue v-if="popupPorcentajes" :sendPedido="sendPedido" :arregloVerificaciones="arregloVerificaciones"/>
      </vs-popup>
    </vx-card>
</template>
<script>
import ListadoPagosVue from './ListadoPagos.vue';
import ScreenPorcentajesVue from '@/views/temporadas/components/Pedidos/Pagos/components/ScreenPorcentajes'
import ListadoVerificacionesPagosVue from './components/ListadoVerificacionesPagos.vue';
export default{
    components:{
      ListadoPagosVue,
      ScreenPorcentajesVue,
      ListadoVerificacionesPagosVue,
    },
    data(){
      return {
        popupPorcentajes:false,
        popupVerificaciones:false,
        popupDetallePagos:false,
        tituloCard:'',
      }
    },
    props:{
      userRoot:{
        type:Boolean,
        default:false,
        required:true,
      },
        contrato:{
            type:String,
            default:''
        },
        arregloVerificaciones:{
            type:Object,
            default:function(){
              return []
            }
        },
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
        totalLiquidacion:{
          type:Number,
          validator(value){
            return value%1!==0
          }
        },
        valor_comision:{
          type:Number,
          validator(value){
            return value%1!==0
          }
        },
        totalPorPagar:{
            type:Number,
            validator(value){
            return value%1!==0
            }
        },
        totalPagado:{
            type:Number,
            validator(value){
            return value%1!==0
            }
        },
        totalPagadoProlipa:{
          type:Number,
            validator(value){
            return value%1!==0
            }
        },
        totalCobroVentaDirecta:{
          type:Number,
            validator(value){
            return value%1!==0
            }
        },
        TotalConvenio:{
          type:Number,
            validator(value){
            return value%1!==0
            }
        },
        totalDescuento:{
          type:Number,
            validator(value){
            return value%1!==0
            }
        },
        sendPedido:{
          type:Object,
          default:function(){
            return {}
          },
        },
        datosInstitucion:{
          type:Object,
          default:function(){
            return {}
          }
        },
    },
    watch:{
      totalPorPagar(results){
        let me = this;
        me.totalPorPagar = results
      },
      totlaPagado(results){
        let me = this;
        me.totalPagado = results
        me.updatePedido("totalPendienteLiquidar",me.totalPorPagar)
      },
    },
    created(){
        let me = this;
    },
    mounted(){
      let me = this;
      if(me.contrato == null || me.contrato == "" || me.contrato == undefined) { me.tituloCard = "Registrar Documentos Pagos"; }
      else {  me.tituloCard  = "Pagos del Contrato: " + me.contrato }
      me.updatePedido("totalPendienteLiquidar",me.totalPorPagar)
    },
    methods:{
      updatePedido(campo,valor){
        let me = this
        let formData = new FormData();
        formData.append('unCampo', 'yes');
        formData.append('id_pedido',                  me.sendPedido.id_pedido);
        formData.append('campo',                      campo)
        formData.append('valor',                      valor)
        this.$http.post(this.$server_url+'updateThePedido', formData)
        .then(res => {
        })
        .catch((e)=>{
        })
      },
      rechargeValores(e){
        let me = this;
        me.$emit('rechargeValores',e)
      },
      changeReturn(e){
        let me = this
        if(e == 0) { me.popupDetallePagos   = true; }
        if(e == 1) { me.popupVerificaciones = true;}
        if(e == 2) { me.popupPorcentajes    = true;}
      },
    },
}
</script>
