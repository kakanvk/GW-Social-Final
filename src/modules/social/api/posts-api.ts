import { request } from './http-client'
import type { Post, PostInput } from '../types/post'
export const postsApi = {
  list: () => request<Post[]>('/posts?_sort=id&_order=desc'),
  create: (input: PostInput) =>
    request<Post>('/posts', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: PostInput) =>
    request<Post>('/posts/' + id, { method: 'PATCH', body: JSON.stringify(input) }),
  remove: (id: number) => request<Post>('/posts/' + id, { method: 'DELETE' }),
}
