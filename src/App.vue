<template>
  <div id="app">
    <v-app>
      <v-card>
        <v-toolbar>
          <v-toolbar-title class="ml-3"><router-link class="v-btn v-btn--flat v-btn--text v-size--default" to="/">Home</router-link></v-toolbar-title>
        </v-toolbar>
      </v-card>
      <router-view/>
    </v-app>
  </div>
</template>

<script>
  export default {
    props: {
      attrs: {
        type: Object,
        default: () => ({}),
      },
    },
  }
</script>
