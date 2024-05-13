export type UserType = {
  id: number
  firstName?: string
  lastName?: string
  email: string
  image?: string
}
export type UpdateUserType = {
  id?: number
  firstName?: string
  lastName?: string
  email?: string
  image?: string
  password?: string
  old_password?: string
  confirm_password?: string
}
