// 간단한 해시 라우터
function showViewByHash() {
  // #healing -> "healing", 없으면 "home"
  const name = (location.hash || '#home').replace('#', '');
//   replace로 #제거하고  해시의  이름만 얻으려는거임

  // 모든 뷰 숨기기
  document.querySelectorAll('.view').forEach(v => v.hidden = true);

  // 해당 뷰 보이기
  const target = document.getElementById('view-' + name);
  if (target) {
    target.hidden = false;
    // 스크롤 맨 위로
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// 해시 바뀔 때마다 실행
window.addEventListener('hashchange', showViewByHash);

// 처음 로딩될 때 실행
window.addEventListener('DOMContentLoaded', showViewByHash);


// === 인기 여행지 캐러셀 & 하트 ===
window.addEventListener('DOMContentLoaded', () => {
  const strip = document.querySelector('.pop-strip');
  if (!strip) return;

  const cards = [...strip.querySelectorAll('.pop-card')];

  // ----- 점 인디케이터 생성 -----
  const dotsWrap = document.querySelector('.pop-dots');
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.className = 'dot';
    b.type = 'button';
    b.setAttribute('aria-label', `${i + 1}번째 카드`);
    b.dataset.index = i;
    dotsWrap.appendChild(b);
    return b;
  });

  // ----- 가운데 카드 활성화 -----
  const setActive = () => {
    const center = strip.scrollLeft + strip.clientWidth / 2;
    let closest = null, min = Infinity, activeIndex = 0;

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(center - cardCenter);
      if (dist < min) { min = dist; closest = card; activeIndex = i; }
    });

    cards.forEach(c => c.classList.remove('active'));
    if (closest) closest.classList.add('active');

    dots.forEach((d, i) => d.classList.toggle('on', i === activeIndex));
  };

  // 스크롤 성능 최적화
  let ticking = false;
  strip.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setActive();
        ticking = false;
      });
      ticking = true;
    }
  });

  // 점 클릭 시 해당 카드로 스크롤
  dotsWrap.addEventListener('click', e => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    const i = Number(dot.dataset.index);
    const card = cards[i];
    const targetLeft = card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2;
    strip.scrollTo({ left: targetLeft, behavior: 'smooth' });
  });

  // 초기 상태 설정
  setActive();

  // ----- 하트 토글 & 카운트 -----
  strip.addEventListener('click', e => {
    const btn = e.target.closest('.heart-btn');
    if (!btn) return;

    e.preventDefault();

    const countSpan = btn.querySelector('.count');
    let n = parseInt(countSpan.textContent, 10) || 0;

    const isOn = btn.classList.toggle('on');
    btn.setAttribute('aria-pressed', isOn);

    n = isOn ? n + 1 : Math.max(0, n - 1);
    countSpan.textContent = n;
  });
});
