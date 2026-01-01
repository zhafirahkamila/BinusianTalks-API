const mongoose = require("mongoose");

const UserScheme = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    created_at: { type: Date, default: Date.now }
});

// Auto-generate username from email
UserScheme.pre("save", function() {
    if(this.email && !this.username){
        const emailPart = this.email.split("@")[0];
        const username = emailPart.split(".")[0];
        this.username = username.toLowerCase();
    }
});

module.exports = mongoose.model("User", UserScheme, "users");