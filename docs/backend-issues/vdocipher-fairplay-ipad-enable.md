# How to fix VdoCipher videos on iPad / iPhone (enable FairPlay)

**Audience:** whoever owns/admins the **VdoCipher account** (not a code task).
**Goal:** make `vdocipher` lessons play on Apple devices (iPad, iPhone).
**Effort:** account/dashboard change + a one-time setup with VdoCipher. **No
frontend or backend code change is required.**

---

## Why this is needed (one paragraph)

VdoCipher protects video with **Widevine** (Android, desktop Chrome/Edge/Firefox)
and **FairPlay** (Apple devices). On iPad/iPhone, Widevine is unavailable —
Apple's WebKit only does FairPlay — so an iPad **must** use the FairPlay path.
**FairPlay is not enabled by default**; VdoCipher requires a separate, manual,
one-time activation per account. If it isn't enabled, VdoCipher videos fail on
every Apple device, regardless of browser. (Chrome on iPad is WebKit too, so it
doesn't help.)

---

## Step-by-step

1. **Find out who has VdoCipher dashboard access** for our account
   (the login used to upload/manage videos at `https://www.vdocipher.com/`).

2. **Log in to the VdoCipher dashboard.**

3. **Check current FairPlay status.** Go to the account / DRM / settings area and
   look for **"Apple FairPlay"**. If it shows *not enabled / not configured*,
   that confirms the root cause.

4. **Request FairPlay activation.** FairPlay can't be self-toggled — it requires
   VdoCipher to provision an Apple FairPlay certificate on the account. Open a
   request via the dashboard support widget or email **support@vdocipher.com**
   with: *"Please enable Apple FairPlay DRM for our account so our videos play on
   iPad/iPhone."*
   - Note: VdoCipher has historically charged a **one-time setup fee** for
     FairPlay (publicly cited around **$100**, but **confirm the current price
     and any plan requirement with them** — it may have changed).

5. **Let VdoCipher complete the FairPlay provisioning.** This is done on their
   side once they action the request; there's nothing to deploy on ours.

6. **Verify on a real iPad:**
   - Open a `vdocipher` lesson in **Safari on an actual iPad** → it should now
     play.
   - Then try **Chrome on the same iPad**. It may still be occasionally flaky on
     iPad Chrome even with FairPlay (a known VdoCipher/WebKit quirk) — so:

7. **Tell users to prefer Safari on iPad** for video, as the most reliable Apple
   browser. (Optional: we can add an in-app hint on Apple devices — ask the
   frontend team.)

---

## What to tell us (frontend) afterwards

- Confirm FairPlay is enabled and a `vdocipher` lesson plays on a real iPad.
- If you want, we'll add an **iPad detection + "open in Safari for best
  playback" hint** so users stop hitting silent failures. That's a small
  frontend change we can do on request.

---

## Important: this only covers VdoCipher videos

Lessons that use our **self-hosted HLS (`TYPE_HASIF`)** have a **separate** iPad
problem (ClearKey DRM, which Apple devices can't decrypt at all). That one needs
a **backend delivery change** and is documented in
[`alhasif-hls-apple-devices.md`](alhasif-hls-apple-devices.md). Enabling VdoCipher
FairPlay does **not** fix the self-hosted videos.
