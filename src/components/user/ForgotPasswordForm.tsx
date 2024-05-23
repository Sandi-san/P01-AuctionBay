import { ChangeEvent, FC, useEffect, useState } from 'react'
import { observer } from 'mobx-react'

import {
  LoginUserFields,
  useLoginForm,
} from '../../hooks/react-hook-form/useLogin'
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

const ForgotPasswordForm: FC = () => {
  const navigate = useNavigate()
  const { handleSubmit, errors, control } = useLoginForm()
  const [apiError, setApiError] = useState('')
  const [showError, setShowError] = useState(false)

  const onSubmit = handleSubmit(async (data: LoginUserFields) => {
    //RESET PASSWORD PO EMAILU NI IMPLEMENTIRANA V TEM PROJEKTU (MOCKUP)
    const response = await API.login(data)
    if (response.data?.statusCode === StatusCode.BAD_REQUEST ||
      response.data?.statusCode === StatusCode.NOT_FOUND ||
      response.data?.statusCode === StatusCode.UNAUTHORIZED
    ) {
      setApiError(response.data.message)
      setShowError(true)
    } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
      setApiError(response.data.message)
      setShowError(true)
    } else {
      authStore.login(response.data)
      navigate(routes.HOME)
    }
  })

  return (
    // centriraj vse elemente verticalno
    <div className="flex flex-col justify-center h-full">
      {/* Greeting text */}
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Forgot password!</h2>
        <p className="text-gray-600">No worries, we will send you reset instructions</p>
      </div>
      <Form className="login-form m-2" onSubmit={onSubmit}>
        {/* iz useLogin form */}
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
        <Button className="bg-customYellow custom-button w-full hover:bg-customYellow-dark" type="submit">
          Reset Password
        </Button>
      </Form>
      {/* Back to login */}
      <div className="text-center mt-4">
        <Link to="/login" className="text-gray-500 text-xs cursor-pointer flex items-center justify-center">
          {/* SVG icon */}
          <svg className="w-3 h-3 mr-2 bi bi-chevron-left" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
          </svg>
          {/* Text */}
          Back to login
        </Link>
      </div>
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
    </div>
  )
}
//za change state
export default observer(ForgotPasswordForm)
