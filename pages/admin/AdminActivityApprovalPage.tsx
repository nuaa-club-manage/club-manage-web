import React, { useState } from 'react';
import { mockPendingActivities } from '../../data/mockData';
import { CheckCircleIcon, XCircleIcon } from '../../components/icons';
import type { Activity } from '../../types';

const AdminActivityApprovalPage: React.FC = () => {
    const [pendingActivities, setPendingActivities] = useState<Activity[]>(mockPendingActivities);

    const handleApproval = (activityId: number, status: 'approved' | 'rejected') => {
        console.log(`Activity ${activityId} has been ${status}.`);
        setPendingActivities(prevActivities => prevActivities.filter(activity => activity.id !== activityId));
    };

    return (
        <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">活动发布审核</h1>
            {pendingActivities.length > 0 ? (
                <div className="space-y-6">
                    {pendingActivities.map(activity => (
                        <div key={activity.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center space-x-4">
                                <img src={activity.imageUrl} alt={activity.title} className="w-24 h-24 object-cover rounded-lg" />
                                <div>
                                    <h2 className="text-2xl font-bold">{activity.title}</h2>
                                    <p className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 mt-1">{activity.club}</p>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm max-w-lg">{activity.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{activity.date} @ {activity.time} - {activity.location}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 flex space-x-4">
                                <button
                                    onClick={() => handleApproval(activity.id, 'approved')}
                                    className="inline-flex items-center justify-center px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
                                >
                                    <CheckCircleIcon className="w-5 h-5 mr-2" />
                                    批准
                                </button>
                                <button
                                    onClick={() => handleApproval(activity.id, 'rejected')}
                                    className="inline-flex items-center justify-center px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
                                >
                                    <XCircleIcon className="w-5 h-5 mr-2" />
                                    拒绝
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                    <p className="text-xl text-gray-500 dark:text-gray-400">当前没有待审核的活动。</p>
                </div>
            )}
        </div>
    );
};

export default AdminActivityApprovalPage;