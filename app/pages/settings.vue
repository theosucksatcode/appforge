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

          <!-- new email step -->
          <template v-if="emailStep === 'idle'">
            <div class="mb-4">
              <p class="text-sm mb-1">Current email</p>
              <UBadge color="neutral" variant="soft">{{
                profile?.email
              }}</UBadge>
            </div>

            <UForm
              :schema="emailSchema"
              :state="emailFormState"
              class="space-y-4"
              loading-auto
              @submit="onEmailSubmit"
            >
              <UFormField label="New email" name="new_email">
                <UInput
                  v-model="emailFormState.new_email"
                  type="email"
                  placeholder="hello@appforge.com"
                  class="w-full"
                />
              </UFormField>

              <UAlert
                v-if="emailError"
                color="error"
                icon="i-lucide-circle-x"
                :title="emailError"
                variant="soft"
              />

              <UAlert
                v-if="emailSuccess"
                color="success"
                icon="i-lucide-circle-check"
                title="Email updated successfully."
                variant="soft"
              />

              <UButton
                type="submit"
                color="primary"
                variant="subtle"
                :disabled="!isEmailDirty"
                class="hover:cursor-pointer"
              >
                Update email
              </UButton>
            </UForm>
          </template>

          <!-- verify new email step -->
          <template v-else-if="emailStep === 'pending-otp'">
            <p class="text-sm text-muted mb-6">
              We sent a 6-digit code to
              <span class="font-medium text-default">{{ pendingNewEmail }}</span
              >. Enter it below to confirm your new email address.
            </p>

            <UForm
              :schema="otpSchema"
              :state="otpFormState"
              class="space-y-4"
              loading-auto
              @submit="onOtpSubmit"
            >
              <UFormField label="Code" name="otp">
                <UPinInput
                  v-model="otpFormState.otp"
                  :length="6"
                  :otp="true"
                  type="number"
                />
              </UFormField>

              <UAlert
                v-if="emailError"
                color="error"
                icon="i-lucide-circle-x"
                :title="emailError"
                variant="soft"
              />

              <div class="flex items-center gap-3">
                <UButton
                  type="submit"
                  color="primary"
                  variant="subtle"
                  class="hover:cursor-pointer"
                >
                  Confirm
                </UButton>
                <UButton
                  type="button"
                  color="neutral"
                  variant="ghost"
                  class="hover:cursor-pointer"
                  @click="cancelEmailChange"
                >
                  Cancel
                </UButton>
                <UButton
                  type="button"
                  color="neutral"
                  variant="ghost"
                  class="hover:cursor-pointer ml-auto"
                  @click="resendEmailOtp"
                >
                  Resend code
                </UButton>
              </div>
            </UForm>
          </template>
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

// composables
const supabase = useSupabaseClient();
const { profile, getUserProfile, refreshUserProfile } = useUserProfile();

// shared state
const loadingProfile = ref(true);
const activeSection = ref<"profile" | "account">("profile");

const settingsNav = [
  { id: "profile" as const, label: "Profile", icon: "i-lucide-user" },
  { id: "account" as const, label: "Account", icon: "i-lucide-shield" },
];

// profile section
const formState = reactive({ first_name: "", last_name: "" });
const originalValues = reactive({ first_name: "", last_name: "" });
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);
let successTimer: ReturnType<typeof setTimeout> | null = null;

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

const isDirty = computed(
  () =>
    formState.first_name !== originalValues.first_name ||
    formState.last_name !== originalValues.last_name,
);

watch(formState, () => {
  if (submitSuccess.value) submitSuccess.value = false;
  if (submitError.value) submitError.value = null;
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

// account / email change section
const emailStep = ref<"idle" | "pending-otp">("idle");
const pendingNewEmail = ref("");
const emailError = ref<string | null>(null);
const emailSuccess = ref(false);
let emailSuccessTimer: ReturnType<typeof setTimeout> | null = null;

const emailFormState = reactive({ new_email: "" });
const otpFormState = reactive<{ otp: number[] }>({ otp: [] });

const isEmailDirty = computed(
  () =>
    emailFormState.new_email.trim() !== "" &&
    emailFormState.new_email.trim() !== (profile.value?.email ?? ""),
);

const emailSchema = computed(() =>
  z.object({
    new_email: z
      .string()
      .trim()
      .min(1, "Please enter your new email address")
      .email("Please enter a valid email address")
      .refine(
        (val) => val !== (profile.value?.email ?? ""),
        "New email must be different from your current email",
      ),
  }),
);
type EmailSchema = { new_email: string };

const otpSchema = z.object({
  otp: z
    .union([z.array(z.number()), z.array(z.string())])
    .transform((val) => val.join(""))
    .pipe(z.string().regex(/^\d{6}$/, "Enter a valid 6-digit code")),
});
type OtpSchema = z.output<typeof otpSchema>;

watch(emailFormState, () => {
  if (emailError.value) emailError.value = null;
  if (emailSuccess.value) emailSuccess.value = false;
});

watch(otpFormState, () => {
  if (emailError.value) emailError.value = null;
});

async function onEmailSubmit(event: FormSubmitEvent<EmailSchema>) {
  emailError.value = null;

  const newEmail = event.data.new_email.trim().toLowerCase();
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    emailError.value =
      error.status === 422
        ? "This email address is already in use."
        : "We couldn't send the confirmation code. Please try again.";
    return;
  }

  pendingNewEmail.value = newEmail;
  emailStep.value = "pending-otp";
}

async function onOtpSubmit(event: FormSubmitEvent<OtpSchema>) {
  emailError.value = null;

  const { error } = await supabase.auth.verifyOtp({
    email: pendingNewEmail.value,
    token: event.data.otp,
    type: "email_change",
  });

  if (error) {
    emailError.value = "Invalid or expired code. Please try again.";
    return;
  }

  await refreshUserProfile();
  emailStep.value = "idle";
  emailFormState.new_email = "";
  otpFormState.otp = [];
  pendingNewEmail.value = "";
  emailSuccess.value = true;
  emailSuccessTimer = setTimeout(() => {
    emailSuccess.value = false;
  }, 4000);
}

async function resendEmailOtp() {
  emailError.value = null;
  const { error } = await supabase.auth.resend({
    type: "email_change",
    email: pendingNewEmail.value,
  });
  if (error) {
    emailError.value = "Couldn't resend the code. Please try again.";
  }
}

function cancelEmailChange() {
  emailStep.value = "idle";
  pendingNewEmail.value = "";
  otpFormState.otp = [];
  emailError.value = null;
}

// lifecycle
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
  if (emailSuccessTimer) clearTimeout(emailSuccessTimer);
});
</script>
