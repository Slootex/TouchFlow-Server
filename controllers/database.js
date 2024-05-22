import { createRequire } from "module";
import { EmailController } from "./email.js";

const require = createRequire(import.meta.url);
const express = require("express");
const mysql = require('mysql');
const crypto = require('crypto');

export class DatabaseController {

    constructor() {
        this.con = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "Tarokyun12&&",
            database: 'touchflow',
            authPlugin: 'caching_sha2_password'
        });

        this.con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    async newQuery(query, values) {
            
            return new Promise((resolve, reject) => {
                this.con.query(query, values, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
        }

    async registerUser(username, email, password, emailcode) {

        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        const userCheck = await this.checkUserRegistration(username, hashedPassword, email);
        if(userCheck[0] == false) {
            return userCheck;
        }

        const q = `SELECT * FROM users WHERE email=?`;
        const r = await this.newQuery(q, [email]);

        if(r.length > 0) {
            const newCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

            const updateQuery = `UPDATE users SET emailcode = ${newCode} WHERE email=?`;
            const result = await this.newQuery(updateQuery, [email]);

            const e = new EmailController();
            e.sendEmail(email, "EMailcode", newCode.toString(), "verify");

            return result;
        } else {
            const query = `INSERT INTO users (username, email, password, emailcode) VALUES (?, ?, ?, ?)`;
            const result = await this.newQuery(query, [username, email, hashedPassword, emailcode]);
            
            const e = new EmailController();
            e.sendEmail(email, "EMailcode", emailcode.toString(), "verify");

            return result;
        }


        
    }

    async checkUserRegistration(username, hashedPassword, email) {

      
        if(email.includes("@") == false) {
            return [false, "Email must contain @ symbol"]
        }
        if(email.includes(".") == false) {
            return [false, "Email must contain . symbol"]
        }
        if(email.length > 40) {
            return [false, "Email must be less than 40 characters"]
        }
        if (!isValidEmail(email)) {
            return [false, "Invalid email format"];
        }

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        if(username.length > 20) {
            return [false, "Username must be less than 20 characters"]
        }
        if(username.length < 4) {
            return [false, "Username must be more than 4 characters"]
        }

        if(hashedPassword.length > 64) {
            return [false, "Password must be less than 64 characters"]
        }

        const user = await this.newQuery(`SELECT * FROM users WHERE email=?`, [email]);
        if(user.length > 0) {
            return [false, "Email already exists"];
        }

        return [true, "User can be registered"];
       

       
    }

    async loginUser(email, password, remind, deviceid) {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');
        console.log(hashedPassword)
        const query = `SELECT * FROM users WHERE email=? AND password=?`;
        const result = await this.newQuery(query, [email, hashedPassword]);

        if (result.length < 1) {
            return false;
        }

        const login_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const updateQuery = `UPDATE users SET login = true, login_date = '${login_date}', remind = ${remind}, deviceid = '${deviceid}' WHERE email=? AND password=?`;
        await this.newQuery(updateQuery, [email, hashedPassword]);

        return result;
    }

    async checkLogin(deviceid) {
        const query = `SELECT * FROM users WHERE deviceid=?`;
        const result = await this.newQuery(query, [deviceid]);

        if(result.length < 1) {
            return false;
        }
        if(result[0].login == true) {
            return result;
        } else {    
            return false;
        }
    }

}