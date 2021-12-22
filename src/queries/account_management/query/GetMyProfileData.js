import gql from 'graphql-tag'
 
export const GetMyProfileData = gql`
query GetMyProfileData {
  me {
    id,
    pk,
    firstName,
    lastName,
    fullName,
    certificateName
    certificateNameConfirm
    email,
    gender,
    phoneNumber,
    phoneNumber2,
    phoneNumber3
    isAttachmentTransactionManager
    isPyramidAdmin
    isPyramidMarketer
    userCurrency
  }
}
`
 