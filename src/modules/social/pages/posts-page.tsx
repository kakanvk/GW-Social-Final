import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { DangerModal } from '@/core/components/action-modal'
import { Button } from '@/core/components/ui/button'
import { useShortcut } from '@/core/lib/use-shortcut'
import { usePosts } from '../hooks/use-posts'
import { postsApi } from '../api/posts-api'
import { PostForm } from '../components/post-form'
import { PostsToolbar } from '../components/posts-toolbar'
import { PostsTable } from '../components/posts-table'
import type { Post } from '../types/post'
export default function PostsPage() {
  const { posts, loading, error, busy, load, mutate } = usePosts()
  const [search, setSearch] = useState('')
  const [editor, setEditor] = useState<Post | 'new' | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)
  const [saveError, setSaveError] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const editing = editor && editor !== 'new' ? editor : null
  const create = () => {
    if (!loading && !error && !busy) {
      setSaveError('')
      setEditor('new')
    }
  }
  useShortcut('create', create, {
    enabled: !loading && !error && !busy,
    ignoreWhenDialogOpen: true,
  })
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
  const visible = posts.filter((p) =>
    normalize(p.title + ' ' + p.content).includes(normalize(search.trim())),
  )
  return (
    <main className="flex min-h-svh flex-col bg-background">
      <PostsToolbar
        search={search}
        busy={busy || loading || !!error}
        onSearch={setSearch}
        onCreate={create}
      />
      {loading ? (
        <div
          role="status"
          className="flex items-center justify-center gap-2 py-12 text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin" />
          Đang tải bài viết…
        </div>
      ) : error ? (
        <div role="alert" className="p-6 text-center">
          <p className="mb-3 text-red-600">{error}</p>
          <Button variant="outline" onClick={() => void load()}>
            Thử lại
          </Button>
        </div>
      ) : (
        <PostsTable
          posts={visible}
          busy={busy}
          onEdit={(post) => {
            setSaveError('')
            setEditor(post)
          }}
          onDelete={(post) => {
            setDeleteError('')
            setDeleting(post)
          }}
        />
      )}
      <p className="px-4 py-2 text-xs text-muted-foreground" aria-live="polite">
        {!loading && !error && `${visible.length} / ${posts.length} bài viết`}
      </p>
      <PostForm
        open={editor !== null}
        post={editing}
        busy={busy}
        error={saveError}
        onClose={() => setEditor(null)}
        onSave={async (input) => {
          const ok = await mutate(() =>
            editing ? postsApi.update(editing.id, input) : postsApi.create(input),
          )
          if (ok) {
            setEditor(null)
            setSaveError('')
            toast.success(editing ? 'Đã cập nhật bài viết.' : 'Đã thêm bài viết.')
          } else setSaveError('Chưa lưu được bài viết. Nội dung vẫn được giữ lại để bạn thử lại.')
        }}
      />
      <DangerModal
        open={deleting !== null}
        busy={busy}
        error={deleteError}
        title="Xóa bài viết?"
        description={`Bạn có chắc muốn xóa bài viết “${deleting?.title ?? ''}”?`}
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return
          if (await mutate(() => postsApi.remove(deleting.id), deleting.id)) {
            setDeleting(null)
            toast.success('Đã xóa bài viết.')
          } else setDeleteError('Chưa xóa được bài viết. Vui lòng thử lại.')
        }}
      />
    </main>
  )
}
