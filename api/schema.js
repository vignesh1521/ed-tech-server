const { gql } = require('apollo-server-express');
const { users, CourseEnrolled } = require('./users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { secret } = require('./auth');

const courses = [
    {
        id: 1,
        title: "Data Structures and Algorithms in C++",
        description: "Master the fundamentals of data structures and algorithms using C++. Perfect for beginners aiming to build a strong programming foundation.",
        level: "Beginner",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(47896)/3368275-C__.jpg"
    },
    {
        id: 2,
        title: "Digital Marketing Advanced",
        description: "Explore advanced strategies in SEO, social media, email marketing, and analytics to become a proficient digital marketer.",
        level: "Advanced",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(47903)/3368646-DM.jpeg"
    },
    {
        id: 3,
        title: "UI/UX Design",
        description: "Learn the essentials of user interface and user experience design, including wireframing, prototyping, and design thinking principles.",
        level: "Beginner",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(47904)/3368666-UIUX.png"
    },
    {
        id: 4,
        title: "Artificial Intelligence (English)",
        description: "Understand the core concepts of AI, machine learning, and neural networks, with hands-on examples and real-world applications.",
        level: "Intermediate",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(48278)/3409489-images.jpeg"
    },
    {
        id: 5,
        title: "IOT",
        description: "Dive into the Internet of Things and learn how smart devices communicate, collect, and share data in real-time.",
        level: "Beginner",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(48287)/3410681-iot.jpg"
    },
    {
        id: 6,
        title: "Cyber Security & Ethical Hacking",
        description: "Gain hands-on knowledge of cyber threats, ethical hacking techniques, and how to protect systems from unauthorized access.",
        level: "Intermediate",
        image: "https://dme2wmiz2suov.cloudfront.net/User(91065251)/CourseBundles(48304)/3412487-CS_photo.png"
    }
];



const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    role: String!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    level: String!
    image : String!
  }



  type Enrollment {
  id: ID!
  user: User!
  course: Course!
  }
  type Query {
    me: User
    getUsers: [User]
    getCourses: [Course]
    getCourseById (id : ID!): Course
    getUserEnrolledCourses(id : ID!) : [Enrollment] 
  }

  type Mutation {
    login(email: String!, password: String!): String
    createCourse(title: String!): Course
    enrollUserInCourse(courseId: ID!): Enrollment
  }
`;

const resolvers = {
    Query: {
        me: (_, __, { user }) => user || null,

        getUsers: (_, __, { user }) => {
            if (user?.role !== 'admin') {
                throw new Error('Access denied');
            }

            return users.map(u => ({ id: u.id, email: u.email, username: u.username, role: u.role }));
        },

        getCourses: () => courses,

        getUserEnrolledCourses: (_, { id }, { user }) => {

            if (user.id != id) throw new Error('Access denied');
            return CourseEnrolled.filter(enrollment => enrollment.user.id == id);

        },
        getCourseById: (_, { id }) => {
            return courses.find(course => course.id == id)
        }
    },

    Mutation: {
        login: (_, { email, password }) => {
            const user = users.find(u => u.email === email);
            if (!user) throw new Error('User not found');

            const valid = bcrypt.compareSync(password, user.password);
            if (!valid) throw new Error('Invalid password');

            return jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, secret, { expiresIn: '1h' });
        },


        enrollUserInCourse: (_, { courseId }, { user, CourseEnrolled }) => {
            if (!user) {
                throw new Error("Authentication required");
            }

            const course = courses.find(c => c.id == courseId);
            if (!course) {
                throw new Error("Course not found");
            }

            // Prevent duplicate enrollment
            const alreadyEnrolled = CourseEnrolled.find(e => e.user.id == user.id && e.course.id == courseId);
            if (alreadyEnrolled) {
                throw new Error("User already enrolled in this course");
            }

            const enrollment = {
                id: CourseEnrolled.length + 1,
                user,
                course
            };
            CourseEnrolled.push(enrollment);
            return enrollment;
        }

    }
};

module.exports = { typeDefs, resolvers };
