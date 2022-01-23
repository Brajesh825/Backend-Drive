# USERS API

## Register User

        Req type: POST
        PATH: /user-service/register
        raw: {
            "name":"",
            "email":"",
            "password":""
        }

## Login User

        Req type: POST
        PATH: /user-service/login

## Logout User

        Req type: GET
        PATH: /user-service/logout

## Verify Email

        Req type: GET
        PATH: /user-service/verify-email/:token

## Resend Verify Email -- Login needed

        Req type: POST
        PATH: /user-service/resend-verify-email/

## Change Password -- Login needed

        Req type: PATCH
        PATH: /user-service/change-password
        raw: {
            "oldPassword":"",
            "newPassword":"",
            "confirmPassword":""
        }

## Get Current User -- Login needed

        Req type: GET
        PATH: /user-service/user

## Forget Password

        Req type: POST
        PATH: /user-service/forget-password
        raw:{
            "email":""
        }

## Reset Password

        Req type: GET
        PATH: /user-service/reset-password/:token
        raw: {
            "password":"",
            "confirmPassword":""
        }

# File API

## Upload File (Single File ,Login Required)

        Req type: POST
        PATH: /file-service/upload
        raw: file

## Download File (Login,Needed)

        Req type: GET
        PATH: /file-service/download/:id

## Rename File (Login Needed)

        Req type: PATCH
        PATH: /file-service/rename
        raw: {
                "id":"fileID",
                "title":"new name"
        }

## Remove File (Login Needed)

        Req type: DELETE
        PATH: /file-service/remove
        raw: {
                "id" : "fileID"
        }

## Get Single Thumbnail (Login Needed)

        Req type: GET
        PATH: /file-service/thumbnail/:id

## Make File Public (Login Needed)

        Req type: PATCH
        PATH: /file-service/make-public/:id

## Download Public File

        Req type: GET
        PATH: /file-service/public/download/:id/tempToken
