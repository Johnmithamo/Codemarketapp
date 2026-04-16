import React from "react";
import "./style.css";
export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 md:p-10">

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Terms and Conditions
        </h1>

        <p className="text-sm text-gray-600 mb-6">
          <strong>Effective Date:</strong> [Insert Date]
          <br />
          <strong>Platform:</strong> Code Market
          <br />
          <strong>Developer:</strong> John Mithamo
        </p>

        <Section title="1. Introduction">
          Code Market is a freelance marketplace built for Kenyan developers,
          connecting them with clients locally and globally. By using this platform,
          you agree to these Terms and Conditions.
        </Section>

        <Section title="2. Eligibility">
          You must be at least 18 years old to use Code Market. All users must provide
          accurate and truthful information when creating an account.
        </Section>

        <Section title="3. Platform Role">
          Code Market acts only as an intermediary between buyers and sellers.
          We do not directly provide any services listed on the platform.
        </Section>

        <Section title="4. User Accounts">
          <List items={[
            "You are responsible for your account security",
            "Do not share your login details",
            "We may suspend accounts that violate rules"
          ]} />
        </Section>

        <Section title="5. Services and Transactions">
          <List items={[
            "Sellers must accurately describe their services",
            "Buyers must review details before ordering",
            "Both parties must complete agreed tasks",
            "All communication should stay on the platform"
          ]} />
        </Section>

        <Section title="6. Payments (Kenya Focus)">
          <List items={[
            "Payments may be made via M-Pesa or other supported methods",
            "Platform commission may apply",
            "Payments may be held until order completion",
            "Withdrawals may require verification"
          ]} />
        </Section>

        <Section title="7. Prohibited Activities">
          <List items={[
            "Fraud or scam behavior",
            "Off-platform payments",
            "Posting illegal or harmful content",
            "Abusing or harassing users"
          ]} />
        </Section>

        <Section title="8. Disputes">
          Code Market may review disputes and make final binding decisions based on evidence
          provided by both parties.
        </Section>

        <Section title="9. Intellectual Property">
          Users retain ownership of their work but grant Code Market permission to display
          their content for platform use and promotion.
        </Section>

        <Section title="10. Account Termination">
          We reserve the right to suspend or permanently ban accounts that violate these terms,
          engage in fraud, or harm other users.
        </Section>

        <Section title="11. Limitation of Liability">
          Code Market is not responsible for:
          <List items={[
            "Losses from user interactions",
            "Failed service delivery",
            "Technical issues or downtime"
          ]} />
        </Section>

        <Section title="12. Governing Law">
          These Terms are governed by the laws of Kenya.
        </Section>

        <Section title="13. Contact Information">
          <p>Email: <span className="text-blue-600">mithamojohn42@gmail.com</span></p>
          <p>Phone: 0743589922</p>
        </Section>

        <p className="mt-6 text-sm text-gray-500">
          By using Code Market, you agree to these Terms and Conditions.
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