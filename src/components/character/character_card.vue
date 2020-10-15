<template>
  <v-card
      class="mx-auto my-12"
      max-width="374"
  >
    <v-img
        height="250"
        :src="character.thumbnail.path + '.' + character.thumbnail.extension"
    ></v-img>

    <v-card-title>{{ character.name }}</v-card-title>

    <!--        <v-card-text>
              <div>{{ character.description }}</div>
            </v-card-text>-->

    <v-divider class="mx-4"></v-divider>

    <v-card-actions>
      <router-link :to="'/character/' + character.id" tag="button">
        <v-btn
            color="grey lighten-3 lighten-2"
            text
        >
          Details
        </v-btn>
      </router-link>
      </v-card-actions>
    </v-card>
</template>
<script>
export default{
  props: ['character'],
}
</script>
