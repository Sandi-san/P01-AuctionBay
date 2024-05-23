import { yupResolver } from '@hookform/resolvers/yup'
import { UpdateUserType } from '../../models/auth'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

//STRUKTURA ZA CREATE USER FORME
export interface CreateUserFields {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirm_password: string
}

//STRUKTURA ZA UPDATE USER FORME
export interface UpdateUserFields {
  firstName?: string
  lastName?: string
  email: string
  old_password?: string
  password?: string
  confirm_password?: string
}

//za update
interface Props {
  defaultValues?: UpdateUserType
}

//FORMA KATERO SKLICUJEMO V FORMAH
export const useCreateUpdateUserForm = ({ defaultValues }: Props) => {
  const CreateUserSchema = Yup.object().shape({
    firstName: Yup.string().notRequired(),
    lastName: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    old_password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must contain least one number, lower or uppercase letter and must be longer than 6 characters.',
      )
      .required(),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must contain least one number, lower or uppercase letter and must be longer than 6 characters.',
      )
      .required(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Passwords do not match'),
  })

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().notRequired(),
    lastName: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    old_password: Yup.string().notRequired(),
    password: Yup.string().notRequired(),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      old_password: '',
      password: '',
      confirm_password: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    // ce so defaultValues, update, sicer create
    resolver: defaultValues
      ? yupResolver(UpdateUserSchema)
      : yupResolver(CreateUserSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateUserForm = ReturnType<typeof useCreateUpdateUserForm>
