const express = require('express')
const router = express.Router()

const subscriptionService = require('../services/subscription_service')

// Insert Subscription
router.post('/:userId', async (req, res) => {
    try {
        const { registrationToken, notificationType } = req.body
        const userId = req.params.userId

        const result = await subscriptionService.insertSubscription(registrationToken, notificationType, userId)
        return res.status(201).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Update Subscription status
router.patch('/:userId', async (req, res) => {
    try {
        const { registrationToken, notificationType, subscribe } = req.body
        const userId = req.params.userId

        await subscriptionService.updateSubscribeStatus(registrationToken, notificationType, subscribe, userId)
        return res.status(200).json({ data: "Your Notification Subscription has been updated." })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Check if the device has already register (Store in the database)
router.post('/:userId/registration', async (req, res) => {
    try {
        const { registrationToken } = req.body
        const userId = req.params.userId

        const result = await subscriptionService.findExistingSubscription(registrationToken, userId)
        return res.status(200).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router