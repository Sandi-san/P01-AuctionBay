import { FC, MouseEventHandler, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, FormLabel } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import authStore from '../../stores/auth.store'
import { Controller } from 'react-hook-form'
import { RegisterUserFields, useRegisterForm } from '../../hooks/react-hook-form/useRegister'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'

//shrani item v Props
interface Props {
    closePopup: MouseEventHandler<HTMLButtonElement>;
}

const ProfileSettings: FC<Props> = ({ closePopup }) => {
    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useRegisterForm()
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
        //if (!file) return

        const response = await API.register(data)
        console.log(response);

        //TODO vsi status code ki lahko tu dobis
        if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
            response.data?.statusCode === StatusCode.FORBIDDEN
        ) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        }
        else {
            authStore.login(response.data)
            navigate('/')
        }
    })

    //TODO: dobi vrednosti userja iz baze /me
    //in izpisi v formi

    return (
        <div className="text-black bg-white rounded-lg">
            {/* Greeting text */}
            <div className="mb-6">
                <p className="text-2xl font-bold mb-2">Profile settings</p>
            </div>
            <Form className="register-form m-2" onSubmit={onSubmit}>
                {/* TODO: UPORABI PRI EDIT PROFILE form group za avatar sliko */}
                {/* <Form.Group className="d-flex flex-column justify-content-center align-items-center">
                    <FormLabel htmlFor="avatar" id="avatar-p">
                        <Avatar round src={preview as string} alt="Avatar" />
                    </FormLabel>
                    <input
                        onChange={handleFileChange}
                        id="avatar"
                        name="avatar"
                        type="file"
                        aria-label="Avatar"
                        aria-describedby="avatar"
                        className="d-none"
                    />
                    {fileError && (
                        <div className="d-block invalid-feedback text-red-500 mb-2 text-center">
                            Field avatar is required
                        </div>
                    )}
                </Form.Group> */}
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
                {/* iz useRegister form */}
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
            </Form>
            <div className='flex flex-col items-start'>
                <Button className="text-black mb-4">
                    <span className="text-black">Change password</span>
                </Button>
                <Button className="text-black mb-4">
                    <span className="text-black">Change profile picture</span>
                </Button>
            </div>
            <div className='flex justify-end'>
                <Button onClick={closePopup}
                    className="mr-4 bg-gray-200 custom-button hover:bg-gray-300">
                    Cancel
                </Button>
                <Button className="mr-4 bg-customYellow custom-button hover:bg-customYellow-dark" type="submit">
                    Save changes
                </Button>
            </div>
        </div>
    )
}
export default ProfileSettings
