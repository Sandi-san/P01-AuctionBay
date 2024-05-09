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
import Avatar from 'react-avatar'

const RegisterForm: FC = () => {

    const navigate = useNavigate()
    const { handleSubmit, errors, control } = useRegisterForm()
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileError, setFileError] = useState(false)

    const onSubmit = handleSubmit(async (data: RegisterUserFields) => {
        if (!file) return

        const response = await API.register(data)
        if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
            setApiError(response.data.message)
            setShowError(true)
        } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
            setApiError(response.data.message)
            setShowError(true)
        } else {
            //Logini userja predenj shranis avatar sliko
            const loginResponse = await API.login({
                email: data.email,
                password: data.password,
            })

            if (loginResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                setApiError(loginResponse.data.message)
                setShowError(true)
            } else if (
                loginResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
            ) {
                setApiError(loginResponse.data.message)
                setShowError(true)
            } else {
                //Upload file
                const formData = new FormData()
                //'image' isto kot v backend (modules/controller - FileInterceptor('image')
                formData.append('image', file, file.name)
                const fileResponse = await API.uploadAvatar(
                    formData,
                    loginResponse.data.id,
                )

                if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
                    setApiError(fileResponse.data.message)
                    setShowError(true)
                } else if (
                    fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
                ) {
                    setApiError(fileResponse.data.message)
                    setShowError(true)
                } else {
                    //Dobi userja z avatar sliko
                    const userResponse = await API.fetchUser()
                    if (
                        userResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
                    ) {
                        setApiError(userResponse.data.message)
                        setShowError(true)
                    } else {
                        authStore.login(userResponse.data)
                        navigate('/')
                    }
                }
            }
        }
    })

    const handleFileError = () => {
        // requred file ne obstaja
        if (!file) setFileError(true)
        else setFileError(false)
    }

    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const profileFile = target.files[0]
            setFile(profileFile)
        }
    }

    //pozeni vsakic ko se 'file' spremeni
    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
                setFileError(false)
            }
            reader.readAsDataURL(file)
        } else {
            setPreview(null)
        }
    }, [file])

    return (
        <>
            {/* Greeting text */}
            <div className="flex flex-col items-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Hello!</h2>
                <p className="text-gray-600">Please enter your details</p>
            </div>
            <Form className="register-form p-2" onSubmit={onSubmit}>
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
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <Form.Group className="flex flex-col">
                                    <FormLabel htmlFor="firstName">First name</FormLabel>
                                    <div className='px-3 py-2 mb-1 w-full'>
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
                    <div className="w-full md:w-1/2 px-3">
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                                <Form.Group className="flex flex-col">
                                    <FormLabel htmlFor="lastName">Last name</FormLabel>
                                    <div className='px-3 py-2 mb-1 w-full'>
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
                        <Form.Group className="mb-3 flex flex-col">
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <div className='px-3 py-2 mb-1 w-full'>
                                <input
                                    {...field}
                                    type="email"
                                    placeholder="example@gmail.com"
                                    aria-label="Email"
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
                {/* iz useLogin form */}
                <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <Form.Group className="mb-3 flex flex-col">
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <div className='px-3 py-2 mb-1 w-full'>
                                <input
                                    {...field}
                                    type="password"
                                    placeholder="******"
                                    aria-label="Password"
                                    aria-describedby="password"
                                    className={
                                        errors.password
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
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
                    name="confirmPassword"
                    render={({ field }) => (
                        <Form.Group className="mb-3 flex flex-col">
                            <FormLabel htmlFor="confirmPassword">Repeat password</FormLabel>
                            <div className='px-3 py-2 mb-1 w-full'>
                                <input
                                    {...field}
                                    type="password"
                                    aria-label="Confirm password"
                                    aria-describedby="confirmPassword"
                                    className={
                                        errors.confirmPassword
                                            ? 'form-control is-invalid'
                                            : 'form-control'
                                    }
                                />
                                {errors.confirmPassword && (
                                    <div className="invalid-feedback">
                                        {errors.confirmPassword.message}
                                    </div>
                                )}
                            </div>
                        </Form.Group>
                    )}
                />
                <Button className="bg-customYellow py-2 px-4 rounded-xl w-full" type="submit" onMouseUp={handleFileError}>
                    Sign up
                </Button>
            </Form >
            {showError && (
                <ToastContainer className="p-3" position="top-end">
                    <Toast onClose={() => setShowError(false)} show={showError}>
                        <Toast.Header>
                            <strong className="me-auto text-red-500">Error</strong>
                        </Toast.Header>
                        <Toast.Body className="text-red-500 bg-light">{apiError}</Toast.Body>
                    </Toast>
                </ToastContainer>
            )
            }
        </>
    )
}
export default observer(RegisterForm)
