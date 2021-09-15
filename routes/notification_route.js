const express = require('express')
const router = express.Router()

const notificationService = require('../services/notification_service')

router.get('/', async (req, res) => {
    try {
        const { registrationToken, title, body } = req.body
        const result = await notificationService.sendNotification(registrationToken, title, body)
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router