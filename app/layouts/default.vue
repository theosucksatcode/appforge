<template>
  <UDashboardGroup>
    <UDashboardSidebar :toggle="false">
      <template #header>
        <img src="/appforge-icon.png" alt="AppForge icon" class="size-6" />
        <span class="font-semibold">AppForge</span>
      </template>

      <UNavigationMenu
        :items="navItems"
        orientation="vertical"
        color="primary"
        highlight
      />
    </UDashboardSidebar>

    <UDashboardPanel>
      <template #body>
        <slot />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>

  <!-- mobile/tablet navigation -->
  <UNavigationMenu
    :items="navItems"
    :ui="{
      root: 'justify-around',
      item: 'mx-4',
      link: 'flex-col gap-1',
      linkLabel: 'text-[10px]',
    }"
    class="fixed bottom-0 inset-x-0 z-50 lg:hidden border-t border-default"
  />
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const navItems: NavigationMenuItem[] = [
  {
    label: "Home",
    icon: "i-lucide-house",
    to: "/",
    exact: true,
  },
  {
    label: "Settings",
    icon: "i-lucide-settings",
    to: "/settings",
  },
];
</script>
