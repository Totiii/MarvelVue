var CryptoJS = require("crypto-js");
export const server = {
    baseURL: 'http://gateway.marvel.com/v1',
    apikey: "ts=" + Date.now().toString() + "&apikey=" +process.env.VUE_APP_API_PUBLIC_KEY+ "&hash=" + CryptoJS.MD5(Date.now().toString() + process.env.VUE_APP_API_PRIVATE_KEY + process.env.VUE_APP_API_PUBLIC_KEY).toString()
}
