<template>
  <UNavigationMenu
    :items="navItems"
    :ui="{
      root: 'justify-around border-t border-default mt-2',
      item: 'py-2',
      link: 'flex-col gap-1 p-2 pb-1.5',
      linkLeadingIcon: 'size-4',
      linkLabel: 'text-[10px] font-normal',
    }"
  />
</template>

<script setup lang="ts">
const { navItems } = useAppNavigation();
</script>
