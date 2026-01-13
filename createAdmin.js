import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Enter email of user to promote to admin: ', async (email) => {
            const user = await User.findOne({ email: email.trim() });

            if (user) {
                user.role = 'admin';
                await user.save();
                console.log(`✅ User ${email} has been promoted to admin!`);
            } else {
                console.log(`❌ User with email ${email} not found.`);
            }

            rl.close();
            await mongoose.disconnect();
            process.exit();
        });
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();
