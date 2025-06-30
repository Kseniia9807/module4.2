document.addEventListener('DOMContentLoaded', () => {
  const sliderInner = document.querySelector('.innerslide');
  const slides = document.querySelectorAll('.slides');
  const toggleBtn = document.getElementById('next');
  const container = document.querySelector('.second');
  const arrow = document.querySelector('.nb');

  let currentIndex = 0;
  const slideVW = 93;

  sliderInner.style.width = `${slides.length * slideVW}vw`;

  function goToSlide(index) {
    currentIndex = index;
    const offsetVW = -currentIndex * slideVW;
    sliderInner.style.transform = `translateX(${offsetVW}vw)`;
  }

 
  const urlParams = new URLSearchParams(window.location.search);
  const slideParam = urlParams.get('slide');

  if (slideParam === '1') {
    goToSlide(1);
    // update toggle button and UI
    toggleBtn.textContent = "merch";
    toggleBtn.style.textDecoration = "underline";
    container.style.marginLeft = '85vw';
    arrow.style.display = "none";
  } else {
    goToSlide(0);
  }


  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (currentIndex === 0) {
        goToSlide(1);
        toggleBtn.textContent = "merch";
        toggleBtn.style.textDecoration = "underline";
        container.style.marginLeft = '85vw';
        arrow.style.display = "none";
      } else {
        goToSlide(0);
        toggleBtn.textContent = "track releases";
        toggleBtn.style.textDecoration = "underline";
        container.style.marginLeft = '82.5vw';
        arrow.style.display = 'block';
      }
    });
  }
});







