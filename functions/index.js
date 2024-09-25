// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNewProductNotification = functions.firestore
    .document('products/{productId}')
    .onCreate(async (snap, context) => {
        const product = snap.data();

        const message = {
            notification: {
                title: 'New Product Added',
                body: `${product.name} is available for ${product.price} in ${product.category}`,
            },
            topic: 'newProduct',
        };

        try {
            await admin.messaging().send(message);
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    });
