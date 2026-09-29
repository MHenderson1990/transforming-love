function BachelorApplicationForm() {
  function handleSubmit(event) {
    const photos = [...event.currentTarget.querySelectorAll('input[type="file"]')]
      .flatMap((input) => [...input.files])

    const totalBytes = photos.reduce((total, photo) => total + photo.size, 0)

    if (totalBytes >= 10 * 1024 * 1024) {
      event.preventDefault()
      alert('Your photos must be less than 10 MB combined. Please choose smaller files.')
    }
  }

  return (
    <form
      action="https://formsubmit.co/transforminglove26@gmail.com"
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <input
        type="hidden"
        name="_subject"
        value="New Transforming Love bachelor application"
      />

      <label htmlFor="name">Full name</label>
      <input id="name" name="name" type="text" required />

      <label htmlFor="age">Age</label>
      <input id="age" name="age" type="number" min="25" max="40" required />

      <label htmlFor="location">City and state</label>
      <input id="location" name="location" type="text" required />

      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="phone">Phone number</label>
      <input id="phone" name="phone" type="tel" required />

      <label htmlFor="social">Social media links</label>
      <textarea id="social" name="social" rows="3" />

      <label htmlFor="fullBodyPhoto">Full-body photo</label>
      <input id="fullBodyPhoto" name="fullBodyPhoto" type="file" accept="image/jpeg,image/png,image/webp" required />

      <label htmlFor="photo2">Second photo</label>
      <input id="photo2" name="photo2" type="file" accept="image/jpeg,image/png,image/webp" required />

      <label htmlFor="photo3">Third photo</label>
      <input id="photo3" name="photo3" type="file" accept="image/jpeg,image/png,image/webp" required />

      <label htmlFor="photo4">Fourth photo (optional)</label>
      <input id="photo4" name="photo4" type="file" accept="image/jpeg,image/png,image/webp" />

      <button type="submit">Submit application</button>
    </form>
  )
}

export default BachelorApplicationForm