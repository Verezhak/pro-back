

// import createHttpError from 'http-errors';

// import { SessionsCollection } from '../db/models/session.js';
// import { UsersCollection } from '../db/models/user.js';

// export const authenticate = async (req, res, next) => {
//     const authHeader = req.get('Authorization');

//     if (!authHeader) {
//         next(createHttpError(401, 'Please provide Authorization header'));
//         return;
//     }

//     const [bearer, token] = authHeader.split(' ');

//     // const bearer = authHeader.split(' ')[0];
//     // const token = authHeader.split(' ')[1];

//     if (bearer !== 'Bearer' || !token) {
//         next(createHttpError(401, 'Auth header should be of type Bearer'));
//         return;
//     }

//     const session = await SessionsCollection.findOne({ accessToken: token });

//     if (!session) {
//         next(createHttpError(401, 'Session not found'));
//         return;
//     }

//     const isAccessTokenExpired =
//         new Date() > new Date(session.accessTokenValidUntil);

//     if (isAccessTokenExpired) {
//         return next(createHttpError(401, 'Access token expired'));
//     }

//     const user = await UsersCollection.findById(session.userId);

//     if (!user) {
//         next(createHttpError(401));
//         return;
//     }

//     req.user = user;

//     next();
// };

import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return next(createHttpError(401, 'Please provide Authorization header'));
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
        return next(createHttpError(401, 'Auth header should be of type Bearer'));
    }

    const session = await SessionsCollection.findOne({ accessToken: token });

    if (!session) {
        return next(createHttpError(401, 'Session not found'));
    }

    const isAccessTokenExpired = new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
        return next(createHttpError(401, 'Access token expired'));
    }

    const user = await UsersCollection.findById(session.userId);

    if (!user) {
        return next(createHttpError(401, 'User not found'));
    }

    // Прив'язка користувача до req для подальшого використання
    req.user = user;

    next();

};
