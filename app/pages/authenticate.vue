<template>
  <UAuthForm
    title="Sign in"
    description="Enter your email and we'll send you a one-time code to continue. We'll create an account if you're new."
    icon="i-lucide-mail"
    :fields="fields"
    :schema="schema"
    :submit="{
      label: 'Continue',
      color: 'primary',
      variant: 'subtle',
    }"
    @submit="onSubmit"
    loading-auto
  >
    <template #validation>
      <UAlert
        v-if="authError"
        color="error"
        :title="authError"
        variant="soft"
      />
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "guest",
  middleware: "guest",
});

import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";

const supabase = useSupabaseClient();
const authError = ref<string | null>(null);

const schema = z.object({
  email: z
    .string()
    .min(1, "Please enter your email address") // fires when fields left empty
    .email("Please enter a valid email address"), // fires when input isnt email format
});
type Schema = z.output<typeof schema>;
const fields = ref<AuthFormField[]>([
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "hello@appforge.com",
    required: true,
    defaultValue: "",
  },
]);

const pendingEmail = useCookie("pending-auth-email", {
  maxAge: 60 * 5, // expires in 5 minutes
  sameSite: "lax",
  secure: true,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  authError.value = null;

  const email = event.data.email.trim().toLowerCase();
  console.log("[auth] OTP request sent to", email);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // create an account if its a new user
    },
  });

  if (error) {
    console.error("[auth] OTP failed:", error.message);
    authError.value = "Failed to send OTP. Please try again.";
    return;
  }

  pendingEmail.value = email;
  console.log(
    "[auth] OTP sent. Navigating to /verify with pending email:",
    pendingEmail.value,
  );
  await navigateTo("/verify");
}
</script>
