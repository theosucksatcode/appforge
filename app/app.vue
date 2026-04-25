<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <div v-if="resolving" class="min-h-svh flex items-center justify-center">
      <UIcon
        name="i-lucide-loader-2"
        class="size-8 text-primary animate-spin"
      />
    </div>
    <NuxtLayout v-else>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const { getUserProfile } = useUserProfile();
const resolving = ref(true);

onMounted(async () => {
  if (user.value) {
    const userProfile = await getUserProfile();
    if (userProfile && !userProfile.onboarded) {
      await navigateTo("/onboarding");
    }
  }
  resolving.value = false;
});
</script>
