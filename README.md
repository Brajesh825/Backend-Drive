API ENDPOINT
https://backend-drive-m72by.ondigitalocean.app/

DOCUMENTATION
https://backend-drive-m72by.ondigitalocean.app/documentation/view

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
        raw: {
            parent : "String",
            personalFile : "Boolean",
            parentList : "String"
            file: "Should be the last element"
        }

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

## Create One Time Download Link(Login Needed)

        Req type: PATCH
        PATH: /file-service/make-one/:id

## Get File Info

        Req type: GET
        PATH: /file-service/info/:id

## Move File

        Req type: PATCH
        PATH: /file-service/move
        raw: {
                id : "File Id"
                parent : "Folder id where file is to be moved"
        }

# Folder API

## Create Folder (Login Required)

        Req type: POST
        PATH: /folder-service/upload
        raw: {
                name: "New Folder",
                parent: "/ for root" or "id of parent folder",
                parentList: "",
        }

## Delete Folder (Login,Needed)

        Req type: DELETE
        PATH: /folder-service/remove/
        raw: {
                id: "Folder Id",
                parentList: [],
        }

## Get Folder Info (Login Needed)

        Req type: GET
        PATH: /folder-service/info/:id

## Delete All Files And Folder (Login Needed)

        Req type: DELETE
        PATH: /folder-service/remove-all

## Rename Folder (Login Needed)

        Req Type: PATCH
        PATH: /folder-service/rename
        raw: {
                id: "Folder Id",
                title: "New Name Of Folder"
        }

## Get SubFolderList (Login Needed , The result will be further used for Deletion of File and Folder )

        Req Type: GET
        PATH: /folder-service/subfolder-list
        QUERY: {
                id: "Folder Id",
        }

## Move Folder (Login Needed )

        Req Type: PATCH
        PATH: /folder-service/move
        raw: {
                id: "Folder Id",
                parent : "Parent ID"
        }
