/**
 * Checks if the element is scrolling.
 * Usage:
 * const { ref, scrolling } = useScroll()
 * <div ref={ref}>Scrollable content</div>
 */
import { useCallback, useEffect, useRef, useState } from 'react'

export function useScroll<T extends HTMLElement = any>(stay = 800) {
  const [scrolling, setScrolling] = useState(false)
  const ref = useRef<T>(null)
  const timer = useRef<NodeJS.Timeout | null>(null)
  const onScroll = useCallback(() => setScrolling(true), [])
  const onScrollEnd = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }
    timer.current = setTimeout(() => setScrolling(false), stay)
  }, [stay])

  useEffect(() => {
    const node = ref.current

    if (node) {
      node.addEventListener('scroll', onScroll)
      node.addEventListener('wheel', onScroll)
      node.addEventListener('scrollend', onScrollEnd)
      node.addEventListener('mouseleave', onScrollEnd)

      return () => {
        node?.removeEventListener('scroll', onScroll)
        node?.removeEventListener('wheel', onScroll)
        node?.removeEventListener('scrollend', onScrollEnd)
        node?.removeEventListener('mouseleave', onScrollEnd)
      }
    }

    return undefined
  }, [ref.current])

  return { ref, scrolling }
}
