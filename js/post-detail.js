import postApi from './api/postApi.js'
import {
  handleLightBox,
  setBackGround,
  setTextCapitalize,
  setTextContent,
} from './utils'

function renderDetailPost(post) {
  if (!post) return

  setTextContent(document, '#postDetailTitle', post.title)
  setTextContent(document, '#postDetailAuthor', post.author)
  setTextContent(
    document,
    '#postDetailDescription',
    setTextCapitalize(post.description)
  )

  const editPageLink = document.getElementById('goToEditPageLink')
  editPageLink.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit a post`
  editPageLink.href = `/add-edit-post.html?id=${post.id}`

  setBackGround(document, '#postHeroImage', post.imageUrl)
}

;(async () => {
  try {
    const url = new URL(window.location)
    const postId = url.searchParams.get('id')

    const post = await postApi.getById(postId)

    renderDetailPost(post)
    handleLightBox()
  } catch (error) {
    console.log('Failed get data by id', error)
  }
})()
