Temporary wrap up list:

1. `/onboarding` component that checks against the profile whether the user has been onboarded or not and based on that onboarded value `/verify` either routes to `/onboarding` or `/`
   - One step should be implemented that captures the users name and surname
   - When onboarding is completed the profile needs to be updated accordingly so the user doesnt get pushed to onboarding again
2. Responsive app layout so mobile/tablet (maybe touch to be even more specific) get a bottom navigation whilst desktop (maybe keyboard and mouse to be even more specific might be overboard) get a dashboard sidebar layout
   - Navigation needs to be kept down to a minimum with only Home and Settings being present as navigable routes (we also might need to think about how we want like the URLs and stuff to be set up)
3. Settings page that allows for basic account management like updating name, surname, and email address.
   - This will require an app layout as well as a legitimate callback for the Nuxt Supabase module considering this uses a confirmation link and maybe like a PKCE flow or something
   - Do research on whether its possible for us to know when the PKCE flow is complete so we can maybe like automatically log the user out in order to refresh the session so their updated details are visible and not the old information
4. Session loading awareness like maybe a loader screen to prevent flickers, incorrect redirects, and UI jumping type things
5. Logging consistency checks throughout the entire codebase after everythings been implemented
   - Basically `/verify` and `/authenticate` has already started the user logging journey if we want to call it that but I want to revise whether the story inside those components are enough and then expand on it throughout the rest of the system so that I have like a clear picture of whats going on
