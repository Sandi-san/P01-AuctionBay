import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface RegisterUserFields {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword: string
}

export const useRegisterForm = () => {
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().notRequired(),
    lastName: Yup.string().notRequired(),
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string()
      .matches(
        /^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/,
        'Password must contain least one number, lower or uppercase letter and must be longer than 6 characters.',
      )
      .required(),
      confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords do not match')
      .required('Passwords do not match'),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegisterUserFields>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(RegisterSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type RegisterForm = ReturnType<typeof useRegisterForm>
