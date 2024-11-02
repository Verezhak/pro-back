import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { TWO_HOURS } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';


export const registerUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (user) throw createHttpError(409, 'Email in use');

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    return await UsersCollection.create({
        ...payload,
        password: encryptedPassword,
    });
};

export const loginUser = async (payload) => {
    const user = await UsersCollection.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);

    if (!isEqual) {
        throw createHttpError(401, 'Unauthorized');
    }

    await SessionsCollection.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');


    return await SessionsCollection.create({
        userId: user._id,
        accessToken,
        accessTokenValidUntil: new Date(Date.now() + TWO_HOURS),
    });
};

export const logoutUser = async (sessionId) => {
    await SessionsCollection.deleteOne({ _id: sessionId });
};



export const updateUser = async (userId, payload, options = {}) => {
    const rawResult = await UsersCollection.findOneAndUpdate(
        { _id: userId },
        payload,
        {
            new: true,
            ...options,
        },
    );

    if (!rawResult) return null;

    return {
        user: rawResult,
    };
};

export const updateTheme = async (userId, theme) => {
    if (!['light', 'dark', 'violet'].includes(theme)) {
        throw createHttpError(400, 'Invalid theme');
    }

    const updatedUser = await UsersCollection.findByIdAndUpdate(
        userId,
        { theme },
        { new: true }
    );

    if (!updatedUser) {
        throw createHttpError(404, 'User not found');
    }

    return updatedUser;
};
// const createSession = () => {
//     const accessToken = randomBytes(30).toString('base64');
//     const refreshToken = randomBytes(30).toString('base64');

//     return {
//         accessToken,
//         refreshToken,
//         accessTokenValidUntil: new Date(Date.now() + TWO_HOURS),
//         refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
//     };
// };

// export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
//     const session = await SessionsCollection.findOne({
//         _id: sessionId,
//         refreshToken,
//     });

//     if (!session) {
//         throw createHttpError(401, 'Session not found');
//     }

//     const isSessionTokenExpired =
//         new Date() > new Date(session.refreshTokenValidUntil);

//     if (isSessionTokenExpired) {
//         throw createHttpError(401, 'Session token expired');
//     }

//     const newSession = createSession();

//     await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

//     return await SessionsCollection.create({
//         userId: session.userId,
//         ...newSession,
//     });
// };

// export const requestResetToken = async (email) => {
//     try {
//         const user = await UsersCollection.findOne({ email });
//         if (!user) {
//             throw createHttpError(404, 'User not found');
//         }
//         const resetToken = jwt.sign(
//             {
//                 sub: user._id,
//                 email,
//             },
//             env('JWT_SECRET'),
//             {
//                 expiresIn: '15m',
//             },
//         );


//         const resetPasswordTemplatePath = path.join(TEMPLATES_DIR, 'send-reset-email.html');

//         console.log(resetPasswordTemplatePath);
//         const templateSource = (await fs.readFile(resetPasswordTemplatePath)).toString();

//         const template = handlebars.compile(templateSource);
//         const html = template({
//             name: user.name,
//             link: `${env('APP_DOMAIN')}/auth/reset-password?token=${resetToken}`,
//         });

//         await sendEmail({
//             from: env(SMTP.SMTP_FROM),
//             to: email,
//             subject: 'Reset your password',
//             html,
//         });
//     } catch (error) {
//         if (error.response) {
//             throw createHttpError(500, 'Failed to send the email, please try again later.');
//         } else {
//             throw createHttpError(500, 'Something went wrong');
//         }
//     }


// };

// export const resetPassword = async (payload) => {
//     let entries;

//     try {
//         entries = jwt.verify(payload.token, env('JWT_SECRET'));
//     } catch (err) {
//         if (err instanceof Error) throw createHttpError(401, 'Token is expired or invalid.');
//         throw err;
//     }

//     const user = await UsersCollection.findOne({
//         email: entries.email,
//         _id: entries.sub,
//     });

//     if (!user) {
//         throw createHttpError(404, 'User not found');
//     }

//     const encryptedPassword = await bcrypt.hash(payload.password, 10);

//     await UsersCollection.updateOne(
//         { _id: user._id },
//         { password: encryptedPassword },
//     );
// };

// export const loginOrSignupWithGoogle = async (code) => {
//     const loginTicket = await validateCode(code);
//     const payload = loginTicket.getPayload();
//     if (!payload) throw createHttpError(401);

//     let user = await UsersCollection.findOne({ email: payload.email });
//     if (!user) {
//         const password = await bcrypt.hash(randomBytes(10), 10);
//         user = await UsersCollection.create({
//             email: payload.email,
//             name: getFullNameFromGoogleTokenPayload(payload),
//             password,
//         });
//     }

//     const newSession = createSession();

//     return await SessionsCollection.create({
//         userId: user._id,
//         ...newSession,
//     });
// };