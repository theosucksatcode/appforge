<template>
  <UAuthForm
    title="Sign in"
    description="Enter your email and we'll send you a one-time code to continue. We'll create an account if you're new."
    icon="i-lucide-mail"
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
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "hello@appforge.com",
  },
]);
</script>
