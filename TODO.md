# AppForge Finalization Checklist

## 1. Settings Experience ✅

Stick with the dedicated `/settings` route.

Build it responsively so it feels native on mobile, tablet, and desktop, similar to how `default.vue` adapts per screen size (we do have multiple components inside it but you get the idea).

- First allow:
  - updating name ✅
  - updating surname ✅
- Second allow for:
  - email update flow ✅

_Was able to implement this using OTP flow that the template has been using for everything so the Google OAuth stretch is now even more of a stretch considering to get that in it will need its own whole operation and not just piggy back off of what I thought the settings flow would be._

## 2. Implement Toasts

I want to change all Alert components to toasts. Nuxt gives quite a comprehensive toast system out of the box and I want to utilize it to make user feedback as clear as possible and also to like make retrying or do whatever actions they need to do to rectify the issue easier.

## 3. Consistency Checks

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

## 4. Logging Pass

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

## 5. Template / README / Docs Pass

Finalize the project as a reusable template. This basically means using a mixture of todo comments, dedicated doc files, and the project readme we have to make it as easy as possible for the user to get a new project going as quickly as possible. Goal is essentially that a cloned app should be able to go from fresh install to up and running in like 15 minutes.
