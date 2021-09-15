const connection = require('../config/database')

export const insertSubscription = async (registrationToken, notiType, userId) => {
    // For calling first time, auto subscribe to both notifications 

    let query = 'INSERT INTO Subscription (Scp_Registration_Token, Scp_Notification_Type, Scp_Psn_ID) '
    query += 'VALUES (?, ?, ?);'

    try {
        const result = await connection.promise().execute(
            query, 
            [ registrationToken, notiType, userId ]
        )
        return result[0].insertId
    } catch (error) {
        throw new Error(`Insert Notification Subscription: ${error.message}`)
    }
}

export const updateSubscribeStatus = async (registrationToken, notiType, subscribe, userId) => {
    let query = 'UPDATE Subscription SET Scp_Subscribe = ? '
    query += 'WHERE Scp_Registration_Token = ? AND Scp_Notification_Type = ? AND Scp_Psn_ID = ? ;'

    try {
        let isSubscribe = subscribe ? 'T': 'F'

        await connection.promise().execute(
            query, 
            [ isSubscribe, registrationToken, notiType, userId ]
        )
    } catch (error) {
        throw new Error(`Update Subscription: ${error.message}`)
    }
}

export const findExistingSubscription = async (registrationToken, userId) => {
    let query = 'SELECT * FROM Subscription '
    query += 'WHERE Scp_Registration_Token = ? AND Scp_Psn_ID = ? ;'

    try {
        const result = await connection.promise().execute(
            query, 
            [ registrationToken, userId ]
        )
        return result[0][0]
    } catch (error) {
        throw new Error(`Find Exisitng Subscriptions: ${error.message}`)
    }
}