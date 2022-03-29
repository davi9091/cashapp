import {MongoError} from "mongodb";
import {v4 as uuidv4} from "uuid";
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

export function dbErrorHandler(error: MongoError, message: string) {
    return ({error: {message: message, dbError: MongoError}});
}

export function generateCookie(username: string) {
    const cookieKey = uuidv4();
    return {
        name: `user-${username}`,
        key: cookieKey,
        params: {maxAge: 900000, httpOnly: true}
    };
}

