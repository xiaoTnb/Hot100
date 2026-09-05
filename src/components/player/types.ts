export interface CodeLine {
  id: string
  text: string
}

export type CodeLanguage = 'java' | 'javascript'

export interface PlayerMethod {
  id: string
  label: string
  complexity: string
  languages?: CodeLanguage[]
}
