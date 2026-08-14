// curtainsjs ships no type declarations. Only the surface the curtain runtime
// touches is declared — widening this is fine, inventing methods is not.
declare module 'curtainsjs' {
  export interface CurtainsParams {
    container: string | HTMLElement
    pixelRatio?: number
    watchScroll?: boolean
    production?: boolean
    antialias?: boolean
    alpha?: boolean
  }
  export class Curtains {
    constructor(params: CurtainsParams)
    onError(cb: () => void): this
    onContextLost(cb: () => void): this
    onRender(cb: () => void): this
    resize(): void
    dispose(): void
  }
  export interface Uniform { name: string; type: string; value: unknown }
  export interface PlaneParams {
    vertexShader?: string
    fragmentShader?: string
    widthSegments?: number
    heightSegments?: number
    uniforms?: Record<string, Uniform>
  }
  export class Plane {
    constructor(curtains: Curtains, element: HTMLElement, params?: PlaneParams)
    uniforms: Record<string, { value: unknown }>
    onRender(cb: () => void): this
    onReady(cb: () => void): this
    remove(): void
  }
}
