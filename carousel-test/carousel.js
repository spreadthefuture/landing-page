// Cover carousel test. One float, `pos`, is the carousel's whole state: the
// cover nearest to it is centred. Every cover is drawn from its signed
// distance `d` to `pos`, so dragging, gliding and snapping are all just `pos`
// changing. It loops: distances wrap, so the last cover sits beside the first.
//
// Motion is a damped spring rather than a timed curve. A spring starts from
// whatever speed the covers already have, so a flick hands its momentum
// straight to the glide and an interrupted glide never jerks; and, slightly
// under-damped, it passes the cover by a hair and settles back onto it.
(() => {
  const root = document.querySelector('.carousel');
  const stage = root.querySelector('.carousel-stage');
  const slides = [...stage.children];
  const captionBox = root.querySelector('.carousel-captions');
  const n = slides.length;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Caption per slide, moved out of the slide into the shared block.
  const captions = slides.map((slide) => {
    const c = slide.querySelector('.caption');
    captionBox.appendChild(c);
    return c;
  });

  // Shape of the fan. A cover shrinks by SCALE per step away from the centre,
  // and its centre sits at S * REACH * (1 - EASE^a), so outer covers tuck behind
  // the inner ones and only a sliver of each shows, as in the reference.
  const SCALE = 0.8, REACH = 2.4, EASE = 0.8, FADE_FROM = 3.6, FADE_TO = 5;

  // HOLD: how long a cover rests, once settled, before autoplay moves on.
  const HOLD = 3000;

  // Springs. OMEGA sets the speed (higher is quicker); DAMPING below 1 lets the
  // covers overshoot, measured from rest: 0.863 passes the cover by 0.4% of a
  // step, 0.81 by 1.2%. Autoplay is the slower, calmer of the two; a gesture
  // answers the hand more briskly and lands with a touch more give.
  const SPRING_AUTO = { omega: 7.5, damping: 0.863 };
  const SPRING_HAND = { omega: 10, damping: 0.81 };
  // A slow gesture settles with no bounce at all: the same speed, critically
  // damped. Only a fast one (past FAST, below) earns SPRING_HAND's 1.2%.
  const SPRING_SOFT = { omega: 10, damping: 1 };
  // While a trackpad swipe is under way the covers follow it continuously on
  // a stiff spring that only smooths the events, never steering to a cover.
  const SPRING_FOLLOW = { omega: 30, damping: 1, follow: true };

  // A gesture can travel as many covers as it likes, but always lands on one.
  // Leaving the cover you are on is easy: STEP (a fraction of a cover) or a
  // quick flick is enough, and short of that the covers spring back. Every
  // cover after that has to be earned: the gesture must pass the halfway
  // point to it, so a swipe meant for one cover does not slip into a second.
  // THROW is how far a release's speed carries, in seconds of that speed.
  // Going past more than one cover takes speed: below FAST (covers per
  // second) a release does not throw and a trackpad swipe moves one cover at
  // most, however long its inertia runs. A slow drag still lands wherever the
  // hand took it.
  const STEP = 0.15, FLICK = 0.6, THROW = 0.1, FAST = 3;

  // Whole covers travelled for a gesture that has gone `i` covers (signed).
  const stepsFor = (i) => {
    const a = Math.abs(i);
    return a < STEP ? 0 : Math.sign(i) * Math.max(1, Math.round(a));
  };

  let S = stage.clientHeight;
  let pos = 0, vel = 0, target = 0, spring = null, running = false;
  let active = -1, timer = 0, dragging = false;

  // Entrance. Until the carousel is a quarter in view every cover waits,
  // stacked and invisible behind the centre one. Then they fan out to their
  // places, the centre first and each step outward INTRO_STAGGER behind, on a
  // long ease-out; the caption follows as they land. Gestures and autoplay
  // wait for the fan to open (`ready`).
  const INTRO_DUR = 1100, INTRO_STAGGER = 60, INTRO_FADE = 500, CAPTION_AT = 550;
  let introT0 = -1, introOn = !reduce, ready = false, captionsOn = false;
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  const mod = (v) => ((v % n) + n) % n;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const dist = (i) => mod(i - pos + n / 2) - n / 2; // signed, -n/2 .. n/2

  function draw() {
    const now = performance.now();
    slides.forEach((slide, i) => {
      const d = dist(i);
      const a = Math.abs(d);
      let x = Math.sign(d) * S * REACH * (1 - Math.pow(EASE, a));
      let op = 1 - clamp((a - FADE_FROM) / (FADE_TO - FADE_FROM), 0, 1);
      let y = 0;
      if (introOn) {
        // Before the entrance starts introT0 is -1 and everything sits at 0.
        const t = introT0 < 0 ? 0 : now - introT0 - Math.round(a) * INTRO_STAGGER;
        const p = easeOutQuint(clamp(t / INTRO_DUR, 0, 1));
        x *= p;
        y = (1 - p) * 6; // the site's 0.375rem drift
        op *= easeInOut(clamp(t / INTRO_FADE, 0, 1));
      }
      slide.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${Math.pow(SCALE, a).toFixed(4)})`;
      slide.style.opacity = op.toFixed(3);
      slide.style.zIndex = String(1000 - Math.round(a * 20));
      slide.style.visibility = op === 0 ? 'hidden' : 'visible';
    });
    // The caption follows where the covers are going, not where they are, so
    // it changes the moment a glide starts and the overshoot cannot flick it.
    setCaption(mod(Math.round(spring ? target : pos)));
  }

  function setCaption(i) {
    if (!captionsOn || i === active) return;
    active = i;
    captions.forEach((c, j) => c.classList.toggle('is-active', j === active));
    slides.forEach((sl, j) => sl.classList.toggle('is-active', j === active));
  }

  function introFrame() {
    draw();
    const total = INTRO_DUR + Math.ceil(FADE_TO) * INTRO_STAGGER;
    if (performance.now() - introT0 < total) { requestAnimationFrame(introFrame); return; }
    introOn = false; ready = true;
    draw();
    schedule();
  }

  function start() {
    if (introT0 >= 0) return;
    introT0 = performance.now();
    if (reduce) {
      // Under reduced motion the fan is simply there, faded in.
      root.style.opacity = '';
      root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-in-out' });
      ready = captionsOn = true;
      draw();
      return;
    }
    requestAnimationFrame(introFrame);
    setTimeout(() => { captionsOn = true; draw(); }, CAPTION_AT);
  }

  // One frame loop, stepping the spring in small fixed slices so it behaves
  // the same at 60Hz and 120Hz and survives a dropped frame.
  let last = 0;
  function frame(now) {
    if (!spring) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000 || 1 / 60);
    last = now;
    const { omega, damping } = spring;
    const h = 1 / 480;
    for (let t = 0; t < dt; t += h) {
      const acc = -omega * omega * (pos - target) - 2 * damping * omega * vel;
      vel += acc * h;
      pos += vel * h;
    }
    // Settled once within a fraction of a pixel and all but still, so the
    // 3s hold starts when the eye sees the cover stop, not after the tail.
    if (Math.abs(pos - target) < 0.001 && Math.abs(vel) < 0.01) {
      pos = target; vel = 0; spring = null;
      draw();
      running = false;
      schedule();
      return;
    }
    draw();
    requestAnimationFrame(frame);
  }

  function go(to, preset = SPRING_HAND, v = vel, instant = false) {
    clearTimeout(timer);
    if (reduce) { jump(to, instant); return; }
    target = to;
    vel = clamp(v, -6, 6);
    // A critically damped spring can still pass its target if it starts
    // towards it with more speed than omega times the distance left; cap it
    // so "no bounce" holds for every release. Speed away from the target is
    // kept: the covers ease to a halt and come back, without a jolt.
    if (preset.damping >= 1 && !preset.follow && Math.sign(vel) === Math.sign(to - pos)) {
      const cap = preset.omega * Math.abs(to - pos) * 0.9;
      vel = clamp(vel, -cap, cap);
    }
    spring = preset;
    draw();
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }

  // Reduced motion: no sliding. The covers and caption dip out, the carousel
  // jumps, and they come back up: a crossfade, run with the Web Animations API
  // because the site's global reduced-motion rule cuts CSS transitions. Only
  // whole covers: the lean of a short swipe is skipped. Presses that land
  // mid-fade just move the destination.
  let fading = null;
  function jump(to, instant) {
    if (to !== Math.round(to)) return;
    target = to;
    if (fading) return;
    if (instant || mod(to) === mod(Math.round(pos))) { pos = to; vel = 0; draw(); return; }
    const els = [stage, captionBox];
    fading = els.map((el) => el.animate([{ opacity: 1 }, { opacity: 0 }],
      { duration: 180, easing: 'ease-in', fill: 'forwards' }));
    fading[0].finished.then(() => {
      pos = target; vel = 0;
      draw();
      els.forEach((el, k) => {
        fading[k].cancel();
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out' });
      });
      fading = null;
    });
  }

  // End of a gesture: spring to cover `to`, carrying speed `v`. The spring is
  // softened to match that speed, so the handover neither brakes nor kicks:
  // the covers coast on into the cover and settle, with no stop and restart.
  function land(to, preset, v, instant = false) {
    const d = Math.abs(to - pos);
    const omega = d > 0.01 && Math.sign(v) === Math.sign(to - pos)
      ? clamp(2 * preset.damping * Math.abs(v) / d, 6, preset.omega) : preset.omega;
    go(to, { ...preset, omega }, v, instant);
  }

  // Stop the spring where it is, for the hand to take over.
  function hold() { spring = null; vel = 0; clearTimeout(timer); }

  // Autoplay: rest, then move one cover. Paused under the pointer, during a
  // drag and while the tab is hidden; never runs under reduced motion.
  function schedule() {
    clearTimeout(timer);
    if (reduce || !ready || dragging || spring || document.hidden) return;
    timer = setTimeout(() => go(Math.round(pos) + 1, SPRING_AUTO, 0), HOLD);
  }

  // Drag: the covers track the pointer one to one (the centre cover moves
  // under the finger), as far as it goes. On release the pointer's speed is
  // projected a short way ahead and the covers spring to the cover that
  // lands on, carrying that speed.
  let startX = 0, startPos = 0, lastX = 0, lastT = 0, dragVel = 0, moved = 0;
  const pxPerCover = () => S * REACH * (1 - EASE);

  stage.addEventListener('pointerdown', (e) => {
    if (!ready || (e.pointerType === 'mouse' && e.button !== 0)) return;
    hold();
    // Press: the fan gives slightly under the hand (CSS, .is-pressed).
    if (!reduce) stage.classList.add('is-pressed');
    dragging = true; moved = 0; dragVel = 0;
    startX = lastX = e.clientX; startPos = pos; lastT = performance.now();
    stage.classList.add('is-dragging');
  });
  stage.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    // Capture only once it is a drag: a captured pointer's click lands on the
    // stage, not on the cover's link, and a plain click must reach the link.
    if (moved > 5 && !stage.hasPointerCapture(e.pointerId)) stage.setPointerCapture(e.pointerId);
    pos = startPos - dx / pxPerCover();
    const dt = Math.max(1, now - lastT);
    dragVel = 0.75 * dragVel + 0.25 * (-(e.clientX - lastX) / pxPerCover() / dt * 1000); // covers per second
    lastX = e.clientX; lastT = now;
    draw();
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('is-dragging', 'is-pressed');
    // A pointer that stopped before letting go has no speed left to hand on.
    if (performance.now() - lastT > 80) dragVel = 0;
    const base = Math.round(startPos);
    const thrown = Math.abs(dragVel) > FAST ? clamp(dragVel, -6, 6) * THROW : 0;
    let steps = stepsFor(pos + thrown - base);
    if (!steps && Math.abs(dragVel) > FLICK) steps = Math.sign(dragVel);
    const to = base + steps;
    // Speed pointing away from the cover chosen (a flick back) is dropped, so
    // the covers never lurch the wrong way first.
    land(to, Math.abs(dragVel) > FAST ? SPRING_HAND : SPRING_SOFT,
      Math.sign(dragVel) === Math.sign(to - pos) ? dragVel : 0, true);
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  // A click on the centre cover follows its link to the episode page. A click
  // on a side cover brings it to the centre instead, and a drag never clicks.
  stage.addEventListener('click', (e) => {
    const li = e.target.closest('.slide');
    if (!li) return;
    if (!ready || moved > 5) { e.preventDefault(); return; }
    const d = dist(slides.indexOf(li));
    if (Math.abs(d) > 0.5) { e.preventDefault(); go(Math.round(pos + d), SPRING_AUTO); }
  });

  // Trackpad swipes. While the swipe runs, the covers follow it smoothly and
  // freely, through as many covers as it carries, never steering to one on
  // the way (steering to each cover in turn made a long swipe brake at every
  // cover and set off again). The landing is chosen once: when a fast swipe's
  // inertia has died down, or when a slow one ends. The covers then spring to
  // that cover with the speed they already have, and the rest of the inertia
  // is ignored. Short of STEP they spring back. Below FAST a swipe moves one
  // cover at most.
  let wheelIdle = 0, wheelActive = false, wheelBase = 0, wheelAcc = 0;
  let wheelT = 0, wheelSpeed = 0, wheelFast = false, wheelDone = false;
  const LAND = 1.5; // covers per second: a fast swipe lands once it slows to this
  function wheelLand(dir) {
    wheelDone = true;
    let steps = stepsFor(wheelAcc + (wheelFast ? dir * wheelSpeed * THROW : 0));
    if (!wheelFast) steps = clamp(steps, -1, 1);
    const to = wheelBase + steps;
    land(to, wheelFast ? SPRING_HAND : SPRING_SOFT, vel);
  }
  stage.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (!ready) return;
    clearTimeout(wheelIdle);
    wheelIdle = setTimeout(() => {
      wheelActive = false;
      if (!wheelDone) wheelLand(0);
    }, 160);
    const now = performance.now();
    const delta = e.deltaX / (S * 1.5);
    const fresh = !wheelActive;
    if (fresh) { wheelT = now - 16; wheelSpeed = 0; }
    // Smoothed speed, so a single large event does not count as fast.
    wheelSpeed = 0.7 * wheelSpeed + 0.3 * Math.abs(delta) / Math.max(8, now - wheelT) * 1000;
    wheelT = now;
    // A new swipe: a first event, or fingers speeding up again after landing.
    if (fresh || (wheelDone && wheelSpeed > FAST)) {
      wheelActive = true; wheelDone = false; wheelAcc = 0;
      wheelFast = wheelSpeed > FAST;
      wheelBase = Math.round(spring ? target : pos);
      clearTimeout(timer);
    }
    if (wheelDone) return; // the tail of inertia after landing
    if (wheelSpeed > FAST) wheelFast = true;
    wheelAcc += delta;
    // A slow swipe's surplus is not banked, so turning back answers at once.
    if (!wheelFast) wheelAcc = clamp(wheelAcc, -1.4, 1.4);
    if (wheelFast && wheelSpeed < LAND) { wheelLand(Math.sign(delta)); return; }
    go(wheelBase + wheelAcc, SPRING_FOLLOW);
  }, { passive: false });

  root.addEventListener('keydown', (e) => {
    if (!ready) return;
    const from = Math.round(spring || fading ? target : pos);
    if (e.key === 'ArrowRight') { e.preventDefault(); go(from + 1, SPRING_SOFT); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(from - 1, SPRING_SOFT); }
    // Enter on the carousel itself opens the centre cover's episode.
    if (e.key === 'Enter' && e.target === root) location.href = slides[mod(from)].querySelector('a').href;
  });

  document.addEventListener('visibilitychange', schedule);
  addEventListener('resize', () => { S = stage.clientHeight; draw(); });
  stage.addEventListener('dragstart', (e) => e.preventDefault());

  draw();
  if (reduce) root.style.opacity = '0';
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { io.disconnect(); start(); }
    }, { threshold: 0.25 });
    io.observe(root);
  } else {
    start();
  }
})();
