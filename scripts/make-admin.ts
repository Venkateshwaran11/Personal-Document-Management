import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../api/models/User';

dotenv.config();

const makeAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Usage: npx tsx scripts/make-admin.ts <email>');
        process.exit(1);
    }

    try {
        const uri = process.env['MONGO_URI'];
        if (!uri) {
            console.error('Error: MONGO_URI is not defined in .env file');
            process.exit(1);
        }

        console.log('Connecting to database...');
        await mongoose.connect(uri);
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.error(`Error: User with email "${email}" not found.`);
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log(`User "${user.username}" (${email}) is ALREADY an admin.`);
        } else {
            user.role = 'admin';
            await user.save();
            console.log(`✅ SUCCESS: User "${user.username}" (${email}) has been promoted to ADMIN.`);
        }

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

makeAdmin();
