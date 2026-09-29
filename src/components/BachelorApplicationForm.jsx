function BachelorApplicationForm() {
  return (
    <form>
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
      <input
        id="fullBodyPhoto"
        name="fullBodyPhoto"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
      />

      <label htmlFor="photo2">Second photo</label>
      <input
        id="photo2"
        name="photo2"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
      />

      <label htmlFor="photo3">Third photo</label>
      <input
        id="photo3"
        name="photo3"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        required
      />

      <label htmlFor="photo4">Fourth photo (optional)</label>
      <input
        id="photo4"
        name="photo4"
        type="file"
        accept="image/jpeg,image/png,image/webp"
      />

      <button type="button" disabled>
        Submit application
      </button>
    </form>
  )
}

export default BachelorApplicationForm