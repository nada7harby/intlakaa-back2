import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createOwner = async () => {
  try {
    console.log('🚀 Creating Owner Account...\n');

    // Get owner details
    const name = await question('Owner Name: ');
    const email = await question('Owner Email: ');
    const password = await question('Owner Password (min 6 chars): ');

    if (!name || !email || !password) {
      console.error('❌ All fields are required!');
      process.exit(1);
    }

    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters!');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Check if owner already exists
    const existingOwner = await db.collection('admins').findOne({ email });
    if (existingOwner) {
      console.error('❌ Admin with this email already exists!');
      await mongoose.connection.close();
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create owner
    console.log('👤 Creating owner account...');
    await db.collection('admins').insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'owner',
      createdAt: new Date()
    });

    console.log('\n✅ Owner account created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🔗 You can now login at: POST /api/admins/login\n');

    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
};

createOwner();
