/**
 * Device ID management for local and server-side tracking
 */

export function getDeviceId(): string {
  if (typeof window === 'undefined') {
    return 'server-device'
  }

  let deviceId = localStorage.getItem('nb_device_id')
  
  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    localStorage.setItem('nb_device_id', deviceId)
  }
  
  return deviceId
}

export function ensureDeviceId(): void {
  if (typeof window !== 'undefined') {
    getDeviceId()
  }
}
