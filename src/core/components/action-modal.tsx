import { Save, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export type ActionModalProps = {
  open: boolean
  title: string
  description: string
  busy: boolean
  error?: string | null
  onCancel: () => void
  onConfirm: () => void
  cancelLabel?: string
  confirmLabel?: string
  busyLabel?: string
}

export function ConfirmModal(props: ActionModalProps) {
  return <ActionModal {...props} destructive={false} />
}

export function DangerModal(props: ActionModalProps) {
  return <ActionModal {...props} destructive />
}

function ActionModal({
  open,
  title,
  description,
  destructive = false,
  busy,
  error,
  onCancel,
  onConfirm,
  cancelLabel = 'Hủy',
  confirmLabel = 'Xác nhận',
  busyLabel = 'Đang xử lý…',
}: ActionModalProps & { destructive: boolean }) {
  const Icon = destructive ? Trash2 : Save
  return (
    <Dialog
      open={open}
      disablePointerDismissal
      onOpenChange={(next, details) => {
        if (busy) {
          details.cancel()
          return
        }
        if (!next) onCancel()
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/20 backdrop-blur-sm"
        className="gap-0 overflow-hidden border border-border p-6 text-center shadow-xl ring-0 sm:max-w-[40rem]"
      >
        <div
          className={`mx-auto mb-5 grid size-20 place-items-center rounded-full ${destructive ? 'bg-red-50' : 'bg-blue-50'}`}
        >
          <Icon
            aria-hidden="true"
            className={`size-10 ${destructive ? 'text-red-600' : 'text-blue-600'}`}
            strokeWidth={1.5}
          />
        </div>
        <DialogHeader className="items-center gap-3 text-center">
          <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
          <DialogDescription className="leading-relaxed">{description}</DialogDescription>
        </DialogHeader>
        {error && (
          <p role="alert" className="mt-4 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        <DialogFooter className="m-0 mt-7 flex-row gap-3 rounded-none border-0 bg-transparent p-0">
          <Button
            variant="secondary"
            className="h-10 flex-1 border-0"
            disabled={busy}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            className={`h-10 flex-1 border-0 text-white ${destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={busy}
            onClick={onConfirm}
          >
            {busy ? busyLabel : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
