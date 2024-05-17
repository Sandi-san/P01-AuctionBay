import { FC, MouseEventHandler, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Form, FormLabel } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { Controller } from 'react-hook-form'
import { UpdateUserFields, useCreateUpdateUserForm } from '../../hooks/react-hook-form/useCreateUpdateUser'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import { UpdateUserType, UserType } from '../../models/auth'

//shrani item v Props
interface Props {
    user: UserType | null
    //zapri (ta) Profile popup
    closePopup: MouseEventHandler<HTMLButtonElement>
    //odpri Password formo
    openPopupPassword: MouseEventHandler<HTMLButtonElement>
    //odpri Image formo
    openPopupImage: MouseEventHandler<HTMLButtonElement>
}

const ProfileSettings: FC<Props> = (
    { user, closePopup, openPopupPassword, openPopupImage }) => {
    const { id, firstName, lastName, email } = user!
    const defaultValues: UpdateUserType = {
        id,
        firstName,
        lastName,
        email,
    }
    const { handleSubmit, errors, control } = useCreateUpdateUserForm({ defaultValues })
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const navigate = useNavigate()

    const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
        console.log(user?.id)

        const response = await API.updateUser(data)
        console.log(response)

        //TODO vsi status code ki lahko tu dobis
        if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
            response.data?.statusCode === StatusCode.FORBIDDEN
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
            setShowError(false)
            setShowSuccess(true)
            navigate('/')
        }
    })

    const togglePopupPassword: React.MouseEventHandler<HTMLButtonElement> = (event?) => {
        if (event) {
            event.preventDefault()
            closePopup(event)
            openPopupPassword(event)
        }
    }

    const togglePopupImage: React.MouseEventHandler<HTMLButtonElement> = (event?) => {
        if (event) {
            event.preventDefault()
            closePopup(event)
            openPopupImage(event)
        }
    }

    return (
        <div className="text-black bg-white rounded-lg w-[540px]">
            {/* Greeting text */}
            <div className="mb-6">
                <p className="text-2xl font-bold mb-2">Profile settings</p>
            </div>
            <Form className="m-2" onSubmit={onSubmit}>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <Form.Group className="flex flex-col">
                                    <FormLabel htmlFor="firstName">First name</FormLabel>
                                    <div className='px-2 py-1 mb-1 w-full'>
                                        <input
                                            {...field}
                                            type="text"
                                            aria-label="First name"
                                            aria-describedby="firstName"
                                            className={
                                                errors.firstName
                                                    ? 'form-control is-invalid'
                                                    : 'form-control'
                                            }
                                        />
                                        {errors.firstName && (
                                            <div className="invalid-feedback">
                                                {errors.firstName.message}
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>
                            )}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-2">
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                                <Form.Group className="flex flex-col">
                                    <FormLabel htmlFor="lastName">Last name</FormLabel>
                                    <div className='px-2 py-1 mb-1 w-full'>
                                        <input
                                            {...field}
                                            type="text"
                                            aria-label="Last name"
                                            aria-describedby="lastName"
                                            className={
                                                errors.lastName
                                                    ? 'form-control is-invalid'
                                                    : 'form-control'
                                            }
                                        />
                                        {errors.lastName && (
                                            <div className="invalid-feedback">
                                                {errors.lastName.message}
                                            </div>
                                        )}
                                    </div>
                                </Form.Group>
                            )}
                        />
                    </div>
                </div>
                <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                        <Form.Group className="mb-2 flex flex-col">
                            <FormLabel htmlFor="email">E-mail</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="example@gmail.com"
                                    aria-label="E-mail"
                                    aria-describedby="email"
                                    className={
                                        errors.email
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />

                <div className='flex flex-col items-start'>
                    {/* ko kliknes button, v parentu sporoci da se je odprl popup */}
                    <Button onClick={togglePopupPassword} className="text-black mb-4">
                        <span className="text-black">Change password</span>
                    </Button>
                    <Button onClick={togglePopupImage} className="text-black mb-4">
                        <span className="text-black">Change profile picture</span>
                    </Button>
                </div>
                <div className='flex justify-end'>
                    <Button onClick={closePopup}
                        className="mr-4 bg-gray-200 custom-button hover:bg-gray-300">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="mr-4 bg-customYellow custom-button hover:bg-customYellow-dark">
                        Save changes
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
            {showSuccess && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowSuccess(false)} show={showSuccess}>
                        <Toast.Header>
                            <strong className="me-auto text-green-500">Success</strong>
                        </Toast.Header>
                    </Toast>
                </ToastContainer>
            )}
        </div>
    )
}
export default ProfileSettings
