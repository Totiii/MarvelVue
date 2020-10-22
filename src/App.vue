<template>
  <div id="app">
    <v-app>
      <v-card>
        <v-toolbar>
          <v-toolbar-title class="ml-3"><router-link class="v-btn v-btn--flat v-btn--text v-size--default" :to="({ name: 'Characters'})">Characters</router-link></v-toolbar-title>
          <v-toolbar-title class="ml-3"><router-link class="v-btn v-btn--flat v-btn--text v-size--default" :to="({ name: 'ComicsAll'})">Comics</router-link></v-toolbar-title>
          <v-toolbar-title class="ml-3"><router-link class="v-btn v-btn--flat v-btn--text v-size--default" :to="({ name: 'Creators'})">Creators</router-link></v-toolbar-title>
          <v-toolbar-title class="ml-3"><router-link class="v-btn v-btn--flat v-btn--text v-size--default" :to="({ name: 'Events'})">Events</router-link></v-toolbar-title>
          <v-toolbar-title class="ml-3"><router-link class="v-btn v-btn--flat v-btn--text v-size--default" :to="({ name: 'Series'})">Series</router-link></v-toolbar-title>
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
