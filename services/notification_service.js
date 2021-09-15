const connection = require('../config/database')
const admin = require('../config/firebase').admin

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
}

const message_notification = {
     notification: {
        title: "",
        body: ""
    }
}

export const sendNotification = async (registrationToken, title, body) => {
    try {
        message_notification.notification.title = title
        message_notification.notification.body = body

        return await admin.messaging().sendToDevice(
            registrationToken, 
            message_notification, 
            notification_options
        )
    } catch (error) {
        throw new Error(`Send Notification: ${error.message}`)
    }
}