# react-scrollbar
Customize React scrollbar component, display when scrolling, hide after scroll end.

![image](https://github.com/user-attachments/assets/dd72021e-bfcb-4bfe-a760-05d9a13880f0)


## Usage

```TypeScript
export const App () => {
  const { ref, scrolling } = useScroll();

  return (
    <div class='relative' ref={ref}>
      <div class='overflow-y-auto'>Scroll Area</div>
      <Scrollbar scrollRef={ref} active={scrolling} />
    </div>
  )
}
```

- When `ref` container is scrolling, `Scrollbar` will display.
- When `ref` container height changed, `Scrollbar` will auto-resize.
- You can drag and scroll with scrollbar thumb.
- You can listen container's hover status and active scrollbar with it.
