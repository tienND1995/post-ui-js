function showModal() {
  const modal = new bootstrap.Modal(document.querySelector('[data-id="modal"]'))
  return modal.show()
}

export function handleLightBox() {
  const imageList = document.querySelectorAll('[data-album="easy frontend"]')
  const modalImage = document.querySelector('[data-id="image"]')
  const modalPrev = document.querySelector('[data-id="prev"]')
  const modalNext = document.querySelector('[data-id="next"]')

  if (!modalImage || !modalPrev || !modalNext || !imageList) return

  const imageArray = Array.from(imageList)
  let currentIndex = ''

  document.addEventListener('click', (event) => {
    if (event.target.tagName !== 'IMG' || event.target.dataset.album !== 'easy frontend') return // get src for image modal
    imageArray.forEach((element, index) => {
      if (element === event.target) {
        modalImage.src = element.src
        currentIndex = index
      }
    })

    showModal()
  })

  modalPrev.addEventListener('click', () => {
    currentIndex = (currentIndex + imageArray.length - 1) % imageArray.length

    modalImage.src = imageArray[currentIndex].src
    console.log('prev', currentIndex)
  })

  modalNext.addEventListener('click', () => {
    currentIndex = (currentIndex + imageArray.length + 1) % imageArray.length

    modalImage.src = imageArray[currentIndex].src
    console.log('next', currentIndex)
  })
}
