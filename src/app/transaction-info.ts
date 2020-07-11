export interface TransactionInfo {
    billing: {
        f_name: string,
        l_name: string,
        address: string,
        addressLine2: string,
        city: string,
        state: string,
        zip: string,
        country: string
    }
    username: string,
    cardNum: string,
    expDate: string,
    ccv: string,
    message: string
}