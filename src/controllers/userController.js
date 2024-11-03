
import createHttpError from 'http-errors';


import { env } from "../utils/env.js";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { updateTheme, updateUser } from '../services/user.js';

export const getCurrentUserController = async (req, res) => {
    if (req.user) {
        res.json({
            status: 200,
            message: "Current user data retrieved successfully",
            data: req.user,
        });
    } else {
        res.status(401).json({
            status: 401,
            message: "Unauthorized",
        });
    }
};


export const updateThemeController = async (req, res, next) => {
    const { theme } = req.body;
    const userId = req.user._id;

    const updatedUser = await updateTheme(userId, theme);

    res.status(200).json({
        status: 200,
        message: 'Theme updated successfully!',
        data: updatedUser,
    });


};

export const updateUserController = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw createHttpError(401, 'User is not authenticated');
    }
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }


    };

    const updateData = {
        ...req.body,
    };

    if (photoUrl) {
        updateData.avatar = photoUrl;
    }

    const updatedUser = await updateUser(userId, updateData);
    if (!updatedUser) {
        throw createHttpError(404, 'User not found');
    }
    res.json({
        status: 200,
        message: 'User updated successfully',
        data: updatedUser,
    });
};




// const setupSession = (res, session) => {
//     res.cookie('refreshToken', session.refreshToken, {
//         httpOnly: true,
//         expires: new Date(Date.now() + ONE_DAY),
//     });
//     res.cookie('sessionId', session._id, {
//         httpOnly: true,
//         expires: new Date(Date.now() + ONE_DAY),
//     });
// };

// export const refreshUserSessionController = async (req, res) => {
//     const session = await refreshUsersSession({
//         sessionId: req.cookies.sessionId,
//         refreshToken: req.cookies.refreshToken,
//     });

//     setupSession(res, session);

//     res.json({
//         status: 200,
//         message: 'Successfully refreshed a session!',
//         data: {
//             accessToken: session.accessToken,
//         },
//     });
// };

// export const requestResetEmailController = async (req, res) => {
//     await requestResetToken(req.body.email);
//     res.json({
//         status: 200,
//         message: "Reset password email has been successfully sent.",
//         data: {}
//     });
// };

// export const resetPasswordController = async (req, res) => {
//     await resetPassword(req.body);
//     res.json({
//         status: 200,
//         message: "Password has been successfully reset.",
//         data: {}
//     });
// };

// export const getGoogleOAuthUrlController = async (req, res) => {
//     const url = generateAuthUrl();
//     res.json({
//         status: 200,
//         message: 'Successfully get Google OAuth url!',
//         data: {
//             url,
//         },
//     });
// };

// export const loginWithGoogleController = async (req, res) => {
//     const session = await loginOrSignupWithGoogle(req.body.code);
//     setupSession(res, session);

//     res.json({
//         status: 200,
//         message: 'Successfully logged in via Google OAuth!',
//         data: {
//             accessToken: session.accessToken,
//         },
//     });
// };