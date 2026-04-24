# AppForge Finalization Checklist

## 1. Settings Experience

Stick with the dedicated `/settings` route.

Build it responsively so it feels native on mobile, tablet, and desktop, similar to how `default.vue` adapts per screen size (we do have multiple components inside it but you get the idea).

- First allow:
  - updating name
  - updating surname
- Second allow for:
  - email update flow

This will likely require (need to research):

- magic link flow
- callback page
- good success and error handling
- somehow need to make sure latest profile data and Supabase auth data is in the system without having the user have to like log out and log back in but we will see they might have to do that but maybe not

If the email update flow works nicely then I think Google OAuth in the template could be a stretch goal but this is another set up that needs to happen and things like that so think about it but might be worth it since I think most of my apps will use it anyways.

## 2. Consistency Checks

Perform a full UI/UX consistency pass across all screens.

Check for:

- spacing
- heights
- paddings/margins
- typography consistency
- icon sizing
- button sizing
- navigation consistency
- mobile/tablet/desktop responsiveness

The goal is basically every screen should feel like part of the same design system whilst remaining accessible across all screen sizes considering we are going for that native feel across mobile, tablet, and desktop.

Also on top of this our user feedback that we provide whenever errors occur or anything like that needs to be top notch and super easy for the user you know to retry or do whatever they need to do in order to you know do what they want to do. We have one user feedback message that embeds a link back to like `/authenticate` which is super solid and nice for the user so we need to consider things like that.

## 3. Logging Pass

Go component by component and review logging.

The goal is basically that the logs should clearly tell the story of the user journey and app flow.

- Avoid:
  - noisy and redundant logs
  - missing logs in important flows
- Review:
  - auth flow logs
  - onboarding flow logs
  - profile fetch and update logs
  - navigation related logs
  - settings related logs

Check out the Nuxt `useLogger` thing that they provide.

Logs should only happen in local dev. Prod should not have any logs.

## 4. Template / README / Docs Pass

Finalize the project as a reusable template. This basically means using a mixture of todo comments, dedicated doc files, and the project readme we have to make it as easy as possible for the user to get a new project going as quickly as possible. Goal is essentially that a cloned app should be able to go from fresh install to up and running in like 15 minutes.
