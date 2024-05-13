import { ChangeEvent, FC, useEffect, useState } from 'react'
import { observer } from 'mobx-react'

import {
    RegisterUserFields,
    useRegisterForm,
} from '../../hooks/react-hook-form/useRegister'
import { useNavigate, Link } from 'react-router-dom'
import ToastContainer from 'react-bootstrap/ToastContainer'
import Toast from 'react-bootstrap/Toast'
import { Form } from 'react-bootstrap'
import { Controller } from 'react-hook-form'
import FormLabel from 'react-bootstrap/FormLabel'
import { routes } from '../../constants/routesConstants'
import Button from 'react-bootstrap/Button'
import * as API from '../../api/Api'
import { StatusCode } from '../../constants/errorConstants'
import authStore from '../../stores/auth.store'

const RegisterForm: FC = () => {
    //za toggle show password ko kliknes na eye icon (pass in confirm posebej gumb)
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    return (
        // centriraj vse elemente verticalno
        <div className="flex flex-col justify-center h-full">
            {/* Greeting text */}
            <div className="flex flex-col items-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Hello!</h2>
                <p className="text-gray-600">Please enter your details</p>
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
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <Form.Group className="mb-2 flex flex-col relative">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <div className='px-2 py-1 mb-1 w-full'>
                                <input
                                    {...field}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="******"
                                    aria-label="Password"
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
                            <FormLabel htmlFor="confirm_password">Repeat password</FormLabel>
                            <div className='px-3 py-2 mb-1 w-full'>
                                <input
                                    {...field}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    aria-label="Confirm password"
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
                <Button className="bg-customYellow custom-button w-full hover:bg-customYellow-dark" type="submit">
                    Sign up
                </Button>
            </Form >
            {showError && (
                <ToastContainer className="p-2" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-red-500">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-red-500 bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )
            }
        </div>
    )
}
export default observer(RegisterForm)
