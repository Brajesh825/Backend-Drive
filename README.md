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
        PATH: /user-service/resend-verify-email/:token

## Change Password -- Login needed

        Req type: Patch
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
