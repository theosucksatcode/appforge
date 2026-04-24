<template>
  <div class="p-4 mb-2 border-b border-default">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <img src="/appforge-icon.png" alt="AppForge icon" class="size-6" />
        <span class="font-bold">AppForge</span>
      </div>

      <UDropdownMenu
        :items="menuItems"
        :ui="{ content: 'w-33', label: 'truncate' }"
      >
        <UButton color="neutral" variant="ghost" class="rounded-full p-0">
          <UAvatar
            :alt="
              profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown'
            "
          />
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>

<script setup lang="ts">
const { menuItems, profile } = useAppNavigation();
</script>
