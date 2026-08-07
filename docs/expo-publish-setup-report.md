# Resonance: Fractured Frequency — Publish Setup Guide (for the colleague helping)

**Project:** Resonance: Fractured Frequency (Digital Dragons Inc.)
**Written:** 7 August 2026
**Purpose:** The project owner uses VoiceOver, and part of Replit's publish
interface is not accessible to a screen reader. This document gives a sighted
colleague everything needed to complete two one-time setup jobs:

1. Connect the **Apple Developer account** so the iPhone app can be built and
   sent to TestFlight.
2. Connect the **web game** to the subdomain
   **resonance.digitaldragonsinc.com** (manual DNS setup).

Everything else — code, builds, testing — is already handled. These are the
only two steps that need human hands on the owner's behalf.

> **Important:** The owner types their own passwords. Your job is to navigate
> the screens; never ask for, view, or store their Apple ID password.

---

## Job 1 — Apple Developer sign-in (iPhone app)

### What you need
- Access to the owner's Replit account/workspace (owner present, signed in).
- The owner beside you to enter their Apple ID credentials:
  **lenanawai@icloud.com** (must be enrolled in the Apple Developer Program —
  see https://docs.replit.com/build/mobile-apple-account if enrolment is not
  finished yet; enrolment is done at developer.apple.com and takes about a day).

### Steps (in the Replit workspace)
1. Open the project **Resonance-Fractured-Frequency** in Replit
   (web browser at replit.com is fine).
2. Open the **Publishing** tool (the "Publish" pane).
3. Choose the **mobile app**: *Resonance Mobile* (NOT the web app).
   This starts Replit's **Launch** wizard for iOS.
4. When prompted, **sign in with the Apple Developer account**. Hand the
   keyboard to the owner for the password and any two-factor code
   (the code arrives on their Apple devices).
5. **Bundle ID** — the wizard will ask for one. This is permanent and can
   never be changed afterwards. Enter exactly:

   ```
   com.digitaldragonsinc.fracturedfrequency
   ```

6. Let Replit build, sign, and upload the app. No other settings need
   changing — the project is already verified build-ready.
7. First builds go through a short Apple **TestFlight beta review**
   (typically hours to a day). When approved, the owner installs the app on
   their iPhone through the **TestFlight** app.

Reference docs:
- https://docs.replit.com/build/mobile-app
- https://docs.replit.com/build/mobile-apple-account
- https://docs.replit.com/build/mobile-upload-ios
- https://docs.replit.com/build/mobile-testflight

---

## Job 2 — Subdomain for the web game (manual DNS)

**Goal:** the web version of the game lives at
**https://resonance.digitaldragonsinc.com**

### Part A — in Replit
1. In the same Publishing tool, select the **web app**
   (*Resonance Fractured Frequency*). If it is not yet published, publish it
   first (Autoscale is fine; defaults are fine).
2. Open the **Domains** tab of the Publishing tool.
3. Choose **connect an existing domain** and enter:

   ```
   resonance.digitaldragonsinc.com
   ```

4. Replit will display **two DNS records** — an **A record** and a
   **TXT record**. Keep this screen open or copy both values exactly.

### Part B — at the DNS provider for digitaldragonsinc.com
1. Sign in to wherever digitaldragonsinc.com's DNS is managed
   (the domain registrar, or Cloudflare, etc.).
2. Add the two records Replit showed you, both with host/name
   **`resonance`** (some providers want the full
   `resonance.digitaldragonsinc.com`):
   - **A record** → the IP address Replit displayed
   - **TXT record** → the verification value Replit displayed
3. **Do not delete the TXT record later** — Replit needs it permanently to
   issue and renew the SSL certificate.
4. If the provider proxies traffic (e.g. Cloudflare orange cloud), turn the
   proxy **off** (DNS-only) for this record.

### Part C — verify
1. Back in Replit's Domains tab, wait for the domain to show **verified /
   linked** (DNS can take a few minutes up to ~48 hours, usually fast).
2. Visit https://resonance.digitaldragonsinc.com and confirm the game loads
   with a padlock (valid SSL).

Reference docs:
- https://docs.replit.com/build/add-custom-domain
- https://docs.replit.com/features/publishing/custom-domains

---

## Accessibility note (please read)

The owner reports the Publish pane's Apple sign-in step cannot be operated
with VoiceOver in the Replit iOS app. While you're helping:
- Let the owner drive wherever the interface allows; only take over the
  parts VoiceOver cannot reach.
- Afterwards, please help the owner file this with Replit support
  (Help → Support): "The Publishing pane's Apple sign-in cannot be operated
  with VoiceOver on iOS." First-hand reports get accessibility bugs fixed.

## Done checklist

- [ ] Apple Developer account connected in the Launch wizard
- [ ] Bundle ID entered: `com.digitaldragonsinc.fracturedfrequency` (permanent)
- [ ] iOS build uploaded; TestFlight review started
- [ ] Owner has the app installing via TestFlight
- [ ] Web app published
- [ ] `resonance.digitaldragonsinc.com` added in Domains tab
- [ ] A + TXT records added at the DNS provider (TXT kept permanently)
- [ ] Domain shows verified; site loads over HTTPS
