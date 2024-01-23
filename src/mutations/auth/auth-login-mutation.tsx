import { useMutation } from "react-query"
import {IAuthLogin} from "../../types/index"
import { axiosConfig } from "~/lib"
const handleLogin = async (data: IAuthLogin) => {
    return  await axiosConfig.post('/auth/login', data)
    
    
}
export const useAuthLoginMutation = () => {
    return useMutation(handleLogin)
}