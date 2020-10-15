<template>
  <v-pagination
      v-model="page"
      :length="count"
      :total-visible="7"
      @input="handlePageChange"
  ></v-pagination>
</template>

<script>
export default{
  props: ['page', 'count', 'handlePageChange'],
}
</script>
