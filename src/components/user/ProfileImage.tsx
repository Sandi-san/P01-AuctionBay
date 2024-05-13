import { ChangeEvent, FC, MouseEventHandler, useEffect, useRef, useState } from 'react'
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
import Avatar from 'react-avatar'

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

const ProfileImage: FC<Props> = ({ user, closePopup }) => {
    const navigate = useNavigate()
    const { id, email, image } = user;
    const defaultValues: UpdateUserType = {
        id,
        email, //OBVEZEN email sicer sploh ne klice onSubmit??
        image,
    }
    const { handleSubmit, errors, control } = useCreateUpdateUserForm({ defaultValues })
    const [apiError, setApiError] = useState('')
    const [showError, setShowError] = useState(false)

    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [fileError, setFileError] = useState(false)


    // da lahko uporabljas Custom Button za defaultni Choose file
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    // const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
    //         if (!file) {
    //             handleFileError()
    //             return
    //         }
    //         console.log('SUBMIT WORKS')
    // const response = await API.updateUser(data, defaultValues?.id as string)
    // if (response.data?.statusCode === StatusCode.BAD_REQUEST) {
    //     setApiError(response.data.message)
    //     setShowError(true)
    // } else if (response.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR) {
    //     setApiError(response.data.message)
    //     setShowError(true)
    // } else {
    //     if (!file) {
    //         //dobi updated user
    //         if (defaultValues?.isActiveUser) {
    //             authStore.login(response.data)
    //         }
    //         navigate(`${routes.DASHBOARD_PREFIX}/users`)
    //         return
    //     }
    //     //Update file
    //     const formData = new FormData()
    //     //'avatar' isto kot v backend (modules/controller - FileInterceptor('avatar')
    //     formData.append('avatar', file, file.name)
    //     const fileResponse = await API.uploadAvatar(formData, response.data.id)

    //     if (fileResponse.data?.statusCode === StatusCode.BAD_REQUEST) {
    //         setApiError(fileResponse.data.message)
    //         setShowError(true)
    //     } else if (
    //         fileResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
    //     ) {
    //         setApiError(fileResponse.data.message)
    //         setShowError(true)
    //     } else {
    //         if (defaultValues?.isActiveUser) {
    //             //Dobi userja z avatar sliko
    //             const userResponse = await API.fetchUser()
    //             if (
    //                 userResponse.data?.statusCode === StatusCode.INTERNAL_SERVER_ERROR
    //             ) {
    //                 setApiError(userResponse.data.message)
    //                 setShowError(true)
    //             } else {
    //                 authStore.login(userResponse.data)
    //             }
    //         }
    //         navigate(`/`)
    //     }
    // }
    // })

    const onSubmit = handleSubmit(async (data: UpdateUserFields) => {
        if (!file) {
            handleFileError()
            return
        }
        console.log(`File: ${file.name}`);
        const response = await API.updateUserImage(data)
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
            navigate('/')
        }
    })

    //pozeni vsakic ko se 'file' spremeni (za spremembo Avatar img)
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


    const handleFileError = () => {
        // requred file ne obstaja
        if (!file) setFileError(true)
        else setFileError(false)
    }

    //slika se je spremenila, spremeni file var
    const handleFileChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.files) {
            const profileFile = target.files[0]
            setFile(profileFile)
        }
    }

    return (
        <div className="text-black bg-white rounded-lg w-[540px]">
            {/* Greeting text */}
            <div className="mb-6">
                <p className="text-2xl font-bold mb-2">Change password</p>
            </div>
            <Form className="m-2" onSubmit={onSubmit}>
                {/* Choose file funkcionalnost dodaj custom buttonu */}
                <div className="p-4 flex items-center justify-center">
                    <label htmlFor="avatar" className="cursor-pointer">
                        <Avatar round
                            src={
                                preview
                                    ? preview
                                    : defaultValues &&
                                    `images/unknown_user.png`
                            }
                            alt="Avatar" />
                    </label>
                </div>
                {/* Custom Choose file button  */}
                <div className="m-4 flex items-center justify-center">
                    <button className="text-gray-900 border border-black bg-white custom-button"
                        onClick={handleButtonClick}>
                        Upload new picture
                    </button>
                </div>
                {fileError && (
                    <div className="invalid-feedback">
                        Image is required
                    </div>
                )}

                {/* Skrij default Choose File button ampak ohrani delovanje */}
                <input
                    //referenca na ta input da lahko klices z Custom Button
                    ref={fileInputRef}
                    //klici da se spremeni avatar ko spremenis file
                    onChange={handleFileChange}
                    id="avatar"
                    name="avatar"
                    type="file"
                    aria-label="Avatar"
                    aria-describedby="avatar"
                    className="hidden"
                />

                <div className='flex justify-end'>
                    <Button onClick={closePopup}
                        className="mr-4 bg-gray-200 custom-button hover:bg-gray-300">
                        Cancel
                    </Button>
                    <Button className="mr-4 bg-customYellow custom-button hover:bg-customYellow-dark" type="submit">
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
        </div>
    )
}
export default ProfileImage
