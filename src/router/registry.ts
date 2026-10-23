import type { AppModule } from '@/core/types/module'

// Vite discovers only modules that exist. No imports of specific modules in the shell.
const discovered = import.meta.glob<AppModule>('../modules/*/module.ts', {
  eager: true,
  import: 'default',
})

export const availableModules = Object.values(discovered)
  .filter((module) => module.enabled !== false)
  .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))

const ids = new Set<string>()
const paths = new Set<string>()
for (const module of availableModules) {
  if (ids.has(module.id)) throw new Error(`Duplicate module ID: ${module.id}`)
  ids.add(module.id)
  for (const route of module.routes) {
    if (!route.path.startsWith('/') || route.path === '/' || route.path === '*') {
      throw new Error(`Invalid module route: ${route.path}`)
    }
    if (paths.has(route.path)) throw new Error(`Duplicate route: ${route.path}`)
    paths.add(route.path)
  }
}

export const modules = availableModules
  .filter((module) => module.navigation !== false)
  .map((module) => ({
    ...module,
    items: module.routes
      .filter((route) => route.navigation !== false)
      .map((route) => ({
        title: route.title,
        href: route.path,
        icon: route.icon,
      })),
  }))
  .filter((module) => module.items.length > 0)

export const defaultPath = modules[0]?.items[0]?.href ?? null
