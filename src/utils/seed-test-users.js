// utils/seed-test-users.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/admin.model.js';
import Student from '../models/students.model.js';
import Teacher from '../models/teacher.model.js';

dotenv.config();

const testUsers = {
    admins: [
        {
            email: 'dean@college.com',
            password: 'Admin@123',
            firstName: 'Main',
            lastName: 'Admin',
            role: 'main_admin',
            phoneNumber: '9999999999'
        },
        {
            email: 'hod.cs@college.com',
            password: 'HOD@123',
            firstName: 'Computer Science',
            lastName: 'HOD',
            role: 'sub_admin',
            department: 'Computer Science',
            phoneNumber: '9999999998'
        },
        {
            email: 'hod.math@college.com',
            password: 'HOD@123',
            firstName: 'Mathematics',
            lastName: 'HOD',
            role: 'sub_admin',
            department: 'Mathematics',
            phoneNumber: '9999999997'
        }
    ],
    teachers: [
        {
            email: 'sarah.johnson@college.com',
            password: 'Teacher@123',
            firstName: 'Sarah',
            lastName: 'Johnson',
            department: 'Mathematics',
            subject: 'Advanced Mathematics',
            phoneNumber: '9876543210'
        },
        {
            email: 'michael.brown@college.com',
            password: 'Teacher@123',
            firstName: 'Michael',
            lastName: 'Brown',
            department: 'Physics',
            subject: 'Physics Laboratory',
            phoneNumber: '9876543211'
        },
        {
            email: 'emily.wilson@college.com',
            password: 'Teacher@123',
            firstName: 'Emily',
            lastName: 'Wilson',
            department: 'Chemistry',
            subject: 'Chemistry Fundamentals',
            phoneNumber: '9876543212'
        },
        {
            email: 'robert.kim@college.com',
            password: 'Teacher@123',
            firstName: 'Robert',
            lastName: 'Kim',
            department: 'Computer Science',
            subject: 'Computer Science Basics',
            phoneNumber: '9876543213'
        },
        {
            email: 'amanda.clark@college.com',
            password: 'Teacher@123',
            firstName: 'Amanda',
            lastName: 'Clark',
            department: 'English',
            subject: 'English Literature',
            phoneNumber: '9876543214'
        }
    ],
    students: [
        {
            email: 'student.cs@college.com',
            password: 'Student@123',
            firstName: 'Jane',
            lastName: 'Doe',
            enrollmentNumber: 'CS2023001',
            department: 'Computer Science',
            course: 'B.Tech',
            year: 2,
            semester: 4,
            phoneNumber: '9876543220'
        },
        {
            email: 'alice.johnson@college.com',
            password: 'Student@123',
            firstName: 'Alice',
            lastName: 'Johnson',
            enrollmentNumber: 'CS2023002',
            department: 'Computer Science',
            course: 'B.Tech',
            year: 2,
            semester: 4,
            phoneNumber: '9876543221'
        },
        {
            email: 'bob.smith@college.com',
            password: 'Student@123',
            firstName: 'Bob',
            lastName: 'Smith',
            enrollmentNumber: 'CS2023003',
            department: 'Computer Science',
            course: 'B.Tech',
            year: 2,
            semester: 4,
            phoneNumber: '9876543222'
        },
        {
            email: 'carol.davis@college.com',
            password: 'Student@123',
            firstName: 'Carol',
            lastName: 'Davis',
            enrollmentNumber: 'MATH2023001',
            department: 'Mathematics',
            course: 'B.Sc',
            year: 3,
            semester: 5,
            phoneNumber: '9876543223'
        },
        {
            email: 'david.wilson@college.com',
            password: 'Student@123',
            firstName: 'David',
            lastName: 'Wilson',
            enrollmentNumber: 'PHY2023001',
            department: 'Physics',
            course: 'B.Sc',
            year: 1,
            semester: 2,
            phoneNumber: '9876543224'
        },
        {
            email: 'emma.brown@college.com',
            password: 'Student@123',
            firstName: 'Emma',
            lastName: 'Brown',
            enrollmentNumber: 'CHEM2023001',
            department: 'Chemistry',
            course: 'B.Sc',
            year: 2,
            semester: 3,
            phoneNumber: '9876543225'
        }
    ]
};

async function seedUsers() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Seed Admins
        console.log('👨‍💼 Creating Admins...');
        for (const adminData of testUsers.admins) {
            const existing = await Admin.findOne({ email: adminData.email });
            if (!existing) {
                const admin = new Admin(adminData);
                await admin.save();
                console.log(`✅ Created: ${adminData.email}`);
            } else {
                console.log(`⚠️  Already exists: ${adminData.email}`);
            }
        }

        // Seed Teachers
        console.log('\n👨‍🏫 Creating Teachers...');
        for (const teacherData of testUsers.teachers) {
            const existing = await Teacher.findOne({ email: teacherData.email });
            if (!existing) {
                const teacher = new Teacher(teacherData);
                await teacher.save();
                console.log(`✅ Created: ${teacherData.email}`);
            } else {
                console.log(`⚠️  Already exists: ${teacherData.email}`);
            }
        }

        // Seed Students
        console.log('\n👨‍🎓 Creating Students...');
        for (const studentData of testUsers.students) {
            const existing = await Student.findOne({ enrollmentNumber: studentData.enrollmentNumber });
            if (!existing) {
                const student = new Student(studentData);
                await student.save();
                console.log(`✅ Created: ${studentData.enrollmentNumber} (${studentData.email})`);
            } else {
                console.log(`⚠️  Already exists: ${studentData.enrollmentNumber}`);
            }
        }

        console.log('\n🎉 All test users created successfully!\n');
        console.log('📋 ============ TEST CREDENTIALS ============\n');

        console.log('👨‍💼 ADMINS:');
        testUsers.admins.forEach(admin => {
            console.log(`   Email: ${admin.email}`);
            console.log(`   Password: ${admin.password}`);
            console.log(`   Role: ${admin.role}\n`);
        });

        console.log('👨‍🏫 TEACHERS:');
        testUsers.teachers.forEach(teacher => {
            console.log(`   Email: ${teacher.email}`);
            console.log(`   Password: ${teacher.password}`);
            console.log(`   Subject: ${teacher.subject}\n`);
        });

        console.log('👨‍🎓 STUDENTS:');
        testUsers.students.forEach(student => {
            console.log(`   Enrollment: ${student.enrollmentNumber}`);
            console.log(`   Email: ${student.email}`);
            console.log(`   Password: ${student.password}`);
            console.log(`   Department: ${student.department}\n`);
        });

        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
}

seedUsers();
