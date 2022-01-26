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
    raw: "file",
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
];

const documentation = { UsersApi, FileApi };

module.exports = documentation;
