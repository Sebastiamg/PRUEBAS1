<template>
  <div>
    <vs-table max-items="10" search pagination :data="arrayPaquetes">
      <template slot="header">
          <vs-chip  color="primary">Cantidad: <b> {{ arrayPaquetes.length }}</b></vs-chip>
      </template>
      <template slot="thead">
          <vs-th>Paquete</vs-th>
          <vs-th>Problema</vs-th>
      </template>
      <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                  {{data[indextr].codigo}}<br>
              </vs-td>
              <vs-td>
                  {{data[indextr].problema}}<br>
              </vs-td>
          </vs-tr>
      </template>
  </vs-table>

  </div>
    <!-- tabla -->
    <!-- <vs-table
      class="mt-4"
      :data="tableData"
      :columns="columns"
      :search="search"
      :select="select"
      :pagination="pagination"
      :rows-per-page="rowsPerPage"
      :search-placeholder="searchPlaceholder"
      :show-overflow="showOverflow"
      :show-footer="showFooter"
      :footer-props="footerProps"
      :select-all="selectAll"
      :selectable="selectable"
      :selected="selected"
      :loading="loading"
      :total="total"
      :title="title"
      @update:pagination="val => pagination = val"
      @update:rows-per-page="val => rowsPerPage = val"
      @update:search="val => search = val"
      @update:select="val => select = val"
      @update:selectAll="val => selectAll = val"
      @update:selected="val => selected = val"
      @update:loading="val => loading = val"
      @update:total="val => total = val"
      @update:title="val => title = val"
    />
  </div> -->
</template>

<script>
export default {
  data() {
    return {

    };
  },
  props:{
    arrayPaquetes:{
      type:Array,
      default:function(){
        return [];
      }
    }
  }
};
</script>

