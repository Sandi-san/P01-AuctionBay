import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { BidType } from '../../models/bid'

export interface CreateBidFields {
  price: number,
  status: string,
  userId: number,
  auctionId: number,
}

export interface UpdateBidFields {
  price: number,
  status: string,
  // userId: number,
  // auctionId: number,
}

//za update
interface Props {
  defaultValues?: BidType
}

// export const useCreateUpdateBidForm = ({ defaultValues }: Props) => {
export const useCreateBidForm = () => {
  const CreateBidSchema = Yup.object().shape({
    price: Yup.number().required('Price is required'),
    status: Yup.string().required('Status is required'),
    userId: Yup.number().required(),
    auctionId: Yup.number().required(),
  })

  // const UpdateBidSchema = Yup.object().shape({
  //   price: Yup.number().notRequired(),
  //   status: Yup.string().notRequired(),
  // })

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      price: 0,
      status: 'In progress',
      userId: 0,
      auctionId: 0,
      // ...defaultValues,
    },
    mode: 'onSubmit',
    // ce so defaultValues, update, sicer create
    // resolver: defaultValues
    //   ? yupResolver(UpdateBidSchema)
    //   : yupResolver(CreateBidSchema),
    resolver: yupResolver(CreateBidSchema)
  })

  return {
    handleSubmit,
    errors,
    control,
    setValue,
  }
}

export type CreateUpdateBidSchema = ReturnType<
  // typeof useCreateUpdateBidForm
  typeof useCreateBidForm
>
