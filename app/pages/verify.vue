<template>
  <UAuthForm
    title="Check your email"
    description="We sent a 6-digit code to your email. Enter it below to continue. It may take a few seconds to arrive."
    icon="i-lucide-shield-check"
    :fields="fields"
    :schema="schema"
    :submit="{
      label: 'Continue',
      color: 'primary',
      variant: 'subtle',
      disabled: sessionExpired,
    }"
    @submit="onSubmit"
    loading-auto
  >
    <template #validation>
      <UAlert v-if="sessionExpired" color="error" variant="soft">
        <template #description>
          Your session has expired or is invalid.
          <NuxtLink to="/authenticate" class="underline"
            >Request a new code</NuxtLink
          >
          to continue.
        </template>
      </UAlert>
      <UAlert
        v-else-if="authError"
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
const sessionExpired = ref(false);
const { getUserProfile } = useUserProfile();

const schema = z.object({
  otp: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (Array.isArray(val) ? val.join("") : val))
    .pipe(z.string().regex(/^\d{6}$/, "Enter a valid 6-digit code")),
});
type Schema = z.input<typeof schema>;
const fields = ref<AuthFormField[]>([
  {
    name: "otp",
    type: "otp",
    label: "Code",
    length: 6,
    required: true,
    defaultValue: [],
  },
]);

const pendingEmail = useCookie("pending-auth-email", {
  maxAge: 60 * 5, // expires in 5 minutes
  sameSite: "lax",
  secure: true,
});

onMounted(() => {
  // if theres no pending email it means the user either came here directly or their session expired so in both cases we send them back to /authenticate to start the flow again
  if (!pendingEmail.value) {
    handleMissingOrExpiredSession();
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (!pendingEmail.value) {
    handleMissingOrExpiredSession();
    return;
  }

  authError.value = null;

  const raw = event.data.otp;
  const token = Array.isArray(raw) ? raw.join("") : raw;
  console.log(`[auth] Verifying OTP (${token}) for`, pendingEmail.value);

  const { error } = await supabase.auth.verifyOtp({
    email: pendingEmail.value,
    token,
    type: "email",
  });

  if (error) {
    console.error("[auth] OTP verification failed:", error.message);
    authError.value = "Invalid or expired code. Please try again.";
    return;
  }

  pendingEmail.value = null; // verification successful so clear cookie
  console.log("[auth] OTP verified. Fetching user profile.");
  const userProfile = await getUserProfile({ force: true }); // forcing skips cache to ensure we get the latest data on each session initialization

  if (!userProfile) {
    console.error("[auth] Signed in in but failed to fetch user profile");
    authError.value =
      "Failed to fetch user profile after successful authentication. Please try again.";
    return;
  }

  console.log(
    "[auth] OTP verified. User onboarded status:",
    userProfile.onboarded,
  );
  await navigateTo(userProfile.onboarded ? "/" : "/onboarding");
}

function handleMissingOrExpiredSession() {
  console.warn(
    "[auth] Missing or expired email cookie. Redirecting to /authenticate",
  );
  sessionExpired.value = true;
}
</script>
