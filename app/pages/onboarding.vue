<template>
  <UAuthForm
    title="Finish setting up your account"
    description="Just one more step to complete your profile. Tell us your name and surname so we can personalize your experience."
    icon="i-lucide-user"
    :fields="fields"
    :schema="schema"
    :submit="{
      label: 'Get started',
      color: 'primary',
      variant: 'subtle',
    }"
    @submit="onSubmit"
    loading-auto
  >
    <template #validation>
      <UAlert
        v-if="submitError"
        color="error"
        :title="submitError"
        variant="soft"
      />
    </template>
  </UAuthForm>
</template>

<script setup lang="ts">
console.log("[onboarding] Starting onboarding flow.");

definePageMeta({
  layout: "guest",
});

import * as z from "zod";
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { getUserProfile, refreshUserProfile, profile } = useUserProfile();
const submitError = ref<string | null>(null);

const schema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(50, "Name must be 50 characters or less"),
  last_name: z
    .string()
    .trim()
    .min(1, "Please enter your surname")
    .max(50, "Surname must be 50 characters or less"),
});
type Schema = z.output<typeof schema>;
const fields = ref<AuthFormField[]>([
  {
    name: "first_name",
    type: "text",
    label: "Name",
    placeholder: "App",
    required: true,
    defaultValue: "",
  },
  {
    name: "last_name",
    type: "text",
    label: "Surname",
    placeholder: "Forge",
    required: true,
    defaultValue: "",
  },
]);

onMounted(async () => {
  const currentProfile = await getUserProfile();
  if (currentProfile?.onboarded) {
    console.log("[onboarding] User already onboarded. Redirecting to /");
    await navigateTo("/");
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitError.value = null;

  if (!user.value) {
    console.error("[onboarding] No authenticated user found");
    submitError.value = "Session error. Please sign in again.";
    return;
  }
  if (!profile.value) {
    console.error("[onboarding] No user profile found");
    submitError.value = "Profile error. Please refresh the page.";
    return;
  }

  const { first_name, last_name } = event.data;
  console.log("[onboarding] Saving profile for", user.value.email);

  const { error } = await supabase
    .from("profiles")
    .update({ first_name, last_name, onboarded: true })
    .eq("id", profile.value.id);

  if (error) {
    console.error("[onboarding] Failed to update profile:", error.message);
    submitError.value =
      "We couldn’t save your details. Please try again or refresh the page.";
    return;
  }

  console.log(
    "[onboarding] Profile updated. Refreshing profile and navigating to /",
  );
  await refreshUserProfile();
  await navigateTo("/");
}
</script>
