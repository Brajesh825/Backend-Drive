const UsersApi = [
  {
    "Request Name": "Register User",
    "Request Type": "POST",
    Path: "/user-service/register",
    raw: {
      name: "userName",
      email: "userEmail",
      password: "userPassword",
    },
    Login_required: false,
  },
  {
    "Request Name": "Login User",
    "Request Type": "POST",
    Path: "/user-service/login",
    Login_required: false,
  },
  {
    "Request Name": "Logout User",
    "Request Type": "GET",
    Path: "/user-service/logout",
    Login_required: false,
  },
  {
    "Request Name": "Verify Email",
    "Request Type": "GET",
    Path: "/user-service/verify-email/:token",
    Login_required: false,
  },
  {
    "Request Name": "Resend Verify Email",
    "Request Type": "POST",
    Path: "/user-service/resend-verify-email",
    Login_required: true,
  },
  {
    "Request Name": "Change Password",
    "Request Type": "PATCH",
    Path: "/user-service/change-password",
    raw: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    Login_required: true,
  },
  {
    "Request Name": "Get Current User",
    "Request Type": "GET",
    Path: "/user-service/user",
    Login_required: true,
  },
  {
    "Request Name": "Forget Password",
    "Request Type": "POST",
    Path: "/user-service/forget-password",
    raw: {
      email: "",
    },
    Login_required: false,
  },
  {
    "Request Name": "Reset Password",
    "Request Type": "Get",
    Path: "/user-service/reset-password/:token",
    raw: {
      password: "",
      confirmPassword: "",
    },
    Login_required: false,
  },
];

const FileApi = [
  {
    "Request Name": "Upload File",
    "Request Type": "POST",
    Path: "/file-service/upload",
    raw: {
      parent: "String",
      personalFile: "Boolean",
      parentList: "String",
      file: "Should be the last element",
    },
    Login_required: true,
  },
  {
    "Request Name": "Download File",
    "Request Type": "GET",
    Path: "/file-service/download/:id",
    Login_required: true,
  },
  {
    "Request Name": "Rename File",
    "Request Type": "PATCH",
    Path: "/file-service/rename",
    raw: {
      id: "fileID",
      title: "new name with extension",
    },
    Login_required: true,
  },
  {
    "Request Name": "Remove File",
    "Request Type": "DELETE",
    Path: "/file-service/remove",
    raw: {
      id: "fileID",
    },
    Login_required: true,
  },
  {
    "Request Name": "Get Single Thumbnail",
    "Request Type": "GET",
    Path: "/file-service/thumbnail/:id",
    Login_required: true,
  },
  {
    "Request Name": "Make File Public",
    "Request Type": "PATCH",
    Path: "/file-service/make-public/:id",
    Login_required: true,
  },
  {
    "Request Name": "Download Public File",
    "Request Type": "GET",
    Path: "/file-service/public/download/:id/tempToken",
    Login_required: false,
  },
  {
    "Request Name": "Create One Time Download Link",
    "Request Type": "PATCH",
    Path: "/file-service/make-one/:id",
    Login_required: true,
  },
  {
    "Request Name": "Get File Info",
    "Request Type": "GET",
    Path: "/file-service/info/:id",
    Login_required: true,
  },
  {
    "Request Name": "Move File",
    "Request Type": "PATCH",
    Path: "/file-service/move",
    raw: {
      id: "File Id",
      parent: "Folder id where file is to be moved",
    },
    Login_required: true,
  },
  {
    "Request Name": "Share Download Link",
    "Request Type": "POST",
    Path: "/file-service/send-share-email",
    raw: {
      id: "File Id",
      receiver: "Email Of Receiver",
    },
    Login_required: true,
  },
];

const FolderApi = [
  {
    "Request Name": "Create Folder",
    "Request Type": "POST",
    Path: "/folder-service/upload",
    raw: {
      name: "New Folder",
      parent: "",
      parentList: "",
    },
    Login_required: true,
  },
  {
    "Request Name": "Delete Folder",
    "Request Type": "DELETE",
    Path: "/folder-service/remove",
    raw: {
      id: "FolderID",
      parentList: [],
    },
    Login_required: true,
  },
  {
    "Request Name": "Get Folder Info",
    "Request Type": "GET",
    Path: "/folder-service/info/:id",
    Login_required: true,
  },
  {
    "Request Name": "Delete All Files And Folder",
    "Request Type": "DELETE",
    Path: "/folder-service/remove-all",
    Login_required: true,
  },
  {
    "Request Name": "Rename Folder",
    "Request Type": "PATCH",
    Path: "/folder-service/rename",
    raw: {
      id: "Folder ID",
      title: "New Name Of Folder",
    },
    Login_required: true,
  },
  {
    "Request Name": "Get Sub Folder List",
    "Request Type": "GET",
    Path: "/folder-service/subfolder-list",
    QUERY: {
      id: "Folder ID",
    },
    Login_required: true,
  },
  {
    "Request Name": "Move Folder",
    "Request Type": "PATCH",
    Path: "/folder-service/move",
    raw: {
      id: "Folder ID",
      parent: "Parent ID",
    },
    Login_required: true,
  },
];

const documentation = { UsersApi, FileApi, FolderApi };

module.exports = documentation;
