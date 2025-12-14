const express = require('express');
const router = express.Router();

const subjects = [
    { code: 'MA3354', name: 'Discrete Mathematics', credits: 4 },
    { code: 'CS3351', name: 'Digital Principles and Computer Organization', credits: 4 },
    { code: 'CS3352', name: 'Foundations of Data Science', credits: 3 },
    { code: 'CD3291', name: 'Data Structures and Algorithms', credits: 3 },
    { code: 'CS3391', name: 'Object Oriented Programming', credits: 3 },
    { code: 'CD3281', name: 'Data Structures and Algorithms Laboratory', credits: 2 },
    { code: 'CS3381', name: 'Object Oriented Programming Laboratory', credits: 1.5 },
    { code: 'CS3361', name: 'Data Science Laboratory', credits: 2 },
    { code: 'GE3361', name: 'Professional Development', credits: 1 },
    { code: 'CS3452', name: 'Theory of Computation', credits: 3 },
    { code: 'CS3491', name: 'Artificial Intelligence and Machine Learning', credits: 4 },
    { code: 'CS3492', name: 'Database Management Systems', credits: 3 },
    { code: 'IT3401', name: 'Web Essentials', credits: 4 },
    { code: 'CS3451', name: 'Introduction to Operating Systems', credits: 3 },
    { code: 'GE3451', name: 'Environmental Sciences and Sustainability', credits: 2 },
    { code: 'CS3461', name: 'Operating Systems Laboratory', credits: 1.5 },
    { code: 'CS3481', name: 'Database Management Systems Laboratory', credits: 1.5 },
    { code: 'NM1022', name: 'Naan Mudhalvan Project Development', credits: 1 },
    { code: 'HS3152', name: 'Professional English - I', credits: 3 },
    { code: 'MA3151', name: 'Matrices and Calculus', credits: 4 },
    { code: 'PH3151', name: 'Engineering Physics', credits: 3 },
    { code: 'CY3151', name: 'Engineering Chemistry', credits: 3 },
    { code: 'GE3151', name: 'Problem Solving and Python Programming', credits: 3 },
    { code: 'GE3152', name: 'தமிழர் மரபு /Heritage of Tamils', credits: 1 },
    { code: 'GE3171', name: 'Problem Solving and Python Programming Laboratory', credits: 2 },
    { code: 'BS3171', name: 'Physics and Chemistry Laboratory', credits: 2 },
    { code: 'GE3172', name: 'English Laboratory', credits: 1 },
    { code: 'HS3252', name: 'Professional English - II', credits: 2 },
    { code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4 },
    { code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
    { code: 'BE3251', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
    { code: 'GE3251', name: 'Engineering Graphics', credits: 4 },
    { code: 'CS3251', name: 'Programming in C', credits: 3 },
    { code: 'GE3252', name: 'தமிழரும் தொழில்நுட்பமும் /Tamils and Technology', credits: 1 },
    { code: 'GE3271', name: 'Engineering Practices Laboratory', credits: 2 },
    { code: 'CS3271', name: 'Programming in C Laboratory', credits: 2 },
    { code: 'GE3272', name: 'Communication Laboratory / Foreign Language', credits: 2 },
    { code: 'CS3591', name: 'Computer Networks', credits: 4 },
    { code: 'IT3501', name: 'Full Stack Web Development', credits: 3 },
    { code: 'CS3551', name: 'Distributed Computing', credits: 3 },
    { code: 'CS3691', name: 'Embedded Systems and IoT', credits: 4 },
    { code: 'IT3511', name: 'Full Stack Web Development Laboratory', credits: 2 },
    { code: 'CCS334', name: 'Big Data Analytics', credits: 3 },
    { code: 'CCS366', name: 'Software Testing and Automation', credits: 3 },
    { code: 'CCS343', name: 'Digital and Mobile Forensics', credits: 3 },
    { code: 'CCS370', name: 'UI and UX Design', credits: 3 },
    { code: 'CCS356', name: 'Object Oriented Software Engineering', credits: 4 },
    { code: 'IT3681', name: 'Mobile Applications Development Laboratory', credits: 1.5 },
    { code: 'CCS335', name: 'Cloud Computing', credits: 3 },
    { code: 'CCS336', name: 'Cloud Services Management', credits: 3 },
    { code: 'CCS354', name: 'Network Security', credits: 3 },
    { code: 'CCS339', name: 'Cryptocurrency and Blockchain Technologies', credits: 3 },
    { code: 'CCW332', name: 'Digital Marketing', credits: 3 },
    { code: 'OCE351', name: 'Environmental and Social Impact Assessment', credits: 3 },
    { code: 'MX3083', name: 'Film Appreciation', credits: 0 },
    { code: 'MX3088', name: 'State, Nation Building and Politics in India', credits: 0 },
    { code: 'SB8026', name: 'Robotic Process Automation Development', credits: 1 },
    { code: 'GE3791', name: 'Human Values and Ethics', credits: 2 },
    { code: 'IT3711', name: 'Summer internship', credits: 2 },
    { code: 'IT3811', name: 'Project Work/Intership', credits: 10 },
    { code: 'CCS345', name: 'Ethics and AI', credits: 3 },
    { code: 'CCS346', name: 'Exploratory Data Analysis', credits: 3 },
    { code: 'AI3021', name: 'IT in Agricultural System', credits: 3 },
    { code: 'OFD352', name: 'Traditional Indian Foods', credits: 3 },
    { code: 'OHS352', name: 'Project Report Writing', credits: 3 },
    { code: 'GE3754', name: 'Human Resource Management', credits: 3 }

];

router.get('/subject/:code', (req, res) => {
  const { code } = req.params;
  const subject = subjects.find((s) => s.code === code.toUpperCase());
  if (subject) {
    res.json(subject);
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
});

module.exports = router;
