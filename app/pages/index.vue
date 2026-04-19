<template>
  <pre>{{ JSON.stringify(user, null, 2) }}</pre>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
</script>
