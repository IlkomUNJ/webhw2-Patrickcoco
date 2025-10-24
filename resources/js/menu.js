document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.cat-btn')
  const categories = document.querySelectorAll('.menu-category')

  // initialize categories: hide all except the first active or the one with .active btn
  const activeBtn = Array.from(buttons).find((b) => b.classList.contains('active')) || buttons[0]
  const activeCatId = activeBtn ? activeBtn.dataset.cat : null

  categories.forEach((c) => {
    if (activeCatId && c.id !== activeCatId) {
      c.classList.add('hidden')
    } else {
      c.classList.remove('hidden')
    }
  })

  // helper to mark button active using Tailwind classes (keeps legacy .active)
  function markButtonActive(btn) {
    buttons.forEach((b) => {
      b.classList.remove('active', 'bg-richgold', 'text-black', 'scale-105')
      // ensure default styling for inactive
      b.classList.add('bg-[#1a0000]', 'text-white')
    })
    btn.classList.add('active', 'bg-richgold', 'text-black', 'scale-105')
    btn.classList.remove('bg-[#1a0000]')
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat
      markButtonActive(btn)

      // tampilkan kategori sesuai tombol menggunakan Tailwind 'hidden'
      categories.forEach((c) => {
        if (c.id === cat) {
          c.classList.remove('hidden')
        } else {
          c.classList.add('hidden')
        }
      })
    })
  })
})
// Navbar Scroll Effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar')
  if (!navbar) return
  if (window.scrollY > 50) {
    navbar.classList.add('bg-white/20', 'backdrop-blur-md', 'shadow-lg')
    navbar.classList.remove('bg-transparent')
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
      el.classList.add('active', 'opacity-100', 'translate-y-0')
      el.classList.remove('opacity-0', 'translate-y-10')
    } else {
      el.classList.remove('active', 'opacity-100', 'translate-y-0')
      el.classList.add('opacity-0', 'translate-y-10')
    }
  })
}

// initialise reveal elements
revealOnScroll()
window.addEventListener('scroll', revealOnScroll)
