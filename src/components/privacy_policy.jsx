import React from "react";
import "./style.css";
export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy for Code Market
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> [Insert Date]
          <br />
          <strong>Developer:</strong> John Mithamo
          <br />
          <strong>Email:</strong> mithamojohn42@gmail.com
        </p>

        <Section title="1. Introduction">
          Welcome to Code Market, a freelance marketplace that connects buyers and sellers of coding services.
          We are committed to protecting your personal data and your privacy. By using Code Market, you agree
          to this Privacy Policy.
        </Section>

        <Section title="2. Information We Collect">
          <SubTitle>a) Personal Information</SubTitle>
          <List items={["Full name", "Email address", "Phone number", "Profile photo"]} />

          <SubTitle>b) Account & Profile Data</SubTitle>
          <List items={["Skills and expertise", "Portfolio information", "Services created (gigs)", "Reviews and ratings"]} />

          <SubTitle>c) Communication Data</SubTitle>
          <List items={["Messages between users", "Chat history and attachments"]} />

          <SubTitle>d) Transaction & Payment Data</SubTitle>
          <List items={[
            "M-Pesa transaction details via Daraja API",
            "Transaction reference codes",
            "Payment status and history"
          ]} />

          <p className="mt-2 text-sm text-red-500">
            We do NOT store sensitive data such as M-Pesa PINs.
          </p>

          <SubTitle>e) Usage Data</SubTitle>
          <List items={["Search activity", "Clicks", "Service interactions"]} />
        </Section>

        <Section title="3. How We Use Your Information">
          <List items={[
            "Create and manage accounts",
            "Connect buyers with freelancers",
            "Enable communication",
            "Process payments",
            "Show profiles and reviews",
            "Improve platform performance",
            "Prevent fraud"
          ]} />
        </Section>

        <Section title="4. Messaging & User Interaction">
          Users communicate through in-app messaging. We monitor interactions to ensure safety,
          prevent scams, and resolve disputes.
        </Section>

        <Section title="5. Authentication and Security">
          We use JWT authentication, HTTPS encryption, and secure MongoDB storage. While we apply
          strong security measures, no system is 100% secure.
        </Section>

        <Section title="6. Data Storage">
          Data is stored securely in MongoDB. We protect against unauthorized access, loss, and misuse.
        </Section>

        <Section title="7. Data Sharing">
          We do NOT sell user data. We may share limited data with:
          <List items={[
            "Safaricom M-Pesa (Daraja API) for payments",
            "Render hosting services",
            "Legal authorities when required"
          ]} />
        </Section>

        <Section title="8. User Rights">
          <List items={[
            "Access your data",
            "Edit or update profile",
            "Request account deletion",
            "Request data removal"
          ]} />
          <p className="mt-2 font-medium">
            Contact: mithamojohn42@gmail.com
          </p>
        </Section>

        <Section title="9. Data Retention">
          We retain data only as long as needed to provide services, comply with laws,
          and resolve disputes.
        </Section>

        <Section title="10. Public Information">
          Some data is public, including profile name, photo, services, reviews, and ratings.
        </Section>

        <Section title="11. Age Restriction">
          Code Market is strictly for users aged 18 and above.
        </Section>

        <Section title="12. Third-Party Services">
          We use:
          <List items={[
            "Safaricom M-Pesa (Daraja API)",
            "Render hosting platform"
          ]} />
        </Section>

        <Section title="13. Changes to Policy">
          We may update this policy at any time. Changes take effect immediately after posting.
        </Section>

        <Section title="14. Contact Us">
          <p>Email: <span className="text-blue-600">mithamojohn42@gmail.com</span></p>
        </Section>

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

function SubTitle({ children }) {
  return (
    <h3 className="font-medium text-gray-800 mt-3 mb-1">
      {children}
    </h3>
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