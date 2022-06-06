import postApi from './api/postApi.js'
import { initPostForm, toast } from './utils'

function removeUnField(formValues) {
  const payLoad = { ...formValues }
  if (!payLoad) return

  payLoad.imageSource === 'upload'
    ? delete payLoad.imageUrl
    : delete payLoad.image

  // finally remove image source
  delete payLoad.imageSource
  if (!payLoad.id) delete payLoad.id

  console.log('payload:', payLoad)
  return payLoad
}

function jsonToFormData(jsonObject) {
  const formData = new FormData()

  for (const key in jsonObject) {
    formData.set(key, jsonObject[key])
  }

  return formData
}

async function handleSubmit(formValues) {
  try {
    const payload = removeUnField(formValues)
    const formData = jsonToFormData(payload)

    const savePost = payload.id
      ? await postApi.updateFormData(formData)
      : await postApi.addFormData(formData)

    // show success message
    toast.success('Save post successfully !')

    // go to detail post
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savePost.id}`)
    }, 1000)
  } catch (error) {
    console.log('Failed API', error)
    toast.error(`Error: ${error.message}`)
  }
}

;(async () => {
  try {
    const queryParams = new URLSearchParams(window.location.search)
    const postId = queryParams.get('id')

    let defaultPost = {
      title: '',
      author: '',
      description: '',
      imageUrl: '',
    }

    if (postId) {
      defaultPost = await postApi.getById(postId)
    }

    // query element form
    const form = document.getElementById('postForm')
    initPostForm({
      form,
      defaultPost,
      onChange: handleSubmit,
    })
  } catch (error) {
    console.log('Failed get data by id')
  }
})()
