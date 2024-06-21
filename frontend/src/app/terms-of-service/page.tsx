// Import necessary dependencies
import React from 'react';
import Link from 'next/link';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-[#FEFDF2] p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className='text-[#F2C94C] hover:underline mb-8 block'>
          ← Back
        </Link>
        <h1 className="text-4xl mb-6">Terms and Conditions</h1>
        <div className="space-y-6">
          <section>
            <p>Effective Date: 06/20/24</p>
          </section>
          <section>
            <h2 className="text-2xl ">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Achieve Arcade application and services, you agree to comply with and be bound by these Terms of Service and our Privacy Policy. If you do not agree with these terms, you should not use our services.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">2. Description of Service</h2>
            <p>
              Achieve Arcade is a gamified productivity app designed to help users manage their tasks, schedule, and goals in an engaging way. The app provides various features, including task tracking, scheduling, and reward systems to enhance productivity.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">3. Eligibility</h2>
            <p>
              You must be at least 13 years old to use Achieve Arcade. By using the app, you represent and warrant that you have the legal capacity to enter into a binding agreement.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">4. Account Registration</h2>
            <p>
              To use certain features of Achieve Arcade, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Provide accurate, current, and complete information during the registration process</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl ">5. User Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Use the app for any illegal or unauthorized purpose</li>
              <li>Interfere with or disrupt the app or servers connected to the app</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate any person or entity or falsely state or misrepresent your affiliation with a person or entity</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl ">6. Subscription and Payment</h2>
            <p>
              Some features of Achieve Arcade may require a subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Pay the subscription fees and any applicable taxes</li>
              <li>Provide valid payment information</li>
              <li>Comply with any additional terms and conditions provided during the subscription process</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl ">7. Cancellation and Refunds</h2>
            <p>
              You may cancel your subscription at any time. Upon cancellation, you will retain access to the subscribed features until the end of the current billing period. Refunds are subject to our refund policy and will be provided at our sole discretion.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">8. Intellectual Property</h2>
            <h3 className="text-xl ">8.1 Proprietary Rights</h3>
            <p>
              All content, features, and functionality of Achieve Arcade, including but not limited to text, graphics, logos, and software, are the exclusive property of Achieve Arcade and are protected by intellectual property laws. You may not use, reproduce, or distribute any content from the app without our prior written permission.
            </p>
            <h3 className="text-xl ">8.2 Third-Party Graphics</h3>
            <p>
              The graphics and images used in Achieve Arcade, other than our logo, are sourced from third-party creators and are licensed under the Creative Commons 4.0 license. These graphics are not the proprietary property of Achieve Arcade. You must adhere to the terms of the Creative Commons 4.0 license when using or sharing these graphics. More information about the Creative Commons 4.0 license can be found at <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" className="text-[#F2C94C] hover:underline">https://creativecommons.org/licenses/by/4.0/</a>.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the app at our sole discretion, without notice or liability, for any reason, including if you violate these Terms of Service. Upon termination, your right to use the app will immediately cease.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">10. Disclaimers and Limitation of Liability</h2>
            <p>
              Achieve Arcade is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the app will be uninterrupted or error-free. 
              To the fullest extent permitted by law, Achieve Arcade disclaims all warranties, express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            <p>
              In no event shall Achieve Arcade be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Your use of or inability to use the app</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from the app</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl ">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Achieve Arcade and its affiliates, officers, agents, employees, and partners from any claims, liabilities, damages, losses, and expenses, including 
              reasonable attorney&apos;s fees, arising out of or in any way connected with your use of the app, your violation of these Terms of Service, or your violation of any rights of another.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">12. Governing Law</h2>
            <p>
              These Terms of Service and your use of Achieve Arcade shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law principles.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">13. Changes to Terms</h2>
            <p>
              We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms of Service on this page and updating the effective date. You are advised to review these Terms of Service periodically for any changes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl ">14. Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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

export default TermsOfService;
