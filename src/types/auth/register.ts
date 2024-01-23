export type IAuthRegister =  {
    fullName: string,
    email: string,
    address: string,
    sex: string,
    phone: string,
    birthday: string,
    password: string,
    confirmPassword: string,
    [key: string]: string | undefined;
}
