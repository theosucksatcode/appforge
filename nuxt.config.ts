// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2026-04-18",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  css: ["~/assets/css/main.css"],
  supabase: {
    redirectOptions: {
      login: "/authenticate", // redirect unauthed users here
      callback: "", // not used in otp flow but required to be set
      exclude: ["/authenticate", "/verify"], // dont redirect unauthed users that land here
    },
  },
});
