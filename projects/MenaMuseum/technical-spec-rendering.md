# Technical Spec: Museum Shorts Generator (Rendering)

**Goal:** Enable users to record a short clip at the entrance, scan QR codes at exhibits, and receive a downloadable merged video (Green Screen/Overlay effect) for social sharing.

---

## 1. Architecture

To minimize friction and cost, we use a **Hybrid Rendering Approach**:
1.  **Client (WebApp):** Handles camera access, "Green Screen" recording, and preview using Canvas API.
2.  **Server (Edge Function):** Handles the final high-quality composition using FFmpeg. This ensures the video plays correctly on all devices (Instagram/TikTok/WhatsApp) and allows us to generate a shareable URL for the "First Comment" automation.

### Flow:
1.  **User Entrance:** Opens WebApp -> Records 5s video -> Uploads to Temp Storage (S3).
2.  **Museum Visit:** Scans QR -> App fetches `Template ID`.
3.  **Composition:** App sends `User Video URL` + `Template ID` to Edge Function.
4.  **Response:** Edge Function runs FFmpeg, returns `Result Video URL`.
5.  **Sharing:** User downloads video or clicks "Auto-share".

---

## 2. Tech Stack

-   **Frontend:** React + TypeScript + Vite + Tailwind (Mobile-first PWA).
-   **Video Library (Client):** `ffmpeg.wasm` (optional, for lightweight preview) OR standard HTML5 `<video>` + Canvas.
-   **Backend:** Cloudflare Workers or AWS Lambda (Node.js).
-   **Processing:** `fluent-ffmpeg` + `ffmpeg-static`.
-   **Storage:** Cloudflare R2 or AWS S3 (Pre-signed URLs).

---

## 3. Key API Endpoints

### `POST /api/generate-short`
Takes the user's video and merges it with the museum background.

**Request:**
```json
{
  "userVideoUrl": "https://r2.cloud/user-clip-123.mp4",
  "templateId": "pharaoh-gold-01",
  "watermark": true
}
```

**Process (Server):**
1.  Download background video (green screen or animated loop).
2.  Download user video.
3.  Run FFmpeg command (Chroma Key or Picture-in-Picture).
4.  Add watermark/URL overlay.
5.  Upload result to public bucket.
6.  Return `resultUrl`.

---

## 4. Implementation Details

### A. Client-Side Recording (React Hook)
Simple hook to capture video blob and upload immediately.

### B. FFmpeg Command (Server)
**Scenario 1: Green Screen (Chroma Key)**
```bash
ffmpeg -i background.mp4 -i user.mp4 -filter_complex "[1:v]colorkey=0x00FF00:0.3:0.2[ckout];[0:v][ckout]overlay=(W-w)/2:(H-h)/2[out]" -map "[out]" output.mp4
```

**Scenario 2: Simple Overlay (Phone Frame)**
```bash
ffmpeg -i background_frame.png -i user.mp4 -filter_complex "[1:v]scale=300:400[fg];[0:v][fg]overlay=10:10" output.mp4
```

---

## 5. Data Tracking (For "Data Prism")
Every scan triggers an analytics event:
```typescript
trackEvent({
  type: 'SCAN_QR',
  exhibitId: 'pharaoh-01',
  userId: 'session-123',
  timestamp: Date.now()
});
```
This aggregates into the Heatmap Dashboard later.
