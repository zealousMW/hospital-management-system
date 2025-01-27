"use client";
import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangleIcon, AlertCircleIcon, InfoIcon, BellIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Notification {
  id: number;
  title: string;
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Critical Stock Alert",
      message: "Insulin stock is critically low (5 units remaining). Immediate reorder required.",
      severity: "high",
      timestamp: new Date()
    },
    {
      id: 2,
      title: "Low Stock Warning",
      message: "Paracetamol inventory below threshold (100 units). Please reorder soon.",
      severity: "medium",
      timestamp: new Date(Date.now() - 1000 * 60 * 30)
    },
    {
      id: 3,
      title: "Equipment Maintenance",
      message: "MRI Scanner maintenance due in 3 days. Schedule technician visit.",
      severity: "low",
      timestamp: new Date(Date.now() - 1000 * 60 * 60)
    },
    {
      id: 4,
      title: "Expiring Medicine Alert",
      message: "10 units of Amoxicillin will expire in 30 days.",
      severity: "medium",
      timestamp: new Date(Date.now() - 1000 * 60 * 120)
    }
  ]);

  const removeNotification = (id: number) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-4 border-red-600 bg-red-100 text-red-900';
      case 'medium':
        return 'border-l-4 border-amber-600 bg-amber-100 text-amber-900';
      case 'low':
        return 'border-l-4 border-blue-600 bg-blue-100 text-blue-900';
    }
  };

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircleIcon className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertTriangleIcon className="h-5 w-5 text-amber-600" />;
      case 'low':
        return <InfoIcon className="h-5 w-5 text-blue-600" />;
    }
  };

  const getRelativeTime = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes/60)}h ago`;
    return `${Math.floor(minutes/1440)}d ago`;
  };

  return (
    <div className="notifications-container p-4 w-full max-w-[600px]">
      <div className="flex items-center gap-2 mb-4">
        <BellIcon className="h-6 w-6 text-gray-700" />
        <h3 className="text-xl font-semibold text-gray-900">Notifications</h3>
        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {notifications.length}
        </span>
      </div>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            className={`${getSeverityStyles(notification.severity)} 
              p-4 rounded-lg shadow-sm hover:shadow-md transition-all border`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.severity)}
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <AlertTitle className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </AlertTitle>
                  <span className="text-xs text-gray-600">
                    {getRelativeTime(notification.timestamp)}
                  </span>
                </div>
                <AlertDescription className="text-sm mt-1 text-gray-700">
                  {notification.message}
                </AlertDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => removeNotification(notification.id)}
                className="text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-gray-300"
              >
                Dismiss
              </Button>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
