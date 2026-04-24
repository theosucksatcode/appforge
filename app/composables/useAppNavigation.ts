import type { NavigationMenuItem, DropdownMenuItem } from "@nuxt/ui";

export function useAppNavigation() {
  const { profile, clearUserProfile } = useUserProfile();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const navItems: NavigationMenuItem[] = [
    {
      label: "Home",
      icon: "i-lucide-house",
      to: "/",
    },
  ];

  const menuItems = computed<DropdownMenuItem[][]>(() => [
    [
      {
        label: profile.value
          ? `${profile.value.first_name} ${profile.value.last_name}`
          : "Unknown",
        disabled: true,
      },
    ],
    [
      { label: "Settings", icon: "i-lucide-settings", to: "/settings" },
      {
        label: "Log out",
        icon: "i-lucide-log-out",
        color: "error" as const,
        async onSelect() {
          await supabase.auth.signOut();
          await router.push("/authenticate");
          clearUserProfile();
        },
      },
    ],
  ]);

  return { navItems, menuItems, profile };
}
