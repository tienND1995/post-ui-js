import {
  randomNumber,
  setBackGround,
  setFieldValues,
  setTextContent,
} from './common'
import * as yup from 'yup'

const ImageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
}

function setValuesForm(form, postForm) {
  setFieldValues(form, '[name="title"]', postForm.title)
  setFieldValues(form, '[name="author"]', postForm.author)
  setFieldValues(form, '[name="description"]', postForm.description)

  setBackGround(document, '#postHeroImage', postForm.imageUrl)
  setFieldValues(form, '[name="imageUrl"]', postForm.imageUrl)
}

function getValuesForm(form) {
  const formValues = {}

  // const nameList = ['title', 'author', 'description', 'imageUrl']
  // nameList.forEach((name) => {
  //   const element = form.querySelector(`[name="${name}"]`)
  //   formValues[name] = element.value
  // })

  // const source = form.querySelector(`[name="imageSource"]:checked`)
  // formValues['imageSource'] = source.value

  // const nameImage = form.querySelector(`[name="image"]`)
  // formValues['image'] = nameImage.files[0]
  //   ? nameImage.files[0]
  //   : (formValues['image'] = '')

  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }

  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at least two words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => x.length >= 2).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please enter an image source')
      .oneOf([ImageSource.PICSUM, ImageSource.UPLOAD], 'Invalid image source'),
    imageUrl: yup.string().when('imageSource', {
      is: ImageSource.PICSUM,
      then: yup
        .string()
        .required('Please enter a background image')
        .url('Please enter an url valid'),
    }),

    image: yup.mixed().when('imageSource', {
      is: ImageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Please select an image to upload', (value) =>
          Boolean(value?.name)
        )
        .test('max-3mb', 'The image is too large (max 3md)', (file) => {
          const fileSize = file.size || 0
          const MAX_SIZE = 3 * 1024 * 1024
          return fileSize <= MAX_SIZE
        }),
    }),
  })
}

function setValuesError(parent, name, text) {
  const element = parent.querySelector(`[name="${name}"]`)
  element.setCustomValidity(text)
  setTextContent(element.parentElement, '.invalid-feedback', text)
}

async function validateFormField(form, formValues, name) {
  try {
    setValuesError(form, name, '')
    const schema = getPostSchema()
    await schema.validateAt(name, formValues)
  } catch (error) {
    setValuesError(form, name, error.message)
  }

  const field = form.querySelector(`[name="${name}"]`)
  if (!field.checkValidity()) {
    field.parentElement.classList.add('was-validated')
  }
}

async function validatePostForm(form, formValues) {
  // * my code
  // const nameList = ['title', 'author']
  // for (const name of nameList) {
  //   let error = ''
  //   const element = form.querySelector(`[name="${name}"]`)
  //   if (!element) return

  //   // get error
  //   const required = element.validity.valueMissing
  //   const atLeastTwoWords =
  //     element.value.split(' ').filter((x) => x.length >= 2).length < 2

  //   // title capitalize the first letter
  //   const capitalize = element.value
  //     .split(' ')
  //     .filter((x) => x.length >= 2)
  //     .map((x) => x[0].toUpperCase().concat(x.slice(1)))
  //     .join(' ')
  //   const elementValues = element.value
  //     .split(' ')
  //     .filter((x) => x.length >= 2)
  //     .join(' ')

  //   if (name === 'author') {
  //     if (elementValues !== capitalize)
  //       error = 'Please capitalize the first letter'
  //   }

  //   if (required) {
  //     error = `Please enter ${name} `
  //   } else {
  //     if (atLeastTwoWords) {
  //       error = `Please two least two words`
  //     }
  //   }

  //   // set error for element
  //   element.setCustomValidity(error)
  //   setTextContent(element.parentElement, '.invalid-feedback', error)

  //   // check validate form
  //   form.classList.add('was-validated')
  // }

  try {
    ;['title', 'author', 'imageUrl', 'image'].forEach((name) => {
      setValuesError(form, name, '')
    })
    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    console.log(error.name)
    console.log(error.inner)

    const errorLog = {}

    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path
        console.log('key', name)
        const errorMessage = validationError.message
        console.log('value', errorMessage)

        // ignore if field is already logged
        if (errorLog[name]) continue

        // set field error
        setValuesError(form, name, errorMessage)
        errorLog[name] = true
      }
    }
  }

  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')

  return isValid
}

function checkImageSource(form, values) {
  const setImageList = form.querySelectorAll('[data-id="imageSource"]')
  if (!setImageList) return

  setImageList.forEach((setImage) => {
    setImage.hidden = setImage.dataset.imageSource !== values
  })
}

function showImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  if (!radioList) return

  radioList.forEach((radio) => {
    radio.addEventListener('change', () => {
      checkImageSource(form, radio.value)
    })
  })
}

function randomImage(form) {
  const buttonChange = form.querySelector('#postChangeImage')
  buttonChange.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    setBackGround(document, '#postHeroImage', imageUrl)
    setFieldValues(form, '[name="imageUrl"]', imageUrl)
  })
}

function upLoadImage(form) {
  const upLoadImage = form.querySelector('#uploadImage')
  if (!upLoadImage) return

  upLoadImage.addEventListener('change', (event) => {
    if (upLoadImage.files) {
      const file = event.target.files[0]
      const imageUrl = URL.createObjectURL(file)

      setBackGround(document, '#postHeroImage', imageUrl)

      validateFormField(
        form,
        { imageSource: ImageSource.UPLOAD, image: file },
        'image'
      )
    }
  })
}

function showLoading(form) {
  const buttonSubmit = form.querySelector('[name="submit"]')
  buttonSubmit.disabled = true
  buttonSubmit.textContent = 'Saving...'
}

function hideLoading(form) {
  const buttonSubmit = form.querySelector('[name="submit"]')
  buttonSubmit.disabled = false
  buttonSubmit.textContent = 'Save'
}

function initValidationOnchange(form) {
  ['title', 'author'].forEach(name => {
    const field = form.querySelector(`[name="${name}"]`)
    if (field) {
      field.addEventListener('input', event => {
        const newValue = event.target.value
        validateFormField(form, {[name]: newValue}, name)
      })
    }
  })
}

export function initPostForm({ form, defaultPost, onChange }) {
  setValuesForm(form, defaultPost)

  // init event
  randomImage(form)
  showImageSource(form)
  upLoadImage(form)
  initValidationOnchange(form)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    showLoading(form)

    const formValues = getValuesForm(form)
    formValues.id = defaultPost.id

    console.log('form values:', formValues)

    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onChange(formValues)

    setTimeout(() => {
      hideLoading(form)
    }, 1000)
  })
}
