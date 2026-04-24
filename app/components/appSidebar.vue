<template>
  <USidebar
    v-model:open="open"
    collapsible="icon"
    :ui="{
      root: 'hidden md:block',
      container: 'md:flex',
    }"
  >
    <template #header="{ state }">
      <div class="flex items-center gap-2">
        <img src="/appforge-icon.png" alt="AppForge icon" class="size-8" />
        <span v-if="state === 'expanded'" class="text-xl font-bold">
          AppForge
        </span>
      </div>
    </template>

    <template #default="{ state }">
      <UNavigationMenu
        :items="navItems"
        :collapsed="state === 'collapsed'"
        orientation="vertical"
      />
    </template>

    <template #footer="{ state }">
      <div
        class="flex items-center gap-2 w-full"
        :class="
          state === 'expanded' ? 'justify-between' : 'justify-center flex-col'
        "
      >
        <UDropdownMenu
          :items="menuItems"
          :ui="{ content: 'w-33', label: 'truncate' }"
        >
          <UButton
            color="neutral"
            variant="ghost"
            :class="state === 'expanded' ? 'gap-2' : 'rounded-full p-0'"
          >
            <UAvatar
              :alt="
                profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : 'Unknown'
              "
            />
            <span v-if="state === 'expanded'" class="truncate">
              {{
                profile
                  ? `${profile.first_name} ${profile.last_name}`
                  : "Unknown"
              }}
            </span>
          </UButton>
        </UDropdownMenu>

        <UButton
          class="hidden lg:flex"
          :icon="open ? 'i-lucide-panel-left-close' : 'i-lucide-panel-left'"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </div>
    </template>
  </USidebar>
</template>

<script setup lang="ts">
const open = ref(false);
const { navItems, menuItems, profile } = useAppNavigation();

onMounted(() => {
  const mq = window.matchMedia("(min-width: 1024px)");
  open.value = mq.matches; // expands sidebar by default on desktop
  const handler = (e: MediaQueryListEvent) => {
    if (!e.matches) open.value = false;
  };
  mq.addEventListener("change", handler);
  onUnmounted(() => mq.removeEventListener("change", handler));
});
</script>
