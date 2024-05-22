import { createRequire } from "module";
import { EmailController } from "./email.js";
import { DatabaseController } from "./database.js";

const require = createRequire(import.meta.url);
const express = require("express");
const mysql = require('mysql');
const crypto = require('crypto');

export class UserController {

    async forgotPassword(email) {
        const database = new DatabaseController();
        const result = await database.newQuery(`SELECT email FROM users WHERE email='${email}'`);
        if(result == false) {
            return false;
        }
        const newCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        const updateCode = await database.newQuery(`UPDATE users SET password_reset_code='${newCode}' WHERE email='${email}'`);

        const e = new EmailController();
        e.sendEmail(email, "Passwort zurücksetzen", newCode.toString(), "password-reset");
    }

    async saveNewPassword(code, password) {
        const database = new DatabaseController();
        const result = await database.newQuery(`SELECT email FROM users WHERE password_reset_code='${code}'`);
        if(result == false) {
            return false;
        }

        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        const updatePassword = await database.newQuery(`UPDATE users SET password='${hashedPassword}' WHERE password_reset_code='${code}'`);
    }

    async changeProfileImg(email, img) {
        const database = new DatabaseController();
        const result = await database.newQuery(`SELECT email FROM users WHERE email='${email}'`);
        if(result == false) {
            return false;
        }

        const updateImg = await database.newQuery(`UPDATE users SET profilimg='${img}' WHERE email='${email}'`);
    }

    async getRooms(userid) {
        const database = new DatabaseController();
        const rooms = await database.newQuery(`SELECT * FROM user_rooms WHERE userid='${userid}'`);

        return rooms;
    }

}