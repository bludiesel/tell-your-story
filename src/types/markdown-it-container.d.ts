// markdown-it-container ships no types. The plugin surface we use is small and
// stable: a name and a render(tokens, idx) callback.
declare module 'markdown-it-container' {
  import type MarkdownIt from 'markdown-it'
  interface ContainerOpts {
    validate?: (params: string) => boolean
    render?: (tokens: any[], idx: number) => string
    marker?: string
  }
  const container: MarkdownIt.PluginWithParams
  export default container
  export type { ContainerOpts }
}
