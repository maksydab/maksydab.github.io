document.addEventListener("DOMContentLoaded", () => {
  const eyeballs = document.querySelectorAll('.eyeball');

  eyeballs.forEach(eye => {
    const iris = document.createElement('div');
    iris.className = 'iris';

    const pupil = document.createElement('div');
    pupil.className = 'pupil';

    const highlight = document.createElement('div');
    highlight.className = 'highlight';

    iris.appendChild(pupil);
    iris.appendChild(highlight);
    eye.appendChild(iris);

    const maxMoveRatio = 0.2; // max iris movement relative to eyeball size

    let target = { x: 0, y: 0 };
    let current = { x: 0, y: 0 };

    let wanderStart = performance.now();
    let wanderDuration = 1500 + Math.random() * 1500; // 1.5 to 3 seconds

    // Will hold the mouse position relative to viewport
    let mousePos = { x: null, y: null };

    // Listen for mouse move globally
    window.addEventListener('mousemove', e => {
      mousePos.x = e.clientX;
      mousePos.y = e.clientY;
    });

    function pickRandomTarget() {
      // Random point inside a circle radius = 1 (normalized)
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.sqrt(Math.random()); // sqrt for uniform distribution in circle
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      };
    }

    // Pick initial target
    target = pickRandomTarget();

    function update(timestamp) {
      const rect = eye.getBoundingClientRect();
      const maxMove = rect.width * maxMoveRatio;

      // Calculate progress of current wander
      let progress = (timestamp - wanderStart) / wanderDuration;
      if (progress >= 1) {
        // Time to pick a new target and reset timer
        wanderStart = timestamp;
        wanderDuration = 500 + Math.random() * 1500;
        target = pickRandomTarget();
        progress = 0;
      }

      if (mousePos.x !== null && mousePos.y !== null) {
        // Calculate vector from eyeball center to mouse
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = mousePos.x - centerX;
        let dy = mousePos.y - centerY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const followRadius = rect.width * 2.5; // radius of eyeball (assuming circle)

        if (distance < followRadius) {
          // Mouse is close enough - follow mouse with clamping

          // Clamp dx, dy inside maxMove range
          // maxMove is max iris movement from center
          if (distance === 0) {
            dx = 0;
            dy = 0;
          } else {
            const scale = Math.min(distance, maxMove) / distance;
            dx *= scale;
            dy *= scale;
          }

          // Smoothly move iris towards mouse position
          current.x += (dx - current.x) * 0.1;
          current.y += (dy - current.y) * 0.1;
        } else {
          // Mouse far - continue wandering
          current.x += (target.x * maxMove - current.x) * 0.1;
          current.y += (target.y * maxMove - current.y) * 0.1;
        }
      } else {
        // No mouse position yet, just wander
        current.x += (target.x * maxMove - current.x) * 0.1;
        current.y += (target.y * maxMove - current.y) * 0.1;
      }

      iris.style.transform = `translate(calc(-50% + ${current.x}px), calc(-50% + ${current.y}px))`;

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
});
