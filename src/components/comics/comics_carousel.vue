<script>
import axios from "axios";
import {server} from "../../helper";
import carousel from "../carousel";

export default{
  name: 'ComicsCarousel',
  extends: carousel,
  data() {
    return {
      loading: true,
      datas: [],
    };
  },
  created() {
    this.fetchComics();
  },
  methods: {
    async fetchComics() {
      // get comics
      await axios
          .get(`${server.baseURL}/public/${this.type}/${this.id}/comics?ts=1&apikey=2b411b37798498d7207046977f4c5f83&hash=a09a640a44a713fa08d7d687a53fe268`)
          .then(data => {
            this.datas = data.data.data.results
            this.loading = false
          });
    },
  },
}
</script>
