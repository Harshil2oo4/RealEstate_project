// import express from "express";
// import { createResidency, getAllResidencies, getResidency } from "../controllers/resdCntrl.js";
// import jwtCheck from "../config/auth0Config.js";

// const router = express.Router();

// // Route to create a residency
// router.post("/create",jwtCheck, createResidency);
// router.get("/allresd", getAllResidencies);
// router.get("/:id",getResidency);

// export { router as residencyRoute };


import express from "express";
import { createResidency, getAllResidencies, getResidency, deleteResidency, updateResidency } from "../controllers/resdCntrl.js";
import jwtCheck from "../config/auth0Config.js";

const router = express.Router();

// Route to create a residency
router.post("/create", jwtCheck, createResidency);
router.get("/allresd", getAllResidencies);
router.get("/:id", getResidency);
router.delete("/:id", jwtCheck, deleteResidency);
router.put("/:id", jwtCheck, updateResidency);

export { router as residencyRoute };
