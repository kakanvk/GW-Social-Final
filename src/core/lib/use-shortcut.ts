import type React from 'react'
import { useEffect, useRef } from 'react'

import { SHORTCUTS, type ShortcutAction, type ShortcutDefinition } from '@/core/config/shortcuts'

const isMac = () =>
  typeof navigator !== 'undefined' &&
  /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)

const definition = (action: ShortcutAction): ShortcutDefinition => SHORTCUTS[action]

/** Nhãn hiển thị của phím tắt, theo hệ điều hành. */
export function shortcutLabel(action: ShortcutAction) {
  const { label, macLabel } = definition(action)
  return isMac() && macLabel ? macLabel : label
}

/** Giá trị cho thuộc tính `aria-keyshortcuts`. */
export function shortcutAria(action: ShortcutAction) {
  const { key, mod } = definition(action)
  const name = key.length === 1 ? key.toUpperCase() : key
  return mod ? `${isMac() ? 'Meta' : 'Control'}+${name}` : name
}

type KeyLike = Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>

export function matchesShortcut(event: KeyLike, action: ShortcutAction) {
  const { key, mod } = definition(action)
  if (event.key?.toLowerCase() !== key.toLowerCase()) return false
  if (event.altKey || event.shiftKey) return false
  return mod ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
}

interface ShortcutOptions {
  enabled?: boolean
  /** Bỏ qua khi đang có dialog mở (dùng cho phím cấp trang như F4). */
  ignoreWhenDialogOpen?: boolean
}

/**
 * Bắt phím tắt trên toàn trang. Giữ phím (repeat) và lúc đang gõ IME
 * không kích hoạt lại thao tác.
 */
export function useShortcut(
  action: ShortcutAction,
  handler: () => void,
  { enabled = true, ignoreWhenDialogOpen = false }: ShortcutOptions = {},
) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || !matchesShortcut(event, action)) return
      if (ignoreWhenDialogOpen && document.querySelector('[role="dialog"], [role="alertdialog"]'))
        return
      event.preventDefault()
      if (!event.repeat) handlerRef.current()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [action, enabled, ignoreWhenDialogOpen])
}

/**
 * Bắt phím tắt trong phạm vi một phần tử (thường là `DialogContent`),
 * nên phím chỉ có tác dụng khi focus đang nằm trong phần tử đó.
 */
export function onShortcut(
  action: ShortcutAction,
  handler: (event: React.KeyboardEvent<HTMLElement>) => void,
): (event: React.KeyboardEvent<HTMLElement>) => void {
  return (event) => {
    if (event.nativeEvent.isComposing || !matchesShortcut(event, action)) return
    event.preventDefault()
    if (!event.repeat) handler(event)
  }
}
