import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostsPage from './posts-page'
import type { Post } from '../types/post'
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
describe('CRUD bài viết theo form Lang', () => {
  it('thêm, sửa trạng thái xuất bản và xác nhận xóa', async () => {
    let posts: Post[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (_url: string, options?: RequestInit) => {
        let result: unknown = posts
        if (options?.method === 'POST') {
          const post = { ...JSON.parse(options.body as string), id: 1 }
          posts = [post]
          result = post
        }
        if (options?.method === 'PATCH') {
          posts = [{ ...posts[0], ...JSON.parse(options.body as string) }]
          result = posts[0]
        }
        if (options?.method === 'DELETE') {
          posts = []
          result = {}
        }
        return { ok: true, json: async () => result }
      }),
    )
    const user = userEvent.setup()
    render(<PostsPage />)
    await waitFor(() => expect(screen.getByRole('button', { name: /Thêm bài viết/ })).toBeEnabled())
    await user.click(screen.getByRole('button', { name: /Thêm bài viết/ }))
    let dialog = await screen.findByRole('dialog')
    await user.type(within(dialog).getByLabelText(/Tiêu đề/), 'Bài đầu tiên')
    await user.type(within(dialog).getByLabelText(/Nội dung/), 'Nội dung bài đầu tiên')
    await user.click(within(dialog).getByRole('button', { name: /^Lưu/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(posts[0].published).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Sửa Bài đầu tiên' }))
    dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByLabelText(/Tiêu đề/)).toHaveValue('Bài đầu tiên')
    await user.click(within(dialog).getByRole('checkbox'))
    await user.click(within(dialog).getByRole('button', { name: /^Lưu/ }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(posts[0].published).toBe(true)
    await user.click(screen.getByRole('button', { name: 'Xóa Bài đầu tiên' }))
    expect(posts).toHaveLength(1)
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Hủy' }))
    expect(posts).toHaveLength(1)
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: 'Xóa Bài đầu tiên' }))
    await user.click(
      within(await screen.findByRole('dialog')).getByRole('button', { name: 'Xác nhận' }),
    )
    await waitFor(() => expect(posts).toHaveLength(0))
    expect(await screen.findByText('Không có bài viết phù hợp.')).toBeInTheDocument()
  })
})
