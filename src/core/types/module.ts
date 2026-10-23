import type { ComponentType } from 'react'
import type { LucideIcon } from 'lucide-react'
export interface ModulePageProps {
  title: string
}
export interface ModuleRoute {
  path: string
  title: string
  icon: LucideIcon
  navigation?: boolean
  /** Trang tự xử lý khi người dùng không có quyền xem, không chuyển sang /forbidden. */
  selfGuarded?: boolean
  load: () => Promise<{ default: ComponentType<ModulePageProps> }>
}
export interface AppModule {
  id: string
  title: string
  order: number
  icon: LucideIcon
  enabled?: boolean
  navigation?: boolean
  routes: ModuleRoute[]
}
