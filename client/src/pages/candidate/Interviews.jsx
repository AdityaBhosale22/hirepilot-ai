import React from 'react';
import CandidateLayout from '../../components/candidate/CandidateLayout';
import InterviewTimeline from '../../components/candidate/InterviewTimeline';

export default function Interviews() {
  return (
    <CandidateLayout title="Scheduled Interviews">
      <div className="max-w-4xl">
        <InterviewTimeline />
      </div>
    </CandidateLayout>
  );
}