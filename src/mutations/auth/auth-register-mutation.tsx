import { useMutation } from "react-query"
import { axiosConfig } from "~/lib"
import { IAuthRegister } from "~/types"
const handleRegister = async (data: IAuthRegister) => {
    return  await axiosConfig.post('/auth/register', data)
    
    
}
export const useAuthRegisterMutation = () => {
    return useMutation(handleRegister)
}