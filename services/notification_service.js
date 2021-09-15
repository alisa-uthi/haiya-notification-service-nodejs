const connection = require('../config/database')
const admin = require('../config/firebase').admin

export const sendNotification = async (registrationToken, title, body) => {
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

export const insertNotificationByUserId = async (userId, title, body) => {
    let query = 'INSERT INTO Notification (Noti_Title, Noti_Body, Noti_Psn_ID) '
    query += 'VALUES (?, ?, ?);'

    try {
        const result = await connection.promise().execute(
            query,
            [ title, body, userId ]
        )
        return result[0].insertId
    } catch (error) {
        throw new Error(`Insert New Notification: ${error.message}`)
    }
}

export const getNotificationsByUserId = async (userId) => {
    let query = 'SELECT * FROM Notification WHERE Noti_Psn_ID = ? ;'

    try {
        const result = await connection.promise().execute(query, [ userId ])
        return result[0]
    } catch (error) {
        throw new Error(`Get All Notifications By User ID: ${error.message}`)
    }
}

export const getNotificationById = async (id) => {
    let query = 'SELECT * FROM Notification WHERE ID = ? ;'

    try {
        const result = await connection.promise().execute(query, [ id ])
        return result[0][0]
    } catch (error) {
        throw new Error(`Get Notification By ID: ${error.message}`)
    }
}

export const deleteNotificationById = async (id) => {
    let query = 'DELETE FROM Notification WHERE ID = ? ;'

    try {
        await connection.promise().execute(query, [ id ])
    } catch (error) {
        throw new Error(`Delete Notification By ID: ${error.message}`)
    }
}

export const deleteNotificationsByUserId = async (userId) => {
    let query = 'DELETE FROM Notification WHERE Noti_Psn_ID = ? ;'

    try {
        await connection.promise().execute(query, [ userId ])
    } catch (error) {
        throw new Error(`Delete All Notifications By User ID: ${error.message}`)
    }
}