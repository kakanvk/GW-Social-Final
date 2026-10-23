import { Plus } from 'lucide-react'
import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { ShortcutKbd } from '@/core/components/shortcut-kbd'
import { shortcutAria } from '@/core/lib/use-shortcut'
export function PostsToolbar({
  search,
  busy,
  onSearch,
  onCreate,
}: {
  search: string
  busy: boolean
  onSearch: (value: string) => void
  onCreate: () => void
}) {
  return (
    <div className="flex flex-shrink-0 flex-col flex-wrap items-center justify-between gap-2 border-b bg-white px-4 py-2 sm:flex-row lg:px-6">
      <h1 className="text-[17px] font-semibold">Bài viết</h1>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="search"
          aria-label="Tìm kiếm bài viết"
          placeholder="Tìm tiêu đề, nội dung…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full md:w-72"
        />
        <Button disabled={busy} onClick={onCreate} aria-keyshortcuts={shortcutAria('create')}>
          <Plus aria-hidden />
          Thêm bài viết
          <ShortcutKbd action="create" />
        </Button>
      </div>
    </div>
  )
}
