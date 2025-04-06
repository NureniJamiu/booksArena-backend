import Notification from "../models/Notification";

export const sendNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      userId: userId,
      message: message,
    });

    await notification.save();
  } catch (error) {
    console.error("Error sending notification", error);
  }
};
