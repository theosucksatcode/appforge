<template>
  <div class="flex flex-col h-svh">
    <MobileTopBar class="md:hidden" />

    <div class="flex flex-1 min-h-0">
      <AppSidebar />
      <main class="flex-1 overflow-y-auto px-4 sm:pr-4 md:py-4 md:pr-8">
        <slot />
      </main>
    </div>

    <MobileBottomNav class="md:hidden" />
  </div>
</template>
