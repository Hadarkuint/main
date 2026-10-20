const waves = VANTA.WAVES({
  el: "body",
  color: "#5c6767",
  mouseControls: true,
  touchControls: false,
  gyroControls: false,
  minHeight: 10.0,
  minWidth: 10.0,
  scale: 1,
  scaleMobile: 1.0,
  shininess: 0.0,
  waveHeight: 3.0,
  waveSpeed: 1,
  zoom: 0.4,
});

const portrait = document.querySelector(".portrait");
const defaultWaveColor = new THREE.Color(waves.options.color);
const currentWaveColor = defaultWaveColor.clone();
const hoverWaveColor = new THREE.Color("#3a4c60");
const defaultWaveOptions = {
  shininess: waves.options.shininess,
  waveHeight: waves.options.waveHeight,
  waveSpeed: waves.options.waveSpeed,
};
const hoverWaveOptions = {
  shininess: 30,
  waveHeight: 10,
  waveSpeed: 4,
};
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let waveAnimation;

function transitionWave(targetColor, targetOptions) {
  cancelAnimationFrame(waveAnimation);

  if (reducedMotion.matches) {
    currentWaveColor.copy(targetColor);
    waves.setOptions({
      color: currentWaveColor.getHex(),
      ...targetOptions,
    });
    return;
  }

  const startColor = currentWaveColor.clone();
  const startOptions = {
    shininess: waves.options.shininess,
    waveHeight: waves.options.waveHeight,
    waveSpeed: waves.options.waveSpeed,
  };
  const startTime = performance.now();

  function animateWave(now) {
    const progress = Math.min((now - startTime) / 2000, 1);
    const easedProgress = progress * progress * (3 - 2 * progress);
    currentWaveColor.copy(startColor).lerp(targetColor, easedProgress);
    waves.setOptions({
      color: currentWaveColor.getHex(),
      shininess:
        startOptions.shininess +
        (targetOptions.shininess - startOptions.shininess) * easedProgress,
      waveHeight:
        startOptions.waveHeight +
        (targetOptions.waveHeight - startOptions.waveHeight) * easedProgress,
      waveSpeed:
        startOptions.waveSpeed +
        (targetOptions.waveSpeed - startOptions.waveSpeed) * easedProgress,
    });

    if (progress < 1) {
      waveAnimation = requestAnimationFrame(animateWave);
    }
  }

  waveAnimation = requestAnimationFrame(animateWave);
}

if (portrait) {
  portrait.addEventListener("mouseenter", () =>
    transitionWave(hoverWaveColor, hoverWaveOptions),
  );
  portrait.addEventListener("mouseleave", () =>
    transitionWave(defaultWaveColor, defaultWaveOptions),
  );

  if (portrait.matches(":hover")) {
    transitionWave(hoverWaveColor, hoverWaveOptions);
  }
}
