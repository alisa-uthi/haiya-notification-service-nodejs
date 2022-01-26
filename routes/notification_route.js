const express = require("express");
const router = express.Router();
const passport = require("passport");

const notificationService = require("../services/notification_service");
const subscriptionService = require("../services/subscription_service");
const { NotificationType } = require("../constants/notification_type");

// Send notification
router.post("/", async (req, res) => {
  try {
    const { registrationToken, title, body, userId } = req.body;
    const notificationType = req.body.notificationType.toUpperCase();

    if (Object.values(NotificationType).toString().includes(notificationType)) {
      // Find existing subscription of this device
      const result = await subscriptionService.findExistingSubscription(
        registrationToken,
        userId
      );

      // For calling first time, auto subscribe to both notifications
      if (result.length == 0) {
        await subscriptionService.insertSubscription(
          registrationToken,
          NotificationType.ORDER_ARRIVED,
          userId
        );
        await subscriptionService.insertSubscription(
          registrationToken,
          NotificationType.ORDER_OTW_PHARMACY,
          userId
        );
        await subscriptionService.insertSubscription(
          registrationToken,
          NotificationType.ORDER_PICKEDUP,
          userId
        );
      }

      // Check if the device is subscribed to this type of notification
      const subscribeResult = await subscriptionService.checkSubscribe(
        registrationToken,
        userId,
        notificationType
      );

      if (subscribeResult.Scp_Subscribe == "T") {
        const notiResult = await notificationService.sendNotification(
          registrationToken,
          title,
          body
        );
        await notificationService.insertNotificationByUserId(
          userId,
          title,
          body,
          notificationType
        );

        return res.status(200).json({ data: notiResult });
      } else {
        return res
          .status(200)
          .json({ data: "The device is not subscribe to this notification." });
      }
    }

    return res.status(400).json({ data: "Invalid notificaiton type." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get notifications by id
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await notificationService.getNotificationById(
        req.params.id
      );
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Delete notifications by id
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await notificationService.deleteNotificationById(req.params.id);
      return res
        .status(200)
        .json({ data: "Remove notification successfully." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Insert notification
router.post("/user/:userId", async (req, res) => {
  try {
    const { title, body } = req.body;
    const notificationType = req.body.notificationType.toUpperCase();
    const userId = req.params.userId;

    if (Object.values(NotificationType).toString().includes(notificationType)) {
      const result = await notificationService.insertNotificationByUserId(
        userId,
        title,
        body,
        notificationType
      );
      return res.status(201).json({ data: result });
    }

    return res.status(400).json({ data: "Invalid notificaiton type." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all notifications by user id
router.get(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const result = await notificationService.getNotificationsByUserId(
        req.params.userId
      );
      return res.status(200).json({ data: result });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

// Delete all notifications by user id
router.delete(
  "/user/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await notificationService.deleteNotificationsByUserId(req.params.userId);
      return res.status(200).json({ data: "Clear All Notifications." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
