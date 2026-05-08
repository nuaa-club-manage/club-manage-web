import React from 'react';
import { Link } from 'react-router-dom';
import { mockClubs, mockActivities } from '../data/mockData';
import ClubCard from '../components/ClubCard';
import ActivityCard from '../components/ActivityCard';
import { ArrowRightIcon } from '../components/icons';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center text-center text-white -mt-16">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img src="https://picsum.photos/seed/hero/1920/1080" className="absolute inset-0 w-full h-full object-cover" alt="Community gathering"/>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4" style={{textShadow: '2px 2px 8px rgba(0,0,0,0.7)'}}>发现你的社群</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl mb-8" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.7)'}}>
            发现、加入并参与符合您热情的社团和活动。您的下一次冒险从这里开始。
          </p>
          <Link
            to="/clubs"
            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-lg transition-transform transform hover:scale-105"
          >
            立即探索社团
            <ArrowRightIcon className="w-6 h-6 ml-2" />
          </Link>
        </div>
      </section>

      {/* Featured Clubs Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">精选社团</h2>
            <Link to="/clubs" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center">
                <span>查看全部</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockClubs.slice(0, 4).map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>

      {/* Upcoming Activities Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">近期活动</h2>
            <Link to="/activities" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center">
                <span>查看全部</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockActivities.slice(0, 3).map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;