import { useState } from '#app'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

interface AlertOptions {
  title: string
  description?: string
  type?: AlertType
  duration?: number
}

interface AlertState extends Required<Omit<AlertOptions, 'duration'>> {
  id: number
  duration?: number
}

export const useAlerts = () => {
  const alerts = useState<AlertState[]>('app-alerts', () => [])

  const dismiss = (id: number) => {
    alerts.value = alerts.value.filter((alert) => alert.id !== id)
  }

  const push = (options: AlertOptions) => {
    const alert: AlertState = {
      id: Date.now() + Math.random(),
      title: options.title,
      description: options.description ?? '',
      type: options.type ?? 'info',
      duration: options.duration ?? 4000,
    }

    alerts.value = [...alerts.value, alert]

    if (alert.duration) {
      setTimeout(() => dismiss(alert.id), alert.duration)
    }
  }

  return { alerts, push, dismiss }
}
