const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    type: { type: String, enum: ['GPA', 'CGPA', 'Auto_GPA'], required: true },
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('ClickCount', clickSchema);  
