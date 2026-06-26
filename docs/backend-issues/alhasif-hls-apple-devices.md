# Al-Hasif self-hosted videos do not play on Apple devices (iPad / iPhone)

**Audience:** backend / video-delivery team
**Scope:** our own Al-Hasif HLS pipeline only.

---

## The issue

Our Al-Hasif self-hosted HLS streams are encrypted with **ClearKey**
(`org.w3.clearkey`) — the decryption key is delivered by our pipeline when the
manifest requests it. **Apple devices cannot decrypt ClearKey.** Apple's WebKit
media stack supports only **FairPlay** and standard **AES-128** HLS encryption;
it does not implement ClearKey at all.

On iOS/iPadOS, **every** browser (Safari, Chrome, Firefox, Edge) is built on
Apple's WebKit engine, so this is not a per-browser issue — the stream fails to
decrypt on **all** of them. The result is that users on iPad/iPhone cannot play
**any** Al-Hasif lesson. The same streams decrypt and play fine on desktop.

## Current delivery (for reference)

- **Manifest:** `https://video.cdn1.stc.training/stream/hls/{uuid}/playlist.m3u8`
  (`application/vnd.apple.mpegurl`)
- **Encryption:** ClearKey (`org.w3.clearkey`); key served by our key endpoint
  on manifest request.

## Root cause

ClearKey EME is unsupported on Apple WebKit. The only content-protection schemes
an iPad/iPhone can decrypt for HLS are **AES-128** (standard HLS encryption) and
**FairPlay** (Apple's DRM).

---

## What we need from you — the solution

Deliver Apple devices a stream they can decrypt. Two viable paths:

| Option | What it is | Plays on iPad/iPhone? | Protection level | Effort |
|---|---|---|---|---|
| **A. AES-128 HLS** (recommended first) | Standard HLS encryption — `#EXT-X-KEY:METHOD=AES-128`, key delivered over HTTPS (ideally token-guarded) | ✅ natively, no EME needed | Transport encryption (key is fetchable by an authenticated client) — not DRM-grade | Low–medium |
| **B. FairPlay HLS** | Apple's DRM — `SAMPLE-AES` + a FairPlay key server (KSM/SKD) + an Apple FairPlay deployment certificate | ✅ (Safari most reliable) | DRM-grade, equivalent to what ClearKey gives elsewhere | High |

**Recommendation:** if the goal is "encrypted and actually plays on Apple
devices," **Option A (AES-128 HLS)** is the pragmatic fix — iPad/iPhone play
AES-128 HLS natively, with no DRM/EME involved, which removes the ClearKey
blocker entirely. Choose **Option B (FairPlay)** only if true DRM-grade
protection on Apple devices is a hard requirement.

You do not need to change desktop delivery — keep ClearKey there. Only the
Apple-device variant needs to change.

## Targeting Apple devices

Serve the Apple variant by branching on the request **User-Agent** at the
manifest/key endpoint (iPhone / iPad / Mac-Safari → AES-128 or FairPlay variant),
**or** accept an explicit `platform=apple` parameter on the manifest request —
we can include that parameter if you prefer not to rely on User-Agent. Tell us
which you want, plus the endpoint contract (manifest URL and key/license URL),
and we'll consume it.

## How to verify

1. On a **real** iPad/iPhone (not a desktop browser's device-emulation mode,
   which gives misleading results), open an Al-Hasif lesson in **Safari** → it
   fails to decrypt today.
2. Open the same lesson in **Chrome on the same device** → also fails (same
   WebKit engine).
3. The same lesson plays on **desktop**.
4. After the Apple-device AES-128 / FairPlay variant ships, repeat step 1 → it
   should play.
