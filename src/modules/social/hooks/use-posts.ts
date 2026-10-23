import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { postsApi } from '../api/posts-api'
import type { Post } from '../types/post'
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const locked = useRef(false)
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setPosts(await postsApi.list())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không thể tải bài viết.')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => {
    void load()
  }, [load])
  async function mutate(action: () => Promise<Post>, removedId?: number) {
    if (locked.current) return false
    locked.current = true
    setBusy(true)
    try {
      const result = await action()
      setPosts((old) =>
        removedId !== undefined
          ? old.filter((p) => p.id !== removedId)
          : old.some((p) => p.id === result.id)
            ? old.map((p) => (p.id === result.id ? result : p))
            : [result, ...old],
      )
      return true
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Không thể lưu thay đổi.')
      return false
    } finally {
      locked.current = false
      setBusy(false)
    }
  }
  return { posts, loading, error, busy, load, mutate }
}
