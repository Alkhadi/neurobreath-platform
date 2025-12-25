// dlx-audio-tts-bridge.js
// Generic audio helper for NB_CURRICULUM ttsClipId values.

(function () {
  const audioCache = new Map();

  function getClipUrl(ttsClipId) {
    if (!ttsClipId) return null;
    return "/audio/phonics/" + ttsClipId + ".mp3";
  }

  function playCurriculumClip(ttsClipId) {
    if (!ttsClipId) return;

    const url = getClipUrl(ttsClipId);
    if (!url) return;

    let audio = audioCache.get(ttsClipId);

    if (!audio) {
      audio = new Audio(url);
      audio.preload = "auto";
      audioCache.set(ttsClipId, audio);
    } else {
      try {
        audio.pause();
      } catch (e) {
        // ignore pause issues
      }
      audio.currentTime = 0;
    }

    audio.play().catch((err) => {
      console.warn("Audio play failed for clip", ttsClipId, err);
    });
  }

  window.NB_AUDIO = window.NB_AUDIO || {};
  window.NB_AUDIO.playCurriculumClip = playCurriculumClip;
})();
