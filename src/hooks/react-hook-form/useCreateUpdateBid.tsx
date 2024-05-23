import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

//STRUKTURA ZA CREATE BID FORME
export interface CreateBidFields {
  price: number;
  userId: number;
  auctionId: number;
}

//FORMA KATERO SKLICUJEMO V FORMAH
export const useCreateBidForm = () => {
  const CreateBidSchema = Yup.object().shape({
    price: Yup.number().required('Price is required'),
    userId: Yup.number().required(),
    auctionId: Yup.number().required(),
  });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    defaultValues: {
      price: 0,
      userId: 0,
      auctionId: 0,
    },
    mode: 'onSubmit',
    resolver: yupResolver(CreateBidSchema),
  });

  return {
    handleSubmit,
    errors,
    control,
    setValue,
  };
};

export type CreateUpdateBidSchema = ReturnType<typeof useCreateBidForm>;
