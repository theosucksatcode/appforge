<template>
  <div class="min-h-svh flex items-center justify-center">
    <UPageCard
      :spotlight="enableSpotlight"
      spotlight-color="primary"
      class="max-w-xs"
    >
      <slot />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
const enableSpotlight = ref(false);
let mediaQuery: MediaQueryList | null = null;

const updateSpotlight = () => {
  if (!mediaQuery) return;
  console.log("Media query changed:", mediaQuery);
  enableSpotlight.value = mediaQuery.matches;
};

onMounted(() => {
  mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  updateSpotlight();
  mediaQuery.addEventListener("change", updateSpotlight);
});

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener("change", updateSpotlight);
});
</script>
