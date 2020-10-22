<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>

<template>
  <div>
    <v-skeleton-loader
        v-if="loading_characters"
        class="mx-auto"
        type="table"
    ></v-skeleton-loader>

    <v-card v-if="!loading_characters">
      <v-card-title>
        Characters
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
          class="row-pointer"
          :headers="headers"
          :items="characters"
          :search="search"
          @click:row="handleClick"
      ></v-data-table>
    </v-card>
  </div>
</template>
<script>
import { server } from "../../helper";
import axios from "axios";
import router from "../../router";

export default {
  props: ['id', 'type', 'charactersnb'],
  data() {
    return {
      search: '',
      headers: [
        { text: 'Identifier', value: 'character_id'},
        { text: 'Name', value: 'name'},
        { text: 'Description', value: 'description' },
      ],
      loading_characters: true,
      characters: [],
    };
  },
  created() {
    this.fetchCharacters();
  },
  methods: {
    handleClick(value) {
      router.push({ name: 'CharacterDetails', params: { id: value.character_id } })
    },
    async fetchCharacters() {
      // get characters data
      await axios
          .get(`${server.baseURL}/public/${this.type}/${this.id}/characters?${server.apikey}`)
          .then(data => {
            data.data.data.results.forEach(element => {
              let datatable
              if(element.description.length < 2 ){
                datatable = JSON.parse('{ "character_id": "' + element.id + '", "name": "' + element.name +  '", "description": "No description for this character"}')
              }else{
                datatable = JSON.parse('{ "character_id": "' + element.id + '", "name": "' + element.name + '", "description": "' + element.description + '"}')
              }
              this.characters.push(datatable)
            })
          });
      this.loading_characters = false
    },
  }
};
</script>
