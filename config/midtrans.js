const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-tFXFI3oezojYq-HlTIbZZVE7',
    clientKey: 'SB-Mid-client-llHOpHgXWSGfeFLR'
});

module.exports = snap;