<script>
import axios from "axios";
import {server} from "../../helper";
import carousel from "../carousel";

export default{
  name: 'EventsCarousel',
  extends: carousel,
  data() {
    return {
      loading: true,
      datas: [],
    };
  },
  created() {
    this.fetchEvents();
  },
  methods: {
    async fetchEvents() {
      // get events
      await axios
          .get(`${server.baseURL}/public/${this.type}/${this.id}/events?${server.apikey}`)
          .then(data => {
            this.datas = data.data.data.results
            this.loading = false
          });
    },
  },
}
</script>
