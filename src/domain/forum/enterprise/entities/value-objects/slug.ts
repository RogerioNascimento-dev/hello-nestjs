export class Slug {
  public value: string

  constructor(value: string) {
    this.value = value
  }

  static create(value: string): Slug {
    return new Slug(value)
  }

  /**
   * Recives a string and normalize it as a slug
   *
   * Example: "an example title" -> "an-example-title"
   * @param text {string}
   */
  static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
