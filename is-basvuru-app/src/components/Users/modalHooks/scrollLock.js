// scrollLock.js
let lockCount = 0;

export function lockScroll() {
  lockCount++;
  if (lockCount === 1) {
    const html = document.documentElement;
    const body = document.body;

    // Scrollbar kaybolunca layout sıçramasın diye padding-right telafisi
    const scrollbarComp = window.innerWidth - html.clientWidth;
    if (scrollbarComp > 0) body.style.paddingRight = `${scrollbarComp}px`;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  if (lockCount > 0) lockCount--;
  if (lockCount === 0) {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "";
    body.style.overflow = "";
    body.style.paddingRight = "";
  }
}
