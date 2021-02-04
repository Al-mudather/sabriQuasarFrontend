// Drowp Down js
var
  butFilter = document.querySelector('.dropdow .open'),
  butClose = document.querySelector('.dropdow .end'),
  control = document.querySelector('.listt')
butFilter.addEventListener('click', function () {
  butFilter.style.opacity = '0'
  setTimeout(function () {
    butFilter.style.display = 'none'
    butClose.style.display = 'block'
    setTimeout(function () {
      butClose.style.opacity = '1'
    }, 50)
  }, 50)
  control.style.display = 'block'
  setTimeout(function () {
    control.style.opacity = '1'
    control.style.transform = 'translateY(0)'
    control.style.transition = 'all 0.2s ease-in-out'
  }, 50)
})

// close
butClose.addEventListener('click', function () {
  control.style.opacity = '0'
  control.style.transform = 'translateY(45px)'
  control.style.transition = 'all 0.3s ease-in-out'
  setTimeout(function () {
    control.style.display = 'none'
  }, 100)
  setTimeout(function () {
    butClose.style.display = 'none'
    butFilter.style.display = 'block'
    setTimeout(function () {
      butFilter.style.opacity = '1'
    }, 50)
  }, 50)
})
