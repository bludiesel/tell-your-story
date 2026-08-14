// page-flip ships no type declarations. Only the surface the book runtime uses
// is declared here — widening it is fine, inventing methods is not.
declare module 'page-flip' {
  export interface PageFlipSettings {
    width: number; height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number
    showCover?: boolean; usePortrait?: boolean
    maxShadowOpacity?: number; drawShadow?: boolean
    flippingTime?: number; clickEventForward?: boolean
    disableFlipByClick?: boolean; mobileScrollSupport?: boolean
    /** Lift the corner as the pointer merely passes near it. We turn this OFF —
        the page twitching at a hovering cursor reads as a fault, not an
        affordance. Present in page-flip's own Settings.ts but missing from its
        shipped types, same as curtainsjs omits `transparent` and `Vec3`. */
    showPageCorners?: boolean
    startPage?: number; autoSize?: boolean; swipeDistance?: number
  }
  export class PageFlip {
    constructor(element: HTMLElement, settings: PageFlipSettings)
    loadFromHTML(items: NodeListOf<Element> | HTMLElement[]): void
    getCurrentPageIndex(): number
    getPageCount(): number
    flipNext(corner?: 'top' | 'bottom'): void
    flipPrev(corner?: 'top' | 'bottom'): void
    flip(page: number, corner?: 'top' | 'bottom'): void
    turnToPage(page: number): void
    on(event: 'flip' | 'changeOrientation' | 'changeState' | 'init', cb: (e: { data: number | string }) => void): void
    destroy(): void
    updateFromHtml(items: NodeListOf<Element> | HTMLElement[]): void
  }
}
