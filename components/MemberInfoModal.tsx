import React from 'react';
import Avatar from './Avatar';
import { XIcon } from './icons';

export interface PersonInfo {
  userId: string;
  userName?: string;
  realName?: string;
  school?: string;
  degree?: string;
  phoneNumber?: string;
  clubName?: string;
  role?: string;
}

interface MemberInfoModalProps {
  person: PersonInfo;
  onClose: () => void;
}

const MemberInfoModal: React.FC<MemberInfoModalProps> = ({ person, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-sm p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <XIcon className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <Avatar name={person.realName || person.userName || person.userId} size={72} className="mb-3" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {person.realName || person.userName || '未知'}
          </h3>
          {person.role && (
            <span className="mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
              {person.role}
            </span>
          )}
        </div>

        <div className="space-y-3 text-sm">
          <InfoRow label="学号" value={person.userId} />
          {person.userName && <InfoRow label="用户名" value={person.userName} />}
          {person.realName && <InfoRow label="真实姓名" value={person.realName} />}
          {person.school && <InfoRow label="学院" value={person.school} />}
          {person.degree && <InfoRow label="学历" value={person.degree} />}
          {person.phoneNumber && <InfoRow label="联系电话" value={person.phoneNumber} />}
          {person.clubName && <InfoRow label="所属社团" value={person.clubName} />}
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-gray-900 dark:text-white font-medium text-right ml-4">{value || '-'}</span>
    </div>
  );
}

export default MemberInfoModal;
