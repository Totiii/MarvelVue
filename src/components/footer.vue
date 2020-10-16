<template>
  <v-footer
      absolute
      class="font-weight-medium"
  >
    <v-skeleton-loader v-if="loading" type="text"></v-skeleton-loader>
    <!--<div v-else>
      <span>{{ attributionText }}</span>
      <span v-if="last_modified !== '' "> - Last update: {{last_modified}}</span>
    </div>-->
  </v-footer>
</template>

<script>
export default{
  props: ['attributionText', 'last_modified', 'loading'],
}
</script>
