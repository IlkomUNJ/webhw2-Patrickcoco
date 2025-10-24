let slides = document.querySelectorAll('.slide')
let index = 0

function showSlide(n) {
  slides.forEach((slide, i) => {
    // remove legacy and tailwind visibility classes
    slide.classList.remove('active', 'opacity-100', 'z-20')
    slide.classList.add('opacity-0', 'z-10')
  })
  // set the chosen slide visible (both legacy and tailwind classes)
  slides[n].classList.remove('opacity-0', 'z-10')
  slides[n].classList.add('active', 'opacity-100', 'z-20')
}

function nextSlide() {
  index = (index + 1) % slides.length
  showSlide(index)
}

setInterval(nextSlide, 4000) // ganti slide tiap 4 detik

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar')
  if (!navbar) return
  if (window.scrollY > 50) {
    // add Tailwind utility classes for scrolled state
    navbar.classList.add('bg-white/20', 'backdrop-blur-md', 'shadow-lg')
    navbar.classList.remove('bg-transparent')
    // keep legacy class for compatibility
    navbar.classList.add('scrolled')
  } else {
    navbar.classList.remove('bg-white/20', 'backdrop-blur-md', 'shadow-lg')
    navbar.classList.add('bg-transparent')
    navbar.classList.remove('scrolled')
  }
})

// Animasi scroll (reveal)
const reveals = document.querySelectorAll('.reveal')

function revealOnScroll() {
  reveals.forEach((el) => {
    const windowHeight = window.innerHeight
    const elementTop = el.getBoundingClientRect().top
    const revealPoint = 100 // jarak sebelum muncul

    if (elementTop < windowHeight - revealPoint) {
      // add Tailwind utility classes for reveal
      el.classList.add('active', 'opacity-100', 'translate-y-0')
      el.classList.remove('opacity-0', 'translate-y-10')
    } else {
      el.classList.remove('active', 'opacity-100', 'translate-y-0')
      el.classList.add('opacity-0', 'translate-y-10')
    }
  })
}

// initialise reveal elements to hidden using Tailwind classes if not present
revealOnScroll()
window.addEventListener('scroll', revealOnScroll)
