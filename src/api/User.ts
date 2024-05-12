import { apiRoutes } from '../constants/apiConstants'
import { apiRequest } from './Api'
import { LoginUserFields } from '../hooks/react-hook-form/useLogin'
import { UserType } from '../models/auth'
import { RegisterUserFields } from '../hooks/react-hook-form/useRegister'
import {
  CreateUserFields,
  UpdateUserFields,
} from '../hooks/react-hook-form/useCreateUpdateUser'

export const fetchUser = async () => {
  //dobi access token (local storage)
  const accessToken = localStorage.getItem('access_token');
  //parsaj access token iz JSON (dobi samo vsebini)
  let parsedAccessToken;
  if (accessToken) {
    const parsedToken = JSON.parse(accessToken);
    if (parsedToken && parsedToken.access_token) {
      parsedAccessToken = parsedToken.access_token;
    }
  }

  //poslji /me request za dobitev userja z access_tokenom
  console.log(`Access Token: ${parsedAccessToken}`)
  const response = await apiRequest<undefined, UserType>('get', apiRoutes.FETCH_USER, undefined, { headers: { Authorization: `Bearer ${parsedAccessToken}` } })

  //poglej ce response vsebuje data
  if (response && response.data) {
    console.log('Response:', response.data);
    return response.data; //vrni data
  } else {
    console.error('No user data found in response');
    return null; // return null ce user data is ni available
  }
}

//paginatedUsers
export const fetchUsers = async (pageNumber: number) =>
  apiRequest<number, UserType[]>(
    'get',
    `${apiRoutes.FETCH_USERS}?page=${pageNumber}`,
  )

export const login = async (data: LoginUserFields) =>
  apiRequest<LoginUserFields, UserType>('post', apiRoutes.LOGIN, data)

export const register = async (data: RegisterUserFields) => {
  try {
    const response = await apiRequest<RegisterUserFields, void>('post', apiRoutes.SIGNUP, data);
    console.log('API Response:', response);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to be caught by the caller
  }
}

export const signout = async () =>
  apiRequest<undefined, void>('post', apiRoutes.SIGNOUT)

export const uploadAvatar = async (formData: FormData, id: string) =>
  apiRequest<FormData, void>(
    'post',
    `${apiRoutes.UPLOAD_AVATAR_IMAGE}/${id}`,
    formData,
  )

export const createUser = async (data: CreateUserFields) =>
  apiRequest<CreateUserFields, void>('post', apiRoutes.USERS_PREFIX, data)

export const updateUser = async (data: UpdateUserFields) =>
  apiRequest<UpdateUserFields, void>(
    'patch',
    `${apiRoutes.UPDATE_USER}`,
    data,
  )

export const updateUserPassword = async (data: UpdateUserFields) =>
  apiRequest<UpdateUserFields, void>(
    'patch',
    `${apiRoutes.UPDATE_USER_PASSWORD}`,
    data,
  )

export const updateUserImage = async (data: UpdateUserFields) =>
  apiRequest<UpdateUserFields, void>(
    'patch',
    `${apiRoutes.UPDATE_USER_IMAGE}`,
    data,
  )

// export const updateUser = async (data: UpdateUserFields, id: string) =>
//   apiRequest<UpdateUserFields, void>(
//     'patch',
//     `${apiRoutes.USERS_PREFIX}/${id}`,
//     data,
//   )

export const deleteUser = async (id: string) =>
  apiRequest<string, UserType>('delete', `${apiRoutes.USERS_PREFIX}/${id}`)
