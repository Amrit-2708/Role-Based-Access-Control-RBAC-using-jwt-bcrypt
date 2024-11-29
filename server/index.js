// require("dotenv").config()
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// app.use(express.json());
// app.use(cors());

// mongoose
//     .connect(
//         process.env.MONGODB_URI
//     )
//     .then(() => {
//         console.log("Connected to MongoDB Atlas");
//     })
//     .catch((err) => {
//         console.error("Error connecting to MongoDB Atlas", err);
//     });


// const MemberSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
//     role: {
//         type: String,
//         default: 'user'
//     },
//     status: {
//         type: String,
//         default: 'active'
//     }
// });


// const User = mongoose.model("users", MemberSchema);


// app.post("/signup", async (req, res) => {
//     console.log(req.body);
//     const { name, email, password } = req.body;
//     try {
//         const data = await User.create({ name, email, password });
//         const member = await data.save();
//         res
//             .status(200)
//             .send({ message: "Member Registered Successfully", id: member._id });
//         console.log(member);
//     } catch (error) {
//         if (error.code === 11000) {
//             if (error.keyPattern.email) {
//                 return res.status(400).send({ message: "This email already exists" });
//             }
//         }
//         res.status(500).send({ message: "Something went wrong" });
//     }
// });


// app.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });
//         console.log(user);
//         if (!user) {
//             return res
//                 .status(400)
//                 .send({ message: "Account not found, Please register first" });
//         } else {
//             if (user.email === email && user.password === password) {
//                 res
//                     .status(200)
//                     .send({ message: "Logged in successfully", id: user._id, role: user.role });
//             } else if (user.email === email && user.password !== password) {
//                 res.status(400).send({ message: "Invalid password" });
//             }
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Something went wrong" });
//     }
// });

// app.post("/adduser", async (req, res) => {
//     const { name, email, final_role } = req.body;
//     const defaultPassword = "password123";
//     try {
//         const data = await User.create({ name, email, password: defaultPassword, role: final_role });
//         const member = await data.save();
//         res
//             .status(200)
//             .send({ message: `Member Added Successfully. Ask ${name} to change their password`, id: member._id });
//         console.log(member);
//     } catch (error) {
//         if (error.code === 11000) {
//             if (error.keyPattern.email) {
//                 return res.status(400).send({ message: "This email already exists. Please try another email" });
//             }
//         }
//         res.status(500).send({ message: "Something went wrong" });
//     }
// })

// app.get("/users", async (req, res) => {
//     try {
//         // Fetch all users from the database
//         const users = await User.find();
//         res.status(200).send({ message: "Users retrieved successfully", data: users });
//     } catch (error) {
//         res.status(500).send({ message: "Failed to retrieve users", error: error.message });
//     }
// });



// app.get("/users/:id", async (req, res) => {
//     const { id } = req.params; // Get the ID from the URL parameter

//     try {
//         const user = await User.findById(id);
//         if (!user) {
//             return res.status(404).send({ message: "User not found" });
//         }
//         res.status(200).send(user); // Send the user data as a response
//     } catch (error) {
//         res.status(500).send({ message: "Error fetching user details", error: error.message });
//     }
// });



// app.delete("/remove/:id", async (req, res) => {
//     const { id } = req.params;
//     const data = await User.findByIdAndDelete(id);
//     if (!data) {
//         return res
//             .status(400)
//             .send({ message: "Member with this id does not exist" });
//     }
//     console.log(data);
//     res.status(200).send({ message: "Member Removed succesfully" });
// });


// app.patch("/update/:id", async (req, res) => {
//     const { id } = req.params;
//     const { name, email, role, status } = req.body;

//     try {
//         const data = await User.findByIdAndUpdate(id, {
//             name: name,
//             email: email,
//             role: role,
//             status: status
//         });
//         if (!data) {
//             return res
//                 .status(400)
//                 .send({ message: "Member with this id does not exist" });
//         }

//         res.status(200).send({ message: "Member details edited successfully" });
//     } catch (error) {
//         console.log(error);
//         res
//             .status(500)
//             .send({ message: "An error occurred while updating the details" });
//     }
// });

// app.patch("/change_password/:id", async (req, res) => {
//     const { id } = req.params;
//     const { newPass } = req.body;

//     try {
//         const data = await User.findByIdAndUpdate(id, {
//             password: newPass,
//         });
//         if (!data) {
//             return res
//                 .status(400)
//                 .send({ message: "Member with this id does not exist" });
//         }

//         res.status(200).send({ message: "Password changed successfully" });
//     } catch (error) {
//         console.log(error);
//         res
//             .status(500)
//             .send({ message: "An error occurred while updating the password" });
//     }
// });







// app.listen(3001, () => {
//     console.log("server is running");
// });



require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB Atlas", err);
    });

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    status: {
        type: String,
        default: 'active',
    },
});

const User = mongoose.model("users", MemberSchema);

// Helper function to generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" } // Token expires in 1 hour
    );
};

// Sign up route
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        const data = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const member = await data.save();
        res
            .status(200)
            .send({ message: "Member Registered Successfully", id: member._id });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).send({ message: "This email already exists" });
        }
        res.status(500).send({ message: "Something went wrong" });
    }
});

// Login route with JWT and password verification
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: "Account not found, Please register first" });
        }

        const isMatch = await bcrypt.compare(password, user.password); // Compare hashed password
        if (!isMatch) {
            return res.status(400).send({ message: "Invalid password" });
        }

        // Generate JWT token if login is successful
        const token = generateToken(user);
        console.log(token);

        res.status(200).send({
            message: "Logged in successfully",
            id: user._id,
            role: user.role,
            token: token, // Send JWT token in response
        });
    } catch (error) {
        res.status(500).send({ message: "Something went wrong" });
    }
});

// Add user (password is hashed)
app.post("/adduser", async (req, res) => {
    const { name, email, final_role } = req.body;
    const defaultPassword = "password123";

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
        const hashedPassword = await bcrypt.hash(defaultPassword, salt); // Hash the password

        const data = await User.create({
            name,
            email,
            password: hashedPassword,
            role: final_role,
        });
        const member = await data.save();
        res.status(200).send({
            message: `Member Added Successfully. Ask ${name} to change their password`,
            id: member._id,
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).send({ message: "This email already exists" });
        }
        res.status(500).send({ message: "Something went wrong" });
    }
});

// Middleware to protect routes using JWT token
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization").split(' ')[1];
    console.log(token);
    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify JWT
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(400).send({ message: "Invalid token" });
    }
};

// Get all users (protected route)
app.get("/users", authMiddleware, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({ message: "Users retrieved successfully", data: users });
    } catch (error) {
        res.status(500).send({ message: "Failed to retrieve users", error: error.message });
    }
});

// Get user by ID (protected route)
app.get("/users/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: "Error fetching user details", error: error.message });
    }
});

// Delete user (protected route)
app.delete("/remove/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const data = await User.findByIdAndDelete(id);
    if (!data) {
        return res.status(400).send({ message: "Member with this id does not exist" });
    }
    res.status(200).send({ message: "Member Removed successfully" });
});

// Update user details (protected route)
app.patch("/update/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    try {
        const data = await User.findByIdAndUpdate(id, { name, email, role, status });
        if (!data) {
            return res.status(400).send({ message: "Member with this id does not exist" });
        }
        res.status(200).send({ message: "Member details edited successfully" });
    } catch (error) {
        res.status(500).send({ message: "An error occurred while updating the details" });
    }
});

// Change password (protected route)
app.patch("/change_password/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { newPass } = req.body;

    try {
        const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
        const hashedPassword = await bcrypt.hash(newPass, salt); // Hash the new password

        const data = await User.findByIdAndUpdate(id, { password: hashedPassword });
        if (!data) {
            return res.status(400).send({ message: "Member with this id does not exist" });
        }

        res.status(200).send({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).send({ message: "An error occurred while updating the password" });
    }
});

app.listen(3001, () => {
    console.log("server is running");
});
