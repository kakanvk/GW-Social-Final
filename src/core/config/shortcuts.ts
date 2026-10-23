/**
 * Cấu hình phím tắt dùng chung cho toàn hệ thống.
 *
 * Muốn đổi phím chỉ sửa ở đây: phím bắt (`useShortcut`, `onShortcut`),
 * nhãn trên nút (`ShortcutKbd`) và `aria-keyshortcuts` đều đọc từ file này.
 * Không viết cứng "F2", "F4", "Esc"... trong component.
 */

export interface ShortcutDefinition {
  /** Giá trị `KeyboardEvent.key` (không phân biệt hoa thường). */
  key: string
  /** Cần giữ Ctrl (Windows/Linux) hoặc ⌘ (macOS). */
  mod?: boolean
  /** Nhãn hiển thị trên nút. */
  label: string
  /** Nhãn riêng cho macOS, nếu khác `label`. */
  macLabel?: string
}

export const SHORTCUTS = {
  /** Thêm mới trên trang danh sách. */
  create: { key: 'F4', label: 'F4' },
  /** Lưu trong form/dialog. */
  save: { key: 'F2', label: 'F2' },
  /** Hủy/đóng dialog. */
  cancel: { key: 'Escape', label: 'Esc' },
  /** Mở bản xem trước để in lịch công tác. */
  print: { key: 'p', mod: true, label: 'Ctrl P', macLabel: '⌘P' },
  /** Tạo random một bộ đề theo ma trận (form Phương án đề thi). */
  generate: { key: 'F8', label: 'F8' },
  /** Lưu bộ đề vừa random (form Phương án đề thi). */
  saveSet: { key: 'F9', label: 'F9' },
  /** Mở ô tìm kiếm trên header. */
  search: { key: 'k', mod: true, label: 'Ctrl K', macLabel: '⌘K' },
} satisfies Record<string, ShortcutDefinition>

export type ShortcutAction = keyof typeof SHORTCUTS
