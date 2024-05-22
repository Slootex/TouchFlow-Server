import { createRequire } from "module";
import { UserController } from "../controllers/user.js";

const require = createRequire(import.meta.url);
const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser'); // Add the body-parser middleware


router.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
router.use(bodyParser.json()); // Parse JSON bodies

router.post("/reset-password", async (req, res) => {
    const email = req.body.email;
    
    const user = new UserController();
    await user.forgotPassword(email);

    res.send("ok");
});

router.get("/reset-password", async (req, res) => {
    const code = req.query.code;
    
    res.render("reset-password", {code: code});
});

router.post("/save-new-password", async (req, res) => {
    const code = req.body.code;
    const password = req.body.password;
    
    const user = new UserController();
    await user.saveNewPassword(code, password);

    res.send("ok");
});

router.post("change-profilimg", async (req, res) => {
    const email = req.body.email;
    const img = req.body.img;

    const user = new UserController();
    await user.changeProfileImg(email, img);

    res.send("ok");
});

// GETS

router.get("/rooms-:userid", async (req, res) => {
    const user = new UserController();
    const rooms = await user.getRooms(req.params.userid);

    res.send(rooms);
});

export default router;