import { yupResolver } from '@hookform/resolvers/yup'
import { AuctionType } from "../../models/auction"
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

//STRUKTURA ZA CREATE AUCTION FORME
export interface CreateAuctionFields {
  title: string
  description?: string
  currentPrice: number
  status: string
  duration: Date
  image?: string
  userId: number
}

//STRUKTURA ZA EDIT AUCTION FORME
export interface UpdateAuctionFields {
  title?: string
  description?: string
  currentPrice: number
  status?: string
  duration: Date
  image?: string
  // userId: number
}

//za update
interface Props {
  defaultValues?: AuctionType
}

//FORMA KATERO SKLICUJEMO V FORMAH
export const useCreateUpdateAuctionForm = ({ defaultValues }: Props) => {
  const CreateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
    currentPrice: Yup.number().required('Price is required'),
    status: Yup.string().required('Status is required'),
    duration: Yup.date().required('Duration is required'),
    image: Yup.string().notRequired(),
    userId: Yup.number().required(),
  })

  const UpdateAuctionSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().notRequired(),
    currentPrice: Yup.number().notRequired(),
    status: Yup.string().notRequired(),
    duration: Yup.date().notRequired(),
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
      userId: 0,
      ...defaultValues,
    },
    mode: 'onSubmit',
    // ce so defaultValues, update, sicer create
    resolver: defaultValues
      ? yupResolver(UpdateAuctionSchema)
      : yupResolver(CreateAuctionSchema),
  })

  return {
    handleSubmit,
    errors,
    control,
  }
}

export type CreateUpdateAuctionSchema = ReturnType<typeof useCreateUpdateAuctionForm>
