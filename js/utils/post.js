import { setTextCapitalize, setTextContent } from './common.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function createLiElement(post) {
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)

  // update content li element then appendChild for ul element
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="author"]', post.author)
  setTextContent(liElement, '[data-id="description"]', setTextCapitalize(post.description))

  setTextContent(
    liElement,
    '[data-id="timeSpan"]',
    `- ${dayjs(post.updatedAt).fromNow()}`
  )

  // set background for element img
  const thumbnail = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnail) {
    thumbnail.src = post.imageUrl
    thumbnail.addEventListener('error', () => {
      thumbnail.src = 'https://via.placeholder.com/1368x400'
    })
  }

  return liElement
}

export function renderPostList(elementId, postList) {
  if (!postList) return

  const ulElement = document.getElementById(elementId)
  if (!ulElement) return

  // clear content ul element
  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createLiElement(post)

    // go to edit/detail post page
    liElement.addEventListener('click', (event) => {
      const editPost = liElement.querySelector('[data-id="edit"]')
      const removePost = liElement.querySelector('[data-id="remove"]')
      if (editPost.contains(event.target)) {
        window.location.assign(`/add-edit-post.html?id=${post.id}`)
      } else {
        if (removePost.contains(event.target)) {
          const customEvent = new CustomEvent('post-delete', {
            bubbles: true,
            detail: post,
          })

          removePost.dispatchEvent(customEvent)
        } else window.location.assign(`/post-detail.html?id=${post.id}`)
      }
    })

    ulElement.appendChild(liElement)
  })

  return ulElement
}
