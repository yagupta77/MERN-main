const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    initiatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    resume: { type: Buffer, required: true }, // Store file as Buffer
    status: { type: String, default: 'pending' },
    reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }],
    remarks: [{ remark: String, reviewerId: mongoose.Schema.Types.ObjectId }],
    approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);