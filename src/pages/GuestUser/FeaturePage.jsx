import React from "react";
import { useNavigate } from "react-router-dom";

export default function FeaturePage() {
  const link = useNavigate();
  return (
    <div className="flex flex-col pt-16 sm:pt-20 items-center w-full bg-gray-50 dark:bg-gray-900 text-primary dark:!text-gray-100 transition-colors duration-300">
      {/* Hero Section */}
      <section className="w-full max-w-7xl flex flex-col-reverse md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
        <div className="max-w-xl space-y-4 sm:space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            Workspace
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
            Create and manage workspaces, control visibility, and organize
            projects effortlessly with TaskFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
            <button
              onClick={() => link("/login")}
              className="px-6 py-3 bg-primary hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition text-sm sm:text-base"
            >
              Try it for Free!
            </button>
          </div>
        </div>
        <div className="mb-8 sm:mb-10 md:mb-0 flex justify-center">
          <img
            src="/assets/home/feature1.png"
            alt="Workspace Illustration"
            className="w-56 sm:w-72 md:w-96 lg:w-[28rem] drop-shadow-lg"
          />
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 gap-8 sm:gap-12">
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/assets/home/feature2.png"
            alt="Dashboard Preview"
            className="rounded-xl shadow-lg w-64 sm:w-80 md:w-full max-w-md"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            Stay organized with your personal Dashboard, where all your tasks,
            deadlines, and updates come together in one simple view — complete
            with quick stats to track progress at a glance.
          </p>
        </div>
      </section>

      {/* Project Management Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 gap-8 sm:gap-12">
        <div className="md:w-1/2 text-center md:text-left order-2 md:order-1 space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Project Management</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            Stay focused with dashboards, task lists, and timelines that keep
            your projects moving forward — without the chaos.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center order-1 md:order-2">
          <img
            src="/assets/home/feature3.png"
            alt="Project Management"
            className="rounded-xl shadow-lg w-64 sm:w-80 md:w-full max-w-md"
          />
        </div>
      </section>

      {/* Team Collaborators Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 gap-8 sm:gap-12">
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/assets/home/feature4.png"
            alt="Team Collaboration"
            className="rounded-xl shadow-lg w-64 sm:w-80 md:w-full max-w-md"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-left space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Team Collaborators</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            Add members to your workspace easily. Invite collaborators via
            email or shareable link, and assign specific roles to control access
            and permissions securely.
          </p>
        </div>
      </section>

      {/* Invite by Email Section */}
      <section className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 gap-8 sm:gap-12">
        <div className="md:w-1/2 text-center md:text-left order-2 md:order-1 space-y-3 sm:space-y-4 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold">Invite by Email</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
            Clear out small to-dos right from your Inbox and keep your progress
            moving forward — collaboration made simple.
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center order-1 md:order-2">
          <img
            src="/assets/home/feature5.png"
            alt="Invite by Email"
            className="rounded-xl shadow-lg w-64 sm:w-80 md:w-full max-w-md"
          />
        </div>
      </section>
    </div>
  );
}
