"use client";
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Notification {
  id: number;
  title: string;
  message: string;
}

const Notifications = () => {
  // Sample notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: "Info", message: "This is an info notification." },
    { id: 2, title: "Warning", message: "This is a warning notification." },
    { id: 3, title: "Error", message: "This is an error notification." },
  ]);

  // Remove notification by id
  const removeNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="notifications-container p-4 w-[300px] space-y-2">
      <h3 className="text-xl font-semibold">Notifications</h3>
      <div>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            variant={
              notification.title.toLowerCase() === "error"
                ? "destructive"
                : "default"
            }
            color="black"
            className="notification-item p-4 mt-4 rounded-lg shadow-md flex items-start space-x-4 bg-black-100 "
            style={{ width: "300%" }}
          >
            <AlertTriangleIcon />
            <div className="flex-grow">
              <AlertTitle className="text-lg font-medium">
                {notification.title}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {notification.message}
              </AlertDescription>
            </div>
            <Button
              size="sm"
              color="danger"
              onClick={() => removeNotification(notification.id)}
              className="ml-2"
            >
              Dismiss
            </Button>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
