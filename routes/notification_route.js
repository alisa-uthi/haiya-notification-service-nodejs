const express = require('express')
const router = express.Router()

const notificationService = require('../services/notification_service')

// Send notification
router.post('/', async (req, res) => {
    try {
        const { registrationToken, title, body } = req.body
        const result = await notificationService.sendNotification(registrationToken, title, body)
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Get notifications by id
router.get('/:id', async (req, res) => {
    try {
        const result = await notificationService.getNotificationById(req.params.id)
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Delete notifications by id
router.delete('/:id', async (req, res) => {
    try {
        await notificationService.deleteNotificationById(req.params.id)
        return res.status(200).json({ data: "Remove notification successfully." })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Insert notification
router.post('/user/:userId', async (req, res) => {
    try {
        const { title, body } = req.body
        const userId = req.params.userId

        const result = await notificationService.insertNotificationByUserId(userId, title, body)
        return res.status(201).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Get all notifications by user id
router.get('/user/:userId', async (req, res) => {
    try {
        const result = await notificationService.getNotificationsByUserId(req.params.userId)
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Delete all notifications by user id
router.delete('/user/:userId', async (req, res) => {
    try {
        await notificationService.deleteNotificationsByUserId(req.params.userId)
        return res.status(200).json({ data: "Clear All Notifications." })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router