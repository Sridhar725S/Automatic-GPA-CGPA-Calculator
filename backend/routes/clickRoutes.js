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
    { code: 'NM1022', name: 'Naan Mudhalvan Project Development', credits: 1 }
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
