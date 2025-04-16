import mongoose from 'mongoose';

const userInvestmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    registeredDate: {
        type: Date,
        default: Date.now
    },
    overallProfitLoss: {
        type: Number,
        default: 0
    },
    todaysGain: {
        type: Number,
        default: 0
    },
    investedAmount: {
        type: Number,
        required: true,
        min: [0, 'Invested amount must be a positive number']
    }
});

// Add an index for userId to improve query performance
userInvestmentSchema.index({ userId: 1 });

userInvestmentSchema.statics.getUserInvestmentsWithDetails = function () {
    return this.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'userDetails'
            }
        },
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true // Prevents errors if no userDetails are found
            }
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                registeredDate: 1,
                overallProfitLoss: 1,
                todaysGain: 1,
                investedAmount: 1,
                'userDetails.username': 1
            }
        }
    ]);
};

export default mongoose.model('UserInvestment', userInvestmentSchema);