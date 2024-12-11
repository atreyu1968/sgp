import React from 'react';
import { History } from 'lucide-react';

interface ActivityLog {
  action: string;
  device: string;
  location: string;
  date: string;
}

interface ActivitySectionProps {
  recentActivity: ActivityLog[];
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ recentActivity }) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <History className="text-gray-400" size={20} />
        <h3 className="text-base font-medium text-gray-900">Actividad reciente</h3>
      </div>

      <div className="space-y-4">
        {recentActivity.map((activity, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-t border-gray-100 first:border-t-0"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500">
                {activity.device} • {activity.location}
              </p>
            </div>
            <span className="text-sm text-gray-500">{activity.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySection;