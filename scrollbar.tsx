/**
 * Customized scrollbar component.
 * Usage:
 * const ref = useRef<HTMLDivElement>(null)
 * const [isHovered, setHovered] = useState(false) // wrapper is hovered.
 *
 * <div className="wrapper relative">
 *   <div ref={ref}>Scrollable content</div>
 *   <Scrollbar scrollRef={ref} active={isHovered} />
 * </div>
 */
import {
  FC,
  MouseEvent as ReactMouseEvent,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

interface IProps {
  scrollRef: RefObject<HTMLElement>
  active?: boolean
  offset?: number
}

const SCROLL_BOX_MIN_HEIGHT = 20

export const Scrollbar: FC<IProps> = ({ scrollRef, active = true, offset = 0 }) => {
  const [scrollThumbHeight, setScrollThumbHeight] = useState(SCROLL_BOX_MIN_HEIGHT)
  const [posT, setPosT] = useState(0)
  const [lastScrollThumbPosition, setScrollThumbPosition] = useState(0)
  const [isDragging, setDragging] = useState(false)
  const [noScrollArea, setNoScrollArea] = useState(false)
  const visible = useMemo(
    () => (active || isDragging) && !noScrollArea,
    [active, isDragging, noScrollArea]
  )
  const scrollElClientHRef = useRef(1)
  const scrollElScrollHRef = useRef(1)

  useEffect(() => {
    if (!scrollRef.current) return
    const scrollEl = scrollRef.current
    scrollElClientHRef.current = scrollEl.clientHeight
    scrollElScrollHRef.current = scrollEl.scrollHeight
    scrollEl.addEventListener('scroll', handleScroll, true)
    return () => {
      scrollEl.removeEventListener('scroll', handleScroll, true)
    }
  }, [])

  useMemo(() => {
    const clientHeight = scrollElClientHRef.current || 1
    const scrollHeight = scrollElScrollHRef.current || 1
    setNoScrollArea(clientHeight === scrollHeight)
    const scrollThumbPercentage = clientHeight / scrollHeight
    const scrollThumbHeight = Math.max(scrollThumbPercentage * clientHeight, SCROLL_BOX_MIN_HEIGHT)
    setScrollThumbHeight(scrollThumbHeight)
  }, [scrollElClientHRef.current, scrollElScrollHRef.current])

  const handleDocumentMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        setDragging(false)
      }
    },
    [isDragging]
  )

  const handleDocumentMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        e.stopPropagation()
        const scrollEl = scrollRef.current
        if (!scrollEl) return
        const { scrollHeight, offsetHeight } = scrollEl

        const deltaY = e.clientY - lastScrollThumbPosition
        const percentage = deltaY * (scrollHeight / offsetHeight)

        setScrollThumbPosition(e.clientY)
        setPosT(Math.min(Math.max(0, posT + deltaY), offsetHeight - scrollThumbHeight))
        scrollEl.scrollTop = Math.min(scrollEl.scrollTop + percentage, scrollHeight - offsetHeight)
      }
    },
    [isDragging, lastScrollThumbPosition, scrollThumbHeight, posT]
  )

  useEffect(() => {
    //t his is handle the dragging on scroll-thumb
    document.addEventListener('mousemove', handleDocumentMouseMove)
    document.addEventListener('mouseup', handleDocumentMouseUp)
    document.addEventListener('mouseleave', handleDocumentMouseUp)
    return function cleanup() {
      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('mouseup', handleDocumentMouseUp)
      document.removeEventListener('mouseleave', handleDocumentMouseUp)
    }
  }, [handleDocumentMouseMove, handleDocumentMouseUp])

  const handleScroll = () => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    const { scrollTop, scrollHeight, clientHeight } = scrollEl
    scrollElClientHRef.current = clientHeight
    scrollElScrollHRef.current = scrollHeight
    let posT = (parseInt(`${scrollTop}`, 10) / parseInt(`${scrollHeight}`, 10)) * clientHeight
    posT = Math.min(posT, clientHeight - scrollThumbHeight)
    setPosT(posT)
  }

  const handleScrollThumbMouseDown = useCallback((e: ReactMouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setScrollThumbPosition(e.clientY)
    setDragging(true)
  }, [])

  return (
    <div
      className="absolute bottom-0 right-0 h-full w-2 bg-transparent rounded-lg"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className="absolute top-0 w-full bg-neutral-300 left-0 h-8 rounded-lg"
        style={{ top: posT + offset, height: scrollThumbHeight }}
        onMouseDown={handleScrollThumbMouseDown}
      ></div>
    </div>
  )
}
