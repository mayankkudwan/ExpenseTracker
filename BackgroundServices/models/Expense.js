const mongoose = require("mongoose");
const ExpenseSchema = mongoose.Schema({
    label:{type:String, require:true},
    value:{type:Number, required:true},
    date:{type:String, require:true},
})
module.exports = mongoose.model("Expense", ExpenseSchema)