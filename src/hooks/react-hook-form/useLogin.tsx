import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

//STRUKTURA ZA LOGIN USER FORME
export interface LoginUserFields {
  email: string;
  password: string;
}

//FORMA KATERO SKLICUJEMO V FORMAH
export const useLoginForm = () => {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email().required('Please enter a valid email'),
    password: Yup.string(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
    resolver: yupResolver(LoginSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
  };
};

export type LoginForm = ReturnType<typeof useLoginForm>;
