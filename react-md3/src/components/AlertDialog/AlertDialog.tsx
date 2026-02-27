import type { ReactNode } from 'react'

import { Dialog } from '../Dialog/Dialog'
import './AlertDialog.css'

type AlertDialogSeverity = 'warning' | 'error'

type AlertDialogProps = {
  title: string
  description: string
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
  onCancel?: () => void
  confirmLabel: string
  cancelLabel: string
  severity?: AlertDialogSeverity
}

export function AlertDialog({
  severity = 'error',
  description,
  confirmLabel,
  cancelLabel,
  ...props
}: AlertDialogProps) {
  return (
    <Dialog
      {...props}
      cancelLabel={cancelLabel}
      className={['m3-alert-dialog', `m3-alert-dialog--${severity}`].join(' ')}
      confirmLabel={confirmLabel}
      description={description}
      dismissible={false}
      role="alertdialog"
    />
  )
}
