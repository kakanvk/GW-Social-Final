import { useEffect, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { AlertCircle, LoaderCircle, Save } from 'lucide-react'
import { FormModal } from '@/core/components/form-modal'
import { ShortcutKbd } from '@/core/components/shortcut-kbd'
import { shortcutAria, useShortcut } from '@/core/lib/use-shortcut'
import { postSchema } from '../schema/post-schema'
import type { Post, PostInput } from '../types/post'

function FormRow({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid gap-x-4 gap-y-1 sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="flex items-baseline justify-between gap-2 sm:block sm:pt-[8px]">
        <label htmlFor={htmlFor} className="text-[13px] leading-[18px] font-medium text-slate-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" className="mt-1 flex items-center gap-1 text-[12px] text-red-600">
      <AlertCircle aria-hidden className="size-3.5 shrink-0" />
      {message}
    </p>
  ) : null
}
const inputClass = (invalid: boolean) =>
  `h-[34px] w-full rounded-lg border bg-white px-3 text-[13px] text-slate-800 transition placeholder:text-slate-400 focus:outline-none focus:ring-2 ${invalid ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'}`
export function PostForm({
  open,
  post,
  busy,
  error,
  onClose,
  onSave,
}: {
  open: boolean
  post: Post | null
  busy: boolean
  error: string
  onClose: () => void
  onSave: (input: PostInput) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, submitCount },
  } = useForm<PostInput>({
    resolver: yupResolver(postSchema),
    defaultValues: { title: '', content: '', published: false },
  })
  const published = useWatch({ control, name: 'published' })
  useEffect(() => {
    if (open)
      reset(
        post
          ? { title: post.title, content: post.content, published: post.published }
          : { title: '', content: '', published: false },
      )
  }, [open, post, reset])
  const close = () => {
    if (!busy) onClose()
  }
  const save = handleSubmit(async (values) => {
    if (!busy) await onSave(values)
  })
  useShortcut('cancel', close, { enabled: open })
  useShortcut('save', save, { enabled: open })
  return (
    <FormModal isOpen={open} busy={busy} onClose={close} labelledBy="post-form-title">
      <div className="flex max-h-[calc(100svh-2rem)] w-full flex-col rounded-xl bg-white shadow-xl sm:max-h-[calc(100svh-3rem)]">
        <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <h3 id="post-form-title" className="text-[16px] font-semibold text-slate-900">
              {post ? 'Sửa bài viết' : 'Thêm bài viết'}
            </h3>
            {submitCount > 0 && Object.keys(errors).length > 0 && (
              <span aria-live="polite" className="flex items-center gap-1 text-[12px] text-red-600">
                <AlertCircle className="size-3.5" />
                {Object.keys(errors).length} lỗi cần kiểm tra
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={close}
              disabled={busy}
              aria-keyshortcuts={shortcutAria('cancel')}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Hủy
              <ShortcutKbd action="cancel" />
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={busy}
              aria-keyshortcuts={shortcutAria('save')}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-lg bg-primary px-3 text-[13px] font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {busy ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              {busy ? 'Đang lưu…' : 'Lưu'}
              {!busy && <ShortcutKbd action="save" />}
            </button>
          </div>
        </header>
        {error && (
          <p role="alert" className="px-5 pt-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <form
          noValidate
          onSubmit={save}
          className="relative min-h-0 flex-1 space-y-3.5 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4"
        >
          <FormRow label="Tiêu đề" htmlFor="post-title" required>
            <input
              id="post-title"
              autoComplete="off"
              placeholder="Nhập tiêu đề bài viết"
              disabled={busy}
              {...register('title')}
              aria-invalid={!!errors.title}
              aria-describedby="post-title-error"
              className={inputClass(!!errors.title)}
            />
            <FieldError id="post-title-error" message={errors.title?.message} />
          </FormRow>
          <FormRow label="Nội dung" htmlFor="post-content" required>
            <textarea
              id="post-content"
              rows={5}
              placeholder="Nhập nội dung bài viết"
              disabled={busy}
              {...register('content')}
              aria-invalid={!!errors.content}
              aria-describedby="post-content-error"
              className={`${inputClass(!!errors.content)} h-auto resize-y py-2 leading-relaxed`}
            />
            <FieldError id="post-content-error" message={errors.content?.message} />
          </FormRow>
          <FormRow label="Xuất bản" htmlFor="post-published">
            <div className="flex items-center pt-1">
              <label
                htmlFor="post-published"
                className="relative inline-flex cursor-pointer items-center"
              >
                <input
                  type="checkbox"
                  id="post-published"
                  disabled={busy}
                  {...register('published')}
                  className="peer sr-only"
                />
                <div className="peer h-5 w-9 rounded-full bg-slate-200 transition-colors duration-200 ease-in-out peer-checked:bg-red-600 peer-disabled:opacity-50 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:content-[''] peer-checked:after:translate-x-4 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary" />
                <span className="ml-2.5 text-[13px] font-medium text-slate-700">
                  {published ? 'Đã xuất bản' : 'Chưa xuất bản'}
                </span>
              </label>
            </div>
          </FormRow>
        </form>
      </div>
    </FormModal>
  )
}
