// Import necessary dependencies
import React from 'react';
import Link from 'next/link';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-[#FEFDF2] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className='text-[#F2C94C] hover:underline mb-8 block'>
          ← Back
        </Link>
        <h1 className="text-4xl  mb-6">Privacy Policy</h1>
        <div className="space-y-6">
          <section>
            <p>Effective Date: 06/20/24</p>
          </section>
          <section>
            <h2 className="text-2xl ">1. Introduction</h2>
            <p>
              Welcome to Achieve Arcade. Achieve Arcade is a gamified productivity app designed to help you manage your tasks, schedule, and goals in a fun and engaging way. Your privacy is important to us, and we are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application and services.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">2. Information We Collect</h2>
            <h3 className="text-xl ">2.1 Personal Information</h3>
            <p>
              We may collect personal information that you provide directly to us, such as:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Name</li>
              <li>Email address</li>
              <li>Username</li>
              <li>Password</li>
              <li>Timezone</li>
            </ul>
            <h3 className="text-xl ">2.2 Usage Data</h3>
            <p>
              When you use Achieve Arcade, we may automatically collect information about how you access and use the app, including:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Device information (e.g., device type, operating system)</li>
              <li>Log information (e.g., IP address, access times, pages viewed)</li>
              <li>Usage information (e.g., features used, interactions)</li>
            </ul>
            <h3 className="text-xl ">2.3 Cookies and Tracking Technologies</h3>
            <p>
              We may use cookies and similar tracking technologies to track activity on our app and hold certain information. Cookies are files with a small amount of data that are stored on your device.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">3. How We Use Your Information</h2>
            <p>
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>To provide and maintain our services</li>
              <li>To personalize your experience</li>
              <li>To manage your account and provide customer support</li>
              <li>To send you updates, notifications, and promotional materials</li>
              <li>To analyze usage patterns and improve our services</li>
              <li>To enforce our terms and conditions and protect our legal rights</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl ">4. Sharing Your Information</h2>
            <p>
              We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>With service providers who assist us in operating our app and providing our services</li>
              <li>To comply with legal obligations or respond to lawful requests</li>
              <li>To protect our rights, property, or safety, or that of our users or the public</li>
              <li>In connection with a business transaction, such as a merger, acquisition, or asset sale</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl ">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">6. Your Choices</h2>
            <h3 className="text-xl ">6.1 Access and Update</h3>
            <p>
              You have the right to access, update, or delete your personal information at any time by logging into your account or contacting us.
            </p>
            <h3 className="text-xl ">6.2 Opt-Out</h3>
            <p>
              You may opt out of receiving promotional emails from us by following the unsubscribe instructions provided in those emails. Please note that you may still receive non-promotional emails from us, such as those about your account or ongoing business relations.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">7. Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">8. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <address className="not-italic">
              Achieve Arcade<br />
              Email: <a href="mailto:derrick@achievearcade.com" className="text-[#F2C94C] hover:underline">derrick@achievearcade.com</a>
            </address>
          </section>
          <section>
            <p>Last updated on 06/20/24.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
