fetch('nav.html')
  .then(res => res.text())
  .then(html => {
    const navContainer = document.createElement('div');
    navContainer.innerHTML = html;
    document.body.insertBefore(navContainer, document.body.firstChild);
  });

function toggleMenu(el) {
  const menu = document.getElementById("navLinks");
  menu.classList.toggle("show");
  el.classList.toggle("active");

  // Close menu when link is clicked
  const closeOnClick = menu.querySelectorAll("a, button");
  closeOnClick.forEach(item =>
    item.onclick = () => {
      menu.classList.remove("show");
      el.classList.remove("active");
    }
  );
}

