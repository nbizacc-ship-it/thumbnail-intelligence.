/**
 * Composites the base thumbnail image with a deterministic text overlay at exactly 1280 × 720.
 * Guarantees crisp 16:9 export and 100% correct typography spelling.
 */
export async function renderCompositeThumbnail(
  baseImageSrc: string,
  exactText?: string,
  placement: string = 'top-left'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas 2D context unavailable'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // 1. Draw base image with proper 16:9 aspect fit
      ctx.drawImage(img, 0, 0, 1280, 720);

      // 2. If exact text is specified, draw deterministic typography
      if (exactText && exactText.trim().length > 0) {
        const text = exactText.trim().toUpperCase();
        const fontSize = 68;
        ctx.font = `900 ${fontSize}px Impact, Montserrat, "Arial Black", sans-serif`;

        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        const paddingX = 24;
        const paddingY = 16;
        const pillWidth = textWidth + paddingX * 2;
        const pillHeight = fontSize + paddingY * 2;

        let pillX = 60;
        let pillY = 60;

        switch (placement) {
          case 'top-left':
            pillX = 60;
            pillY = 60;
            break;
          case 'top-right':
            pillX = 1280 - pillWidth - 60;
            pillY = 60;
            break;
          case 'center-left':
            pillX = 60;
            pillY = (720 - pillHeight) / 2;
            break;
          case 'center':
            pillX = (1280 - pillWidth) / 2;
            pillY = (720 - pillHeight) / 2;
            break;
          case 'bottom-left':
            // Kept safe away from bottom-right 20% timestamp area
            pillX = 60;
            pillY = 720 - pillHeight - 60;
            break;
          default:
            pillX = 60;
            pillY = 60;
        }

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 6;

        // Draw pill background
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 12);
        } else {
          ctx.rect(pillX, pillY, pillWidth, pillHeight);
        }
        ctx.fill();

        // Reset shadow for crisp text
        ctx.shadowColor = 'transparent';

        // Draw text
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'top';
        ctx.fillText(text, pillX + paddingX, pillY + paddingY + 4);
      }

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load candidate image for canvas composition'));
    };

    img.src = baseImageSrc;
  });
}
