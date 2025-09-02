import schedule from "node-schedule";
import Notification from "../models/Notification.js";
import { sendNotification } from "./NotificationService.js";

/**
 * Schedule a notification for a future time
 * @param {Object} options
 * @param {String} options.userId - User to notify
 * @param {Date} options.scheduledFor - When to trigger
 * @param {String} options.type - Notification type
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification message
 * @param {Object} options.data - Extra payload
 */
export const scheduleNotification = async ({
  userId,
  scheduledFor,
  type,
  title,
  message,
  data = {},
}) => {
  try {
    if (!(scheduledFor instanceof Date) || isNaN(scheduledFor)) {
      throw new Error("Invalid scheduled date");
    }

    // Persist scheduled notification in DB
    const scheduled = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
      scheduledFor,
      isScheduled: true,
    });

    // Schedule the job
    schedule.scheduleJob(scheduled._id.toString(), scheduledFor, async () => {
      await sendNotification(userId, {
        type,
        title,
        message,
        data,
      });

      // Update notification as sent
      scheduled.isScheduled = false;
      scheduled.sentAt = new Date();
      await scheduled.save();
    });

    return scheduled;
  } catch (err) {
    console.error("Error scheduling notification:", err);
    throw err;
  }
};

/**
 * Restore scheduled jobs on server restart
 * Call this inside server.js after DB connects
 */
export const restoreScheduledNotifications = async () => {
  try {
    const pending = await Notification.find({
      isScheduled: true,
      scheduledFor: { $gte: new Date() },
    });

    pending.forEach((notif) => {
      schedule.scheduleJob(
        notif._id.toString(),
        notif.scheduledFor,
        async () => {
          await sendNotification(notif.user, {
            type: notif.type,
            title: notif.title,
            message: notif.message,
            data: notif.data,
          });

          notif.isScheduled = false;
          notif.sentAt = new Date();
          await notif.save();
        }
      );
    });

    console.log(`✅ Restored ${pending.length} scheduled notifications`);
  } catch (err) {
    console.error("Failed to restore scheduled notifications:", err);
  }
};
