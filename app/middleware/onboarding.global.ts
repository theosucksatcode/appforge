export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  const { profile } = useUserProfile();

  if (!user.value) return; // unauthenticated so not our concern here
  if (!profile.value) return; // profile not loaded yet so app.vue handles this case

  if (!profile.value.onboarded && to.path !== "/onboarding") {
    return navigateTo("/onboarding");
  }
});
