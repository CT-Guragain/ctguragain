// Helix hover effect for .btn-ghost buttons
// Draws two sine-wave strands across the button that twist while hovered.
// Colors are pulled from the site's own CSS variables so it always matches
// the current theme (marigold + moss), no matter what they're set to.
(function () {
  function initHelixButtons() {
    var rootStyles = getComputedStyle(document.documentElement);
    var colorA = (rootStyles.getPropertyValue('--marigold') || '#d99a3d').trim();
    var colorB = (rootStyles.getPropertyValue('--moss') || '#8ba38c').trim();

    document.querySelectorAll('.btn-ghost').forEach(function (btn) {
      if (btn.querySelector('.helix-canvas')) return; // already wired up

      var canvas = document.createElement('canvas');
      canvas.className = 'helix-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      btn.appendChild(canvas);

      var ctx = canvas.getContext('2d');
      var raf = null;
      var t = 0;

      function resize() {
        var rect = btn.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }

      function draw() {
        var w = canvas.width, h = canvas.height;
        var mid = h / 2, amp = Math.max(h / 2 - 4, 2);
        ctx.clearRect(0, 0, w, h);
        for (var x = 0; x < w; x += 4) {
          var y1 = mid + Math.sin((x / w) * Math.PI * 4 + t) * amp;
          var y2 = mid + Math.sin((x / w) * Math.PI * 4 + t + Math.PI) * amp;
          ctx.fillStyle = colorA;
          ctx.globalAlpha = 0.65;
          ctx.beginPath(); ctx.arc(x, y1, 1.4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = colorB;
          ctx.globalAlpha = 0.6;
          ctx.beginPath(); ctx.arc(x, y2, 1.4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        t += 0.12;
        raf = requestAnimationFrame(draw);
      }

      function start() {
        resize();
        if (!raf) draw();
      }
      function stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      btn.addEventListener('mouseenter', start);
      btn.addEventListener('mouseleave', stop);
      btn.addEventListener('touchstart', start, { passive: true });
      btn.addEventListener('touchend', stop);
      window.addEventListener('resize', function () {
        if (raf) resize();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHelixButtons);
  } else {
    initHelixButtons();
  }
})();
