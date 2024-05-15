import { FC, MouseEventHandler, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Form, FormLabel } from 'react-bootstrap'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import authStore from '../../stores/auth.store'
import { Controller } from 'react-hook-form'
import { UpdateUserFields, useCreateUpdateUserForm } from '../../hooks/react-hook-form/useCreateUpdateUser'
import { StatusCode } from '../../constants/errorConstants'
import * as API from '../../api/Api'
import { UpdateUserType } from '../../models/auth'

//shrani item v Props
interface Props {
    user: {
        id: number | undefined;
        createdAt: string | undefined;
        updatedAt: string | undefined;
        firstName: string | undefined;
        lastName: string | undefined;
        email: string | undefined;
        image: string | undefined;
    }

    //zapri (ta) Profile popup
    closePopup: MouseEventHandler<HTMLButtonElement>
}

const ProfilePassword: FC<Props> = ({ user, closePopup }) => {
    const navigate = useNavigate()
    const { id, email } = user;
    const defaultValues: UpdateUserType = {
        id,
        email, //OBVEZEN email sicer sploh ne klice onSubmit??
    }
    const { handleSubmit, errors, control } = useCreateUpdateUserForm({ defaultValues })
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    //za toggle show password ko kliknes na eye icon (pass in confirm posebej gumb)
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
        const response = await API.updateUserPassword(data)
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
            setShowError(false)
            setShowSuccess(true)
            navigate('/')
        }
    })

    //TODO: dobi vrednosti userja iz baze /me
    //in izpisi v formi

    return (
        <div className="text-black bg-white rounded-lg w-[540px]">
            {/* Greeting text */}
            <div className="mb-6">
                <p className="text-2xl font-bold mb-2">Change password</p>
            </div>
            <Form className="m-2" onSubmit={onSubmit}>
                <Controller
                    control={control}
                    name="old_password"
                    render={({ field }) => (
                        <Form.Group className="mb-2 flex flex-col relative">
                            <FormLabel htmlFor="old_password">Current password</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <input
                                    {...field}
                                    type={showOldPassword ? 'text' : 'password'}
                                    placeholder="******"
                                    aria-label="Current password"
                                    aria-describedby="old_password"
                                    className={
                                        errors.password
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
                                {/* Toggle za password visibility*/}
                                <button
                                    type="button"
                                    className="absolute right-0 p-3 mr-2"
                                    onClick={() => setShowOldPassword(prev => !prev)}
                                >
                                    <svg className="bi bi-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                </button>
                                {errors.password && (
                                    <div className="invalid-feedback">
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <Form.Group className="mb-2 flex flex-col relative">
                            <FormLabel htmlFor="password">New password</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <input
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="******"
                                    aria-label="New password"
                                    aria-describedby="password"
                                    className={
                                        errors.password
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
                                {/* Toggle za password visibility*/}
                                <button
                                    type="button"
                                    className="absolute right-0 p-3 mr-2"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    <svg className="bi bi-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                </button>
                                {errors.password && (
                                    <div className="invalid-feedback">
                                        {errors.password.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />
                <Controller
                    control={control}
                    name="confirm_password"
                    render={({ field }) => (
                        <Form.Group className="mb-2 flex flex-col relative">
                            <FormLabel htmlFor="confirm_password">Repeat new password</FormLabel>
                            <div className='px-3 py-2 mb-1 w-full'>
                                <input
                                    {...field}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    aria-label="Repeat new password"
                                    aria-describedby="confirm_password"
                                    className={
                                        errors.confirm_password
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
                                {/* Toggle za password visibility*/}
                                <button
                                    type="button"
                                    className="absolute right-0 p-3 mr-2"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                >
                                    <svg className="bi bi-eye" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                    </svg>
                                </button>
                                {errors.password && (
                                    <div className="invalid-feedback">
                                        {errors.password.message}
                                    </div>
                                )}
                                {errors.confirm_password && (
                                    <div className="invalid-feedback">
                                        {errors.confirm_password.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />

                <div className='flex justify-end'>
                    <Button onClick={closePopup}
                        className="mr-4 bg-gray-200 custom-button hover:bg-gray-300">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="mr-4 bg-customYellow custom-button hover:bg-customYellow-dark" >
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
export default ProfilePassword
