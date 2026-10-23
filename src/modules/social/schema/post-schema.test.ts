import { describe, expect, it } from 'vitest'
import { postSchema } from './post-schema'
describe('Bài viết đơn giản', () => {
  it('trim tiêu đề, nội dung và giữ trạng thái chưa xuất bản', async () => {
    await expect(
      postSchema.validate({ title: '  Tiêu đề  ', content: ' Nội dung ', published: false }),
    ).resolves.toEqual({ title: 'Tiêu đề', content: 'Nội dung', published: false })
  })
  it.each([
    { title: ' ', content: 'Nội dung', published: true },
    { title: 'Tiêu đề', content: ' ', published: false },
    { title: 'a'.repeat(121), content: 'Nội dung', published: false },
    { title: 'Tiêu đề', content: 'a'.repeat(2001), published: true },
    { title: 'Tiêu đề', content: 'Nội dung' },
  ])('từ chối dữ liệu không hợp lệ', async (input) => {
    await expect(postSchema.validate(input)).rejects.toThrow()
  })
})
