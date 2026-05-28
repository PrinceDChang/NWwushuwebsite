function initHomeHeroVideo() {
  const container = document.querySelector('.home-hero__video');
  if (!container) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  if (container.querySelector('iframe')) return;

  const videoId = container.dataset.videoId;
  if (!videoId) return;

  const params = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    controls: '0',
    disablekb: '1',
    fs: '0',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    iv_load_policy: '3',
    cc_load_policy: '0',
    enablejsapi: '1',
    origin: window.location.origin,
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'home-hero__video-inner';

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  iframe.title = 'Background video';
  iframe.tabIndex = -1;
  iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');

  wrapper.appendChild(iframe);
  container.appendChild(wrapper);
}

initHomeHeroVideo();
document.addEventListener('astro:page-load', initHomeHeroVideo);
