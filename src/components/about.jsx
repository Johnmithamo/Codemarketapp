import React from "react";
import "./style.css";
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          About Code Market
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          A freelance marketplace built for Kenyan developers
        </p>

        <Section title="🚀 Overview">
          Code Market is a digital freelance platform designed to connect Kenyan developers
          with clients who need software development, web design, mobile apps, and other tech services.
        </Section>

        <Section title="🎯 Mission">
          Our mission is to empower young developers in Kenya by giving them real opportunities
          to earn online, build experience, and grow their careers in tech.
        </Section>

        <Section title="👥 Who Uses Code Market">
          <List items={[
            "Developers – offer coding and tech services",
            "Clients – hire developers for projects",
            "Platform Admin – ensures safety and trust"
          ]} />
        </Section>

        <Section title="🛠️ Key Features">
          <List items={[
            "Developer profiles and portfolios",
            "Service listings (gigs)",
            "Search and discovery system",
            "Messaging between users",
            "Order tracking system",
            "Ratings and reviews",
            "M-Pesa payment support"
          ]} />
        </Section>

        <Section title="🇰🇪 Why Kenya Focus">
          <List items={[
            "High number of skilled young developers",
            "Strong mobile money ecosystem (M-Pesa)",
            "Growing demand for remote tech work",
            "Limited local freelance platforms"
          ]} />
        </Section>

        <Section title="🔐 Trust & Safety">
          We aim to build a safe environment through user reporting systems,
          dispute handling, and platform moderation tools.
        </Section>

        <Section title="🌍 Vision">
          To become the leading freelance marketplace in East Africa,
          enabling developers to compete globally while earning locally.
        </Section>

        <Section title="📞 Contact">
          <p>Email: <span className="text-blue-600">mithamojohn42@gmail.com</span></p>
          <p>Phone: 0743589922</p>
        </Section>

        <p className="mt-6 text-sm text-gray-500">
          Code Market — Built for Kenyan Developers, Powered by Opportunity.
        </p>

      </div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {title}
      </h2>
      <div className="text-gray-700 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

function List({ items }) {
  return (
    <ul className="list-disc ml-6 text-sm space-y-1">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}