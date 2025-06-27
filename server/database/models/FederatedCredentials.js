const mongoose = require('mongoose');

const federatedCredentialSchema = new mongoose.Schema({
  provider: String,
  subject: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},
{
  collection: 'federated_credentials'
}
);

module.exports = mongoose.model('FederatedCredential', federatedCredentialSchema);
