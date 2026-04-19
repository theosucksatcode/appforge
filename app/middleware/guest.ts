// keeps authenticated users away from guest pages like /authenticate and /verify
export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();

  if (user.value) {
    return navigateTo("/");
  }
});
