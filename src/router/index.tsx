import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageLoading } from '@/core/components/page-loading'
import { availableModules, defaultPath } from './registry'
const routes = availableModules.flatMap((module) =>
  module.routes.map((route) => ({ ...route, Page: lazy(route.load) })),
)
export function AppRouter() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to={defaultPath ?? '/posts'} replace />} />
        {routes.map(({ path, title, Page }) => (
          <Route key={path} path={path} element={<Page title={title} />} />
        ))}
        <Route path="*" element={<Navigate to={defaultPath ?? '/posts'} replace />} />
      </Routes>
    </Suspense>
  )
}
