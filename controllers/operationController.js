const Operation = require('../models/Operation');

exports.addOperation = (req, res) => {
    const operation = new Operation(req.body);
    operation.save()
        .then((operation) => res.status(201).json(operation))
        .catch((err) => res.status(400).json({ message: err.message }));
};

exports.getAllOperations = (req, res) => {
    Operation.find()
        .populate('trainer')
        .populate('opportunity')
        .then((operations) => res.json(operations))
        .catch((err) => res.status(500).json({ message: err.message }));
};

exports.updatePerformance = (req, res) => {
    Operation.findByIdAndUpdate(req.params.id, { performance: req.body.performance }, { new: true })
        .then((operation) => res.json(operation))
        .catch((err) => res.status(400).json({ message: err.message }));
};
