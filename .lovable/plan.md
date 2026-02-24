
# Fix Audio on Hover-to-Play for Shorts

## Problem
The YouTube embed iframe uses `mute=1` in the URL, which silences all audio during hover previews. Browser autoplay policies require videos to be muted for autoplay to work -- so simply removing `mute=1` will cause the preview to not autoplay at all in most browsers.

## Solution
Since browsers block unmuted autoplay, we need a two-step approach:

1. **Keep `mute=1` for autoplay** so the preview reliably starts playing on hover
2. **Add a visible "unmute" button overlay** on the playing preview so users can click to enable audio
3. When the user clicks unmute, we reload the iframe without `mute=1` (or use the YouTube IFrame API to unmute programmatically)

### Implementation

**File: `src/components/ContentRail.tsx`**

- Add an `isMuted` state (default `true`) alongside the existing `showPlayer` state
- When `showPlayer` is true, render the iframe with `mute=1` initially
- Overlay a small speaker/volume icon button (using Lucide `Volume2` / `VolumeX` icons) in the bottom-right corner of the playing preview
- On click of the unmute button:
  - Prevent the Link navigation (`e.preventDefault()` + `e.stopPropagation()`)
  - Set `isMuted` to `false`, which changes the iframe `src` to remove `mute=1` (this will reload the embed unmuted -- since the user clicked, the browser allows it)
- Reset `isMuted` to `true` on `mouseLeave`

### Technical Details

```text
MediaCard state:
  showPlayer: boolean (existing)
  isMuted: boolean (new, default true)

iframe src logic:
  mute=${isMuted ? 1 : 0}

Unmute button:
  - Position: absolute bottom-2 right-2 z-20
  - Icon: VolumeX when muted, Volume2 when unmuted
  - onClick: e.preventDefault(), e.stopPropagation(), toggle isMuted
  - Style: glass-morphism small circle button
```

This approach works because:
- Autoplay with mute works reliably across all browsers
- The unmute click counts as a user gesture, so browsers allow audio after that interaction
- The iframe `src` change forces a reload with audio enabled
