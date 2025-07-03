fetch('navHome.html')
  .then(res => res.text())
  .then(html => {
    const navContainer = document.createElement('div');
    navContainer.innerHTML = html;
    document.body.insertBefore(navContainer, document.body.firstChild);

    // Re-attach menu behavior after injection
    const toggleButton = navContainer.querySelector('.hamburger');
    toggleButton.addEventListener('click', () => toggleMenu(toggleButton));

    // Re-bind CTA buttons
    const ctaButtons = navContainer.querySelectorAll('.cta');
    ctaButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const menu = document.getElementById("navLinks");
        const href = btn.dataset.target;
        if (menu) menu.classList.remove("show");
        toggleButton.classList.remove("active");
        window.location.href = href;
      });
    });
  });

function toggleMenu(el) {
  const menu = document.getElementById("navLinks");
  menu.classList.toggle("show");
  el.classList.toggle("active");

  const closeOnClick = menu.querySelectorAll("a");
  closeOnClick.forEach(item =>
    item.onclick = () => {
      menu.classList.remove("show");
      el.classList.remove("active");
    }
  );
}
