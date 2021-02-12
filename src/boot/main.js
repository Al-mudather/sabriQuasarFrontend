// colaps
var cardHeader = document.querySelectorAll('.dowUp a')
var num = cardHeader.length

for (var i = 0; i < num; i++) {
  cardHeader[i].addEventListener('click', function () {
    var
      typeimg = this.parentNode.children[0].children[0].children[0].alt,
      imgEl = this.parentNode.children[0].children[0].children[0]
    if (typeimg === 'mins') {
      imgEl.alt = 'plus'
      imgEl.src = '~assets/img/pluus.png'
    } if (typeimg === 'plus') {
      imgEl.alt = 'mins'
      imgEl.src = '~assets/img/mins.png'
    }
  })
}
