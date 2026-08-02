import { User, Building2 } from 'lucide-react';
import { ROLES } from '../../types/roles';

const ROLE_OPTIONS = [
    {
        value: ROLES.CANDIDATE,
        label: 'Candidate',
        description: 'I am looking for a job',
        icon: User,
    },
    {
        value: ROLES.RECRUITER,
        label: 'Recruiter',
        description: 'I am hiring talent',
        icon: Building2,
    },
];

export default function RoleSelector({ value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                I want to join as
            </label>
            <div className="grid grid-cols-2 gap-3">
                {ROLE_OPTIONS.map(({ value: roleValue, label, description, icon: Icon }) => {
                    const selected = value === roleValue;
                    return (
                        <button
                            key={roleValue}
                            type="button"
                            onClick={() => onChange(roleValue)}
                            className={`flex flex-col items-start gap-1 px-4 py-3 border rounded-lg bg-[#111] text-left transition-all ${
                                selected
                                    ? 'border-[#4F46E5] ring-1 ring-[#4F46E5]'
                                    : 'border-gray-800 hover:border-gray-600'
                            }`}
                        >
                            <Icon className={`w-5 h-5 ${selected ? 'text-[#4F46E5]' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-300'}`}>
                                {label}
                            </span>
                            <span className="text-xs text-gray-500">{description}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
