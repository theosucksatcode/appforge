export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  if (user.value) return; // authenticated users are handled elsewhere

  // allow unauthenticated users to access the authenticate and verify pages
  if (to.path === "/authenticate" || to.path === "/verify") return;

  const pendingEmail = useCookie("pending-auth-email");

  if (pendingEmail.value) {
    // cookie is alive and user should be verifying
    return navigateTo("/verify");
  }
  // no cookie means no pending session so allow normal navigation
});
