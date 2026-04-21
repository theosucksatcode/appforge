<template>
  <pre>{{ JSON.stringify(profile, null, 2) }}</pre>
</template>

<script setup lang="ts">
const { profile } = useUserProfile();
</script>
