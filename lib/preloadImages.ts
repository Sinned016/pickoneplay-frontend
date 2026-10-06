// Loads and decodes an image in the background so it can be painted instantly later.
// Always resolves — a broken image should never block the game from starting.
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();

    img.onload = () => {
      // decode() makes sure the bitmap is ready, not just downloaded.
      img.decode().then(resolve, resolve);
    };
    img.onerror = () => resolve();

    img.src = src;
  });
}
