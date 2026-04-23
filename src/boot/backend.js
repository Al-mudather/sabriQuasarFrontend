// Legacy DOM wiring for the "card" collapse toggle and a dropdown menu.
//
// The original file ran this code at module load, which in practice threw
// because the DOM elements don't exist yet at boot time. We wrap the logic
// in a DOMContentLoaded listener and early-bail when the expected nodes are
// missing, so the boot file no longer crashes the app start.

import { boot } from 'quasar/wrappers'

function wireCardCollapse () {
  const cardHeader = document.querySelectorAll('.card .card-header .dowUp a')
  for (let i = 0; i < cardHeader.length; i++) {
    cardHeader[i].addEventListener('click', function () {
      const first = this.parentNode.children[0].children[0].children[0]
      if (!first) return
      const typeimg = first.alt
      if (typeimg === 'mins') {
        first.alt = 'plus'
        first.src = 'assets/img/pluus.png'
      } else if (typeimg === 'plus') {
        first.alt = 'mins'
        first.src = 'assets/img/mins.png'
      }
    })
  }
}

function wireDropdown () {
  const butFilter = document.querySelector('.dropdow .open')
  const butClose = document.querySelector('.dropdow .end')
  const control = document.querySelector('.listt')
  if (!butFilter || !butClose || !control) return

  butFilter.addEventListener('click', function () {
    butFilter.style.opacity = '0'
    setTimeout(() => {
      butFilter.style.display = 'none'
      butClose.style.display = 'block'
      setTimeout(() => { butClose.style.opacity = '1' }, 50)
    }, 50)
    control.style.display = 'block'
    setTimeout(() => {
      control.style.opacity = '1'
      control.style.transform = 'translateY(0)'
      control.style.transition = 'all 0.2s ease-in-out'
    }, 50)
  })

  butClose.addEventListener('click', function () {
    control.style.opacity = '0'
    control.style.transform = 'translateY(45px)'
    control.style.transition = 'all 0.3s ease-in-out'
    setTimeout(() => { control.style.display = 'none' }, 100)
    setTimeout(() => {
      butClose.style.display = 'none'
      butFilter.style.display = 'block'
      setTimeout(() => { butFilter.style.opacity = '1' }, 50)
    }, 50)
  })
}

export default boot(() => {
  if (typeof window === 'undefined') return
  const run = () => { try { wireCardCollapse(); wireDropdown() } catch (_) {} }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    run()
  }
})
