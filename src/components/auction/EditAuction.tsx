import { FC, MouseEventHandler, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, FormLabel } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { Controller } from 'react-hook-form'
import * as API from '../../api/Api'
import { StatusCode } from '../../constants/errorConstants'
import { UpdateAuctionFields, useCreateUpdateAuctionForm } from '../../hooks/react-hook-form/useCreateUpdateAuction'
import { AuctionType } from '../../models/auction'
import { UserType } from '../../models/auth'

//shrani item v Props
interface Props {
    //dobi info od auctiona
    auction: AuctionType
    //zapri (ta) Profile popup
    closePopup: MouseEventHandler<HTMLButtonElement>
    //referenca na fetchAuctions funkcijo v Auctions
    fetchAuctions: () => Promise<void>
}

const EditAuction: FC<Props> = ({ auction, closePopup, fetchAuctions }) => {
    const { id, title, description, currentPrice, status, duration, image, userId } = auction!
    const defaultValues: AuctionType = {
        id,
        title,
        description,
        currentPrice,
        status,
        duration: new Date(duration), // Convert duration to Date object
        image,
        userId,
    }

    const { handleSubmit, errors, control } = useCreateUpdateAuctionForm({ defaultValues })
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const onSubmit = handleSubmit(async (data: UpdateAuctionFields) => {
        console.log("SUBMIT DATA:", data)
        console.log("SUBMIT FILE:", imageFile)

        if (!imageFile && !imagePreview)
            data.image = ""

        const response = await API.updateAuction(id, data)
        console.log(response)

        //TODO vsi status code ki lahko tu dobis
        if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
            response.data?.statusCode === StatusCode.FORBIDDEN ||
            response.data?.statusCode === StatusCode.UNAUTHORIZED
        ) {
            setApiError(response.data.message)
            setShowSuccess(false)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowSuccess(false)
            setShowError(true)
        }
        else {
            //edit uspel, preglej ce je bil poslan tudi file
            //ce se file ni spremenil, se ne uploada, in v editu ne spremeni
            if (imageFile) {
                const formData = new FormData()
                formData.append('image', imageFile, imageFile.name)
                const fileResponse = await API.uploadAuctionImage(
                    response.data.id, formData
                )
                if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST ||
                    fileResponse.data?.statusCode === StatusCode.FORBIDDEN
                ) {
                    setApiError(fileResponse.data.message)
                    setShowSuccess(false)
                    setShowError(true)
                } else if (fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
                    setApiError(fileResponse.data.message)
                    setShowSuccess(false)
                    setShowError(true)
                }
                else {
                    setShowError(false)
                    setShowSuccess(true)
                    fetchAuctions()
                }
            }
            else {
                setShowError(false)
                setShowSuccess(true)
                fetchAuctions()
            }
        }
    })

    //shrani FILE od posodobljene slike
    const [imageFile, setImageFile] = useState<File | null>(null)
    //image ki se zacasno prikaze v img elementu
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Function to handle image upload
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedImage = event.target.files && event.target.files[0]
        if (selectedImage) {
            setImageFile(selectedImage)

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(selectedImage)
        }
    }

    // Function to handle image removal
    const handleImageRemove = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    useEffect(() => {
        //dobi image ob zagonu
        if (defaultValues.image)
            setImagePreview(`${process.env.REACT_APP_API_URL}/files/${defaultValues.image}`)
        // console.log("Data:", defaultValues)
        // console.log("Image preview:", imagePreview)
        // console.log("Image file:", imageFile)
    }, [])

    return (
        <div className="text-black bg-white rounded-lg w-[540px]">
            {/* Greeting text */}
            <div className="mb-6">
                <p className="text-2xl font-bold">Edit auction</p>
            </div>
            <Form className="m-2" onSubmit={onSubmit}>
                {/* Slika */}
                <div className="flex justify-center items-center p-4 mb-3 rounded-2xl bg-gray-100 max-w-[524px] h-[200px] relative overflow-hidden">
                    {imagePreview ? (
                        <>
                            <div className="relative">
                                <img
                                    id="image"
                                    // src={`${process.env.REACT_APP_API_URL}/files/${imagePreview}`} alt="Uploaded"
                                    src={imagePreview} alt="Uploaded"                                    // className="w-auto max-w-[524px] h-[200px]" />
                                    className="w-full h-full object-cover" />

                            </div>
                            {/* button za odstrani sliko */}
                            <button
                                className="absolute top-0 right-0 bg-black m-2 rounded-full text-white px-3 py-2"
                                onClick={handleImageRemove}>
                                <svg className="bi bi-trash h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        // button ki doda sliko
                        <label className="cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <div
                                className="text-gray-900 border border-black custom-button">
                                <p className="text-black font-semibold">Add image</p>
                            </div>
                        </label>
                    )}
                </div>
                {/* Title in ostali */}
                <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                        <Form.Group className="flex flex-col">
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <input
                                    {...field}
                                    type="text"
                                    placeholder="Write item name here"
                                    aria-label="Title"
                                    aria-describedby="title"
                                    className={
                                        errors.title
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
                                {errors.title && (
                                    <div className="invalid-feedback">
                                        {errors.title.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <Form.Group className="flex flex-col">
                            <FormLabel htmlFor="description">Description</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Write description here..."
                                    aria-label="Description"
                                    aria-describedby="description"
                                    className={
                                        errors.description
                                            ? 'form-control is-invalid resize-none	'
                                            : 'form-control resize-none'
                                    }
                                />
                                {errors.description && (
                                    <div className="invalid-feedback">
                                        {errors.description.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="duration"
                    render={({ field }) => (
                        <Form.Group className="mb-2 flex flex-col relative">
                            <FormLabel htmlFor="duration">End date</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <input
                                    {...field}
                                    // type="date"
                                    type="datetime-local"
                                    placeholder="dd/mm/yyyy --:--"
                                    aria-label="End date"
                                    aria-describedby="duration"
                                    className={
                                        errors.duration
                                            ? 'form-control is-invalid appearance-none'
                                            : 'form-control appearance-none'
                                    }
                                    //input ne more dobit Date, zato pretvori Date v string
                                    value={field.value instanceof Date ? field.value.toISOString().substring(0, 16) : field.value}
                                />
                                {/* Ikonca v input formu: Clock*/}
                                {/* <span className="absolute right-0 p-3 mr-2 text-gray-500">
                                    <svg
                                        className='bi bi-clock-history'
                                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                                        <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                                        <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
                                    </svg>
                                </span> */}
                                {errors.duration && (
                                    <div className="invalid-feedback">
                                        {errors.duration.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />
                <div className='flex justify-end'>
                    <Button onClick={closePopup}
                        className="mr-4 bg-gray-200 custom-button hover:bg-gray-300">
                        Discard changes
                    </Button>
                    <Button
                        type="submit"
                        className="mr-4 bg-black custom-button text-white">
                        Edit auction
                    </Button>
                </div>
            </Form>
            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-red-500">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-red-500 bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
            {
                showSuccess && (
                    <ToastContainer className="p-3" position="top-end">
                        <Toast onClose={() => setShowSuccess(false)} show={showSuccess}>
                            <Toast.Header>
                                <strong className="me-auto text-green-500">Success</strong>
                            </Toast.Header>
                        </Toast>
                    </ToastContainer>
                )
            }
        </div>
    )
}
export default EditAuction
