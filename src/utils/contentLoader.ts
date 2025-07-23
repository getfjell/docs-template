export const loadDocument = async (url: string): Promise<string> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`)
  }

  return response.text()
}

export const processContent = (content: string): string => {
  // Basic content processing - can be extended per project
  return content
}

// Content processing utilities that projects can use
export const extractSection = (content: string, sectionTitle: string): string => {
  const sections = content.split('##')
  const targetSection = sections.find(s =>
    s.trim().toLowerCase().startsWith(sectionTitle.toLowerCase())
  )

  if (targetSection) {
    return '##' + targetSection
  }

  return content
}

export const extractMultipleSections = (content: string, sectionTitles: string[]): string => {
  const sections = content.split('##')
  const matchingSections = sections.filter(s =>
    sectionTitles.some(title =>
      s.trim().toLowerCase().startsWith(title.toLowerCase())
    )
  )

  if (matchingSections.length > 0) {
    return matchingSections.map(s => '##' + s).join('\n\n')
  }

  return content
}

export const createGettingStartedContent = (content: string): string => {
  const installSection = extractSection(content, 'Installation')
  const basicSection = extractSection(content, 'Basic Usage')
  const configSection = extractSection(content, 'Configuration')

    let result = '# Getting Started\n\n'

  // Only add sections if they were actually found (not the original content)
  if (installSection !== content && installSection.trim()) result += installSection + '\n\n'
  if (basicSection !== content && basicSection.trim()) result += basicSection + '\n\n'
  if (configSection !== content && configSection.trim()) result += configSection + '\n\n'

  return result
}
