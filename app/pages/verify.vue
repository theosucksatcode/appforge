<template>
  <UAuthForm
    title="Check your email"
    description="We sent a 6-digit code to your email. Enter it below to continue. It may take a few seconds to arrive."
    icon="i-lucide-shield-check"
    :fields="fields"
    :submit="{
      label: 'Continue',
      color: 'primary',
      variant: 'subtle',
    }"
  />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "guest",
});

import type { AuthFormField } from "@nuxt/ui";

const fields = ref<AuthFormField[]>([
  {
    name: "otp",
    type: "otp",
    label: "Code",
    length: 6,
  },
]);
</script>
