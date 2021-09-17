const express = require('express')
const router = express.Router()

const subscriptionService = require('../services/subscription_service')

// Get Subscription by registration token
router.post('/token', async (req, res) => {
    try {
        const registrationToken = req.body.registrationToken
        const result = await subscriptionService.getSubscriptionByRegistrationToken(registrationToken)
        return res.status(201).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Get subscription by user id
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const result = await subscriptionService.getSubscriptionByUserId(userId)
        return res.status(201).json({ data: result })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

// Insert Subscription
router.post('/user/:userId', async (req, res) => {
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
router.patch('/user/:userId', async (req, res) => {
    try {
        const { registrationToken, notificationType, subscribe } = req.body
        const userId = req.params.userId

        await subscriptionService.updateSubscribeStatus(registrationToken, notificationType, subscribe, userId)
        return res.status(200).json({ data: "Your Notification Subscription has been updated." })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

module.exports = router