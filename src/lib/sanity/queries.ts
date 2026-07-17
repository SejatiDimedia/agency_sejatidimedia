export const homePageQuery = `*[_type == "page" && slug.current == "home"][0]{
  title,
  heroTitle,
  heroSubtitle,
  contactTagline,
  processesTitle,
  sections[]{
    _key,
    _type,
    title,
    heading,
    body
  }
}`;
