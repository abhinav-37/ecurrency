const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cart: {
        type: Object,
   }
});

module.exports = Purchase = mongoose.model("Purchase", purchaseSchema);