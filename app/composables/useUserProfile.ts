import type { Database } from "@/types/database.types";

type UserProfile = Database["public"]["Tables"]["profiles"]["Row"];

const PROFILE_COLUMNS =
  "id,email,first_name,last_name,onboarded,created_at,updated_at" as const;

export function useUserProfile() {
  const supabase = useSupabaseClient<Database>();
  const profile = useState<UserProfile | null>("user-profile", () => null); // global state for user profile. when its been fetched once it will get cached here and can be accessed by any component across the app using this composable
  const pending = ref(false);
  const error = ref<string | null>(null);

  async function getUserProfile(options?: { force?: boolean }) {
    if (profile.value && !options?.force) {
      console.log("[profile] Returning cached profile.");
      return profile.value;
    }

    console.log("[profile] Fetching profile from database.");
    pending.value = true;
    error.value = null;

    try {
      const { data, error: queryError } = await supabase
        .from("profiles")
        .select(PROFILE_COLUMNS)
        .maybeSingle();

      if (queryError) throw queryError;

      profile.value = data;
      console.log("[profile] Profile fetched successfully.");
      return data;
    } catch (err: any) {
      profile.value = null;
      error.value = err?.message || "Failed to fetch profile";
      console.error("[profile] Failed to fetch profile:", error.value);
      return null;
    } finally {
      pending.value = false;
    }
  }

  // bypass cache and force fetch the latest profile data from the db
  async function refreshUserProfile() {
    return getUserProfile({ force: true });
  }

  function clearUserProfile() {
    profile.value = null;
  }

  return {
    profile: readonly(profile),
    pending: readonly(pending),
    error: readonly(error),
    getUserProfile,
    refreshUserProfile,
    clearUserProfile,
  };
}
