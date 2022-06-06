export function renderPagination(elementId, pagination ) {
  if (!pagination) return
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  const { _page, _limit, _totalRows } = pagination
  const sumPage = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.total = sumPage

  // set condition for prev/next link

  _page <= 1
    ? ulPagination.firstElementChild.classList.add('disabled')
    : ulPagination.firstElementChild.classList.remove('disabled')

  _page >= sumPage
    ? ulPagination.lastElementChild.classList.add('disabled')
    : ulPagination.lastElementChild.classList.remove('disabled')
}

export function initPagination({ elementId, onChange }) {
  const ulPagination = document.getElementById(elementId)
  if (!ulPagination) return

  // add event click for prev link
  ulPagination.firstElementChild.addEventListener('click', (event) => {
    event.preventDefault()
    const page = Number(ulPagination.dataset.page)
    if (page > 1) onChange(page - 1)
  })

  // add event click for next link
  ulPagination.lastElementChild.addEventListener('click', (event) => {
    event.preventDefault()

    const page = Number(ulPagination.dataset.page) || 1
    const total = Number(ulPagination.dataset.total)
    if (page < total) onChange(page + 1)
  })
}
