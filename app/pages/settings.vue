<template>
  <div>
    <!-- user profile loading state -->
    <div v-if="loadingProfile" class="flex items-center gap-2">
      <UIcon name="i-lucide-loader-circle" class="animate-spin size-4" />
      <span class="text-sm">Loading...</span>
    </div>

    <!-- settings shell -->
    <div v-else class="flex flex-col md:flex-row md:gap-0">
      <!-- mobile tabs -->
      <UTabs
        v-model="activeSection"
        value-key="id"
        :items="settingsNav"
        :content="false"
        color="neutral"
        variant="link"
        class="md:hidden mb-6"
      />

      <!-- desktop/tablet left nav -->
      <nav class="hidden md:flex flex-col gap-2">
        <UButton
          v-for="item in settingsNav"
          :key="item.id"
          color="neutral"
          :variant="activeSection === item.id ? 'soft' : 'ghost'"
          :leading-icon="item.icon"
          @click="activeSection = item.id"
          class="hover:cursor-pointer"
        >
          {{ item.label }}
        </UButton>
      </nav>

      <!-- desktop/tablet vertical divider -->
      <div
        class="hidden md:block w-px border-l border-default self-stretch mx-6"
      />

      <!-- content -->
      <div class="flex-1 min-w-0">
        <!-- profile -->
        <template v-if="activeSection === 'profile'">
          <div class="mb-6">
            <h2 class="font-semibold">Profile</h2>
            <p class="text-sm text-muted mt-0.5">
              Update how you appear in the app.
            </p>
          </div>

          <UForm
            :schema="schema"
            :state="formState"
            class="space-y-4"
            loading-auto
            @submit="onSubmit"
          >
            <UFormField label="Name" name="first_name">
              <UInput
                v-model="formState.first_name"
                placeholder="App"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Surname" name="last_name">
              <UInput
                v-model="formState.last_name"
                placeholder="Forge"
                class="w-full"
              />
            </UFormField>

            <UAlert
              v-if="submitError"
              color="error"
              icon="i-lucide-circle-x"
              :title="submitError"
              variant="soft"
            />

            <UAlert
              v-if="submitSuccess"
              color="success"
              icon="i-lucide-circle-check"
              title="Profile updated successfully."
              variant="soft"
            />

            <UButton
              type="submit"
              color="primary"
              variant="subtle"
              :disabled="!isDirty"
              class="hover:cursor-pointer"
            >
              Save changes
            </UButton>
          </UForm>
        </template>

        <!-- account -->
        <template v-else-if="activeSection === 'account'">
          <div class="mb-6">
            <h2 class="text-base font-semibold">Account</h2>
            <p class="text-sm text-muted mt-0.5">
              Manage your account and email settings.
            </p>
          </div>
          <UBadge color="info" label="Coming soon" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

definePageMeta({
  title: "Settings",
});

const supabase = useSupabaseClient();
const { profile, getUserProfile, refreshUserProfile } = useUserProfile();

const loadingProfile = ref(true);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);
const activeSection = ref<"profile" | "account">("profile");

let successTimer: ReturnType<typeof setTimeout> | null = null;

const settingsNav = [
  { id: "profile" as const, label: "Profile", icon: "i-lucide-user" },
  { id: "account" as const, label: "Account", icon: "i-lucide-shield" },
];

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

const formState = reactive({
  first_name: "",
  last_name: "",
});
const originalValues = reactive({
  first_name: "",
  last_name: "",
});
const isDirty = computed(() => {
  return (
    formState.first_name !== originalValues.first_name ||
    formState.last_name !== originalValues.last_name
  );
});

watch(formState, () => {
  if (submitSuccess.value) submitSuccess.value = false;
  if (submitError.value) submitError.value = null;
});

onMounted(async () => {
  const currentProfile = await getUserProfile();
  formState.first_name = currentProfile?.first_name ?? "";
  formState.last_name = currentProfile?.last_name ?? "";
  originalValues.first_name = currentProfile?.first_name ?? "";
  originalValues.last_name = currentProfile?.last_name ?? "";
  loadingProfile.value = false;
});

onBeforeUnmount(() => {
  if (successTimer) clearTimeout(successTimer);
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  submitError.value = null;
  submitSuccess.value = false;

  if (!profile.value) {
    submitError.value = "Profile not found. Please refresh the page.";
    return;
  }

  const { first_name, last_name } = event.data;

  const { error } = await supabase
    .from("profiles")
    .update({ first_name, last_name })
    .eq("id", profile.value.id);

  if (error) {
    submitError.value = "We couldn't save your changes. Please try again.";
    return;
  }

  await refreshUserProfile();
  originalValues.first_name = first_name;
  originalValues.last_name = last_name;
  submitSuccess.value = true;
  successTimer = setTimeout(() => {
    submitSuccess.value = false;
  }, 4000);
}
</script>
