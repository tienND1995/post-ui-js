import postApi from './api/postApi.js'
import {
  renderPostList,
  renderPagination,
  initSearch,
  initPagination,
  toast,
} from './utils'



export async function handleFilterChange(filterName, filterValue) {
  const url = new URL(window.location)
  if (filterName) url.searchParams.set(filterName, filterValue)

  if (!url.search) {
    url.searchParams.set('_page', 1)
    url.searchParams.set('_limit', 12)
  }

  if (url.searchParams.get('title_like')) {
    url.searchParams.set('_page', 1)
  }

  history.pushState({}, '', url)

  // update data from API
  const { data, pagination } = await postApi.getAll(url.searchParams)

  renderPostList('postList', data)
  renderPagination('pagination', pagination)
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail
      const message = `Are you sure to remove post "${post.title}"`
      if (window.confirm(message)) {
        await postApi.remove(post.id)
        await handleFilterChange()

        toast.success('Remomve post sucessfully')
      }
    } catch (error) {
      console.log('Failed to remove post', error)
      toast.error(error.message)
    }
  })
}

;(async () => {
  try {
    handleFilterChange()
    const queryParams = new URLSearchParams(window.location.search)

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    })

    initPagination({
      elementId: 'pagination',
      onChange: (page) => handleFilterChange('_page', page),
    })
    registerPostDeleteEvent()
  } catch (error) {
    console.log('Failed get all API', error)
  }
})()
