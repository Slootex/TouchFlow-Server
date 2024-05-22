import { createRequire } from "module";
import { DatabaseController } from "../controllers/database.js";

const require = createRequire(import.meta.url);
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser'); // Add the body-parser middleware


router.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
router.use(bodyParser.json()); // Parse JSON bodies


//=========================================================================================================
// [                         ]
// |         ROUTES          |                                                                            |
// [                         ]
//=========================================================================================================


// GET /home
// Render the home page
router.post('/register-user', async (req, res) => {

    const username  = req.body.username;
    const email     = req.body.em;
    const password  = req.body.pass;
    const emailCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    
    const database = new DatabaseController();
    const result = await database.registerUser(username, email, password, emailCode);

    if(result[0] == false) {
        res.status(400).json({ success: false, message: result[1] });
        return;
    }

    res.status(200).json({ success: true, message: "User registered successfully" });
});

router.post('/get-code', async (req, res) => {

    const email     = req.body.email;
    
    
    const database = new DatabaseController();
    const result = await database.newQuery(`SELECT emailcode FROM users WHERE email='${email}'`);
    if(result == false) {
        res.send("register-failed");
        return;
    }

    res.send(result[0].emailcode);
    return;
});

router.post('/check-code', async (req, res) => {

    const code     = req.body.code;

    
    const database = new DatabaseController();
    const result = await database.newQuery(`SELECT emailcode FROM users WHERE emailcode='${code}'`);
    if(result == false) {
        res.send("register-failed");
    }

    res.send("success");
});

router.post('/login-user', async (req, res) => {

    const email  = req.body.email;
    const password  = req.body.password;
    const remind  = req.body.remind;
    const deviceid = req.body.deviceid;

    const database = new DatabaseController();
    const result = await database.loginUser(email, password, remind, deviceid);
    
    if(result != false) {
        res.send(result);
    } else {
        res.status(404).send("not found");
    }
    return;
    if(result == false) {
        res.send("login-failed");
    } else {
        res.send(result[0]);
    }
});

router.post('/check-user', async (req, res) => {

    const deviceid = req.body.deviceid;
    console.log("123123123")
    const database = new DatabaseController();
    const result = await database.checkLogin(deviceid);
    
    if(result != false) {
        if(result[0].remind == false) {
            res.status(404).send("not found");
        } else {
            res.send(result);
        }
    } else {
        res.status(404).send("not found");
    }
    return;
    if(result == false) {
        res.send("login-failed");
    } else {
        res.send(result[0]);
    }
});



//=========================================================================================================
// [                         ]
// |        FUNCTIONS        |                                                                            |
// [                         ]
//=========================================================================================================



export default router;