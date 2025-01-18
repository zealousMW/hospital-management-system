import React from 'react';
import { AlertCircle, UserPlus, Syringe, BedDouble, ArrowRightLeft, ClipboardList } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const RecentActivities = () => {
  const activities = [
    {
      id: 1,
      time: '10:45 AM',
      action: 'New patient admitted to Ward A',
      type: 'admission',
      priority: 'normal',
      user: 'Dr. Smith',
      icon: UserPlus
    },
    {
      id: 2,
      time: '10:30 AM',
      action: 'Emergency patient transferred to Surgery',
      type: 'critical',
      priority: 'high',
      user: 'Dr. Johnson',
      icon: AlertCircle
    },
    {
      id: 3,
      time: '10:15 AM',
      action: 'Medication administered to patient #1234',
      type: 'treatment',
      priority: 'normal',
      user: 'Dr. Wilson',
      icon: Syringe
    },
    {
      id: 4,
      time: '10:00 AM',
      action: 'Bed 105 marked for maintenance',
      type: 'facility',
      priority: 'low',
      user: 'Facility Staff',
      icon: BedDouble
    },
    {
      id: 5,
      time: '09:45 AM',
      action: 'Department referral for Patient #5678',
      type: 'referral',
      priority: 'normal',
      user: 'Dr. Brown',
      icon: ArrowRightLeft
    }
  ];

  const getActivityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-100';
      case 'normal':
        return 'bg-blue-50 border-blue-100';
      case 'low':
        return 'bg-gray-50 border-gray-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getIconStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'normal':
        return 'text-blue-500';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <ScrollArea className="h-[325px] pr-4">
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className={`flex items-start space-x-4 p-3 rounded-lg border ${getActivityStyle(activity.priority)} transition-colors duration-200 hover:bg-opacity-80`}
            >
              <div className={`flex-shrink-0 ${getIconStyle(activity.priority)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {activity.time}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs text-gray-600">
                    {activity.user}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default RecentActivities;