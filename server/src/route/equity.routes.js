import express from "express";
const router = express.Router();
import { readFileSync } from "fs";
const db = JSON.parse(readFileSync(new URL("../json/db.json", import.meta.url)));
router.get('/', (req, res) => {
    res.json(db);
});

export default router;