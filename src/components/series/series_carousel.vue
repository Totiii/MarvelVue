<script>
import axios from "axios";
import {server} from "../../helper";
import carousel from "../carousel";

export default{
  name: 'SeriesCarousel',
  extends: carousel,
  data() {
    return {
      loading: true,
      datas: [],
    };
  },
  created() {
    this.fetchSeries();
  },
  methods: {
    async fetchSeries() {
      // get series
      await axios
          .get(`${server.baseURL}/public/${this.type}/${this.id}/series?${server.apikey}`)
          .then(data => {
            this.datas = data.data.data.results
            this.loading = false
          });
    },
  },
}
</script>
