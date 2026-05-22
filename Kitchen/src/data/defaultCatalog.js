import { defaultCategories, defaultSite } from '../../server/seed-data.js'

function buildFallbackCatalog() {
  const categories = defaultCategories.map((c) => ({
    id: c.slug,
    title: c.title,
    desc: c.desc,
    image: c.image_path,
    anchor: c.anchor,
    icon: c.icon,
  }))

  const menuItems = defaultCategories.map((c) => ({
    id: c.anchor,
    label: c.title,
    icon: c.icon,
  }))

  const recommendationData = {}
  for (const c of defaultCategories) {
    recommendationData[c.slug] = {
      id: c.anchor,
      title: c.section_title,
      bg: c.section_bg,
      items: c.items.map((item) => ({
        name: item.name,
        tagline: item.tagline,
        img: item.image_path,
        spec: item.spec,
        features: item.features,
      })),
    }
  }

  return {
    site: { ...defaultSite },
    categories,
    menuItems,
    recommendationData,
  }
}

export const defaultCatalog = buildFallbackCatalog()
