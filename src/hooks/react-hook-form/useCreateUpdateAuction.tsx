import { yupResolver } from '@hookform/resolvers/yup'
import { AuctionType } from "../../models/auction"
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

export interface CreateAuctionFields {
  title: string
  description?: string
  currentPrice: number
  status: string
  duration: Date
  image?: string
}

export interface UpdateAuctionFields {
  title?: string
  description?: string
  currentPrice: number
  status?: string
  duration: Date
  image?: string
}

//za update
interface Props {
  defaultValues?: AuctionType
}

export const useCreateUpdateAuctionForm = ({ defaultValues }: Props) => {
  const CreateUpdateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
    currentPrice: Yup.number().required('Price is required'),
    status: Yup.string().required('Status is required'),
    duration: Yup.date().required('Duration is required'),
    image: Yup.string().notRequired(),
  })

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      currentPrice: 0,
      status: 'In progress',
      duration: new Date(Date.now()),
      image: '',
      ...defaultValues,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateUpdateAuctionSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateAuctionSchema = ReturnType<
  typeof useCreateUpdateAuctionForm
>
