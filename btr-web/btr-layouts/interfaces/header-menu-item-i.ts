export interface HeaderMenuItemI {
  label: string,
  action?: (...args : any[]) => any
  args?: any
  icon?: string
  setActive?: boolean
}
