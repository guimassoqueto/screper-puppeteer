import UserAgent from 'user-agents'

// Upgrade-Insecure-Requests
function upgradeInsecureRequests (): string {
  return '1'
}

// Accept
function accept (): string {
  const mediaTypes = [
    'application/json',
    'application/xml',
    'text/plain',
    'image/jpeg',
    'image/png',
    'audio/mpeg',
    'video/mp4',
    'application/pdf',
    'application/octet-stream',
    'text/css',
    'application/javascript'
  ]

  const data = new Set<string>()
  data.add('text/html')

  for (let i = 0; i <= 5; i++) {
    const element = mediaTypes[Math.floor(Math.random() * mediaTypes.length)]
    data.add(element)
  }

  return Array.from(data).join(',')
}

// Accept-Language
function acceptLanguage (): string {
  const ptBRVariations = [
    'pt-BR',
    'pt-BR,pt;q=0.9',
    'pt-BR;q=0.8,en-US;q=0.5',
    'pt-BR,en-US;q=0.7,en;q=0.3',
    'pt-BR;q=0.6,en-US;q=0.4,fr;q=0.2'
  ]

  const data = new Set<string>()
  for (let i = 0; i <= 2; i++) {
    const element = ptBRVariations[Math.floor(Math.random() * ptBRVariations.length)]
    data.add(element)
  }

  return Array.from(data).join(',')
}

export function fakeHeader (): Record<string, string> {
  return {
    'Upgrade-Insecure-Requests': upgradeInsecureRequests(),
    Accept: accept(),
    'Accept-Language': acceptLanguage(),
    'Accept-Encoding': '*',
    Connection: 'keep-alive',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'User-Agent': new UserAgent().toString(),
    Referer: 'https://google.com/'
  }
}
