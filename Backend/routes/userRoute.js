import jwtCheck from "../config/auth0Config.js";
import express from "express";
import {
  createUser,
  bookVisit,
  allBookings,
  cancelBooking,
  toFav,
  getAllFav,
  isAdmin,
  updateUser,
  getAllUsers,
  updateAdminStatus
} from "../controllers/userCntrl.js";

const router = express.Router();

router.post("/register", jwtCheck, createUser);
router.post("/bookVisit/:id", jwtCheck, bookVisit);
router.post("/allBookings", jwtCheck, allBookings);
router.post("/removeBooking/:id", jwtCheck, cancelBooking);
router.post("/toFav/:rid", jwtCheck, toFav);
router.post("/allFav/", jwtCheck, getAllFav);
router.post("/isAdmin", jwtCheck, isAdmin);
router.put("/update", jwtCheck, updateUser);
router.get("/all", jwtCheck, getAllUsers);
router.post("/updateAdminStatus", jwtCheck, updateAdminStatus);

export { router as userRoute };