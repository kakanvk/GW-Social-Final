export type PostInput = { title: string; content: string; published: boolean }
export type Post = PostInput & { id: number }
