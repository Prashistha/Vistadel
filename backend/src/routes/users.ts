import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";
const router = express.Router();

router.get("/user-details", verifyToken, async (req: Request, res: Response) => {
	const userId = req.userId;

	try {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		// Return email and fullName
		res.json({ email: user.email, firstName: user.firstName, lastName: user.lastName });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Something went wrong" });
	}
});

router.get("/me", verifyToken, async (req: Request, res: Response) => {
	const userId = req.userId;

	try {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "something went wrong" });
	}
});

router.post(
	"/register",
	[
		check("firstName", "First Name is required").isString(),
		check("lastName", "Last Name is required").isString(),
		check("email", "Email is required").isEmail(),
		check("password", "Password with 6 or more characters required").isLength({
			min: 6,
		}),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ message: errors.array() });
		}

		try {
			let user = await User.findOne({
				email: req.body.email,
			});

			if (user) {
				return res.status(400).json({ message: "User already exists" });
			}

			user = new User(req.body);
			await user.save();

			const token = jwt.sign(
				{ userId: user.id },
				process.env.JWT_SECRET_KEY as string,
				{
					expiresIn: "1d",
				}
			);

			res.cookie("auth_token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				maxAge: 86400000,
			});
			return res.status(200).send({ message: "User registered OK" });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: "Something went wrong" });
		}
	}
);
router.put(
	"/update-profile",
	verifyToken,
	[
	  check("firstName", "First Name is required").optional().isString(),
	  check("lastName", "Last Name is required").optional().isString(),
	  check("email", "Valid email is required").optional().isEmail(),
	],
	async (req: Request, res: Response) => {
	  const errors = validationResult(req);
	  if (!errors.isEmpty()) {
		return res.status(400).json({ message: errors.array() });
	  }
  
	  const userId = req.userId;
  
	  try {
		let user = await User.findById(userId);
		if (!user) {
		  return res.status(400).json({ message: "User not found" });
		}
  
		// Update user fields if provided in request body
		if (req.body.firstName) {
		  user.firstName = req.body.firstName;
		}
		if (req.body.lastName) {
		  user.lastName = req.body.lastName;
		}
		if (req.body.email) {
		  user.email = req.body.email;
		}
  
		await user.save();
  
		// Optionally, you can generate and send a new JWT token here
  
		res.status(200).json({ message: "Profile updated successfully" });
	  } catch (error) {
		console.error(error);
		res.status(500).json({ message: "Something went wrong" });
	  }
	}
  );
  
export default router;
