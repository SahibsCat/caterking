import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Policies = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto bg-richBlack border border-white/10 p-8 rounded-2xl shadow-xl space-y-16">
        
        {/* Privacy Policy */}
        <section id="privacy-policy" className="scroll-mt-32">
          <h2 className="text-3xl font-playfair font-bold text-tan mb-6">Privacy Policy</h2>
          <div className="space-y-4 text-gray-300 font-inter leading-relaxed">
            <p>This privacy policy sets out how Cater King uses and protects any information that you give Cater King when you use this website. Cater King is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement. Cater King may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes</p>
            <h3 className="text-xl text-white mt-4 font-semibold">We may collect the following information:</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name and job title</li>
              <li>Contact information including email address</li>
              <li>Demographic information such as postcode, preferences and interests</li>
              <li>Other information relevant to customer surveys and/or offers</li>
            </ul>
            <h3 className="text-xl text-white mt-4 font-semibold">What we do with the information we gather:</h3>
            <p>We require this information to understand your needs and provide you with a better service, and in particular for the following reasons:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Internal record keeping.</li>
              <li>We may use the information to improve our products and services.</li>
              <li>We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided.</li>
              <li>From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.</li>
            </ul>
            <p>We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.</p>
            <h3 className="text-xl text-white mt-4 font-semibold">How we use cookies:</h3>
            <p>A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyses web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.</p>
            <p>We use traffic log cookies to identify which pages are being used. This helps us analyses data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.</p>
            <p>Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.</p>
            <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.</p>
            <h3 className="text-xl text-white mt-4 font-semibold">Controlling your personal information:</h3>
            <p>We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen.</p>
            <p>If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible, at the above address. We will promptly correct any information found to be incorrect.</p>
          </div>
        </section>

        {/* Cancellation & Modification Policy */}
        <section id="cancellation-policy" className="scroll-mt-32">
          <h2 className="text-3xl font-playfair font-bold text-tan mb-6">Cancellation & Modification Policy</h2>
          <div className="space-y-4 text-gray-300 font-inter leading-relaxed">
            <p>An order placed by the customer can be cancelled only if the request is made at least 24 hours prior to the scheduled delivery time. As all orders are prepared with a minimum 48-hour processing and delivery window, cancellation requests made within 24 hours of delivery will not be accepted.</p>
            <p>Any eligible refund will be processed within 7 working days to the customer’s original mode of payment.</p>
            <p>Customers can modify their orders only if the request is made at least 24 hours prior to the scheduled delivery time. Modification requests made within 24 hours of delivery will not be accepted due to preparation constraints.</p>
            <p>For Cancellation and modification, please contact Cater King customer Care at 054 3344555</p>
          </div>
        </section>

        {/* Refund Policy */}
        <section id="refund-policy" className="scroll-mt-32">
          <h2 className="text-3xl font-playfair font-bold text-tan mb-6">Refund Policy</h2>
          <div className="space-y-4 text-gray-300 font-inter leading-relaxed">
            <p>An order placed by the customer can be cancelled only if the request is made at least 24 hours prior to the scheduled delivery time. As all orders are prepared with a minimum 48-hour processing and delivery window, cancellation requests made within 24 hours of delivery will not be accepted.</p>
            <p>Any eligible refund will be processed within 7 working days to the customer’s original mode of payment.</p>
            <p>For Cancellation and modification, please contact Cater King customer Care at 054 3344555</p>
          </div>
        </section>

        {/* Shipping & Delivery Policy */}
        <section id="shipping-policy" className="scroll-mt-32">
          <h2 className="text-3xl font-playfair font-bold text-tan mb-6">Shipping & Delivery Policy</h2>
          <div className="space-y-4 text-gray-300 font-inter leading-relaxed">
            <p>Delivery times are estimated and may vary depending on various factors, including but not limited to, traffic conditions and weather.</p>
            <p>We will make reasonable efforts to ensure timely delivery, but shall not be liable for any delays.</p>
            <p>Users agree to provide accurate delivery information when placing orders.</p>
          </div>
        </section>

        {/* Terms and Conditions / Terms of Service */}
        <section id="terms-of-service" className="scroll-mt-32">
          <h2 className="text-3xl font-playfair font-bold text-tan mb-6">Terms of Service / Terms & Conditions</h2>
          <div className="space-y-4 text-gray-300 font-inter leading-relaxed">
            <p>The Website Owner, including subsidiaries and affiliates (“Website” or “Website Owner” or “we” or “us” or “our”), provides the information contained on the website or any of the pages comprising the website (“website”) to visitors (“visitors”) (cumulatively referred to as “you” or “your” hereinafter) subject to the terms and conditions set out in these website terms and conditions, the privacy policy and any other relevant terms and conditions, policies and notices which may be applicable to a specific section or module of the website.</p>
            
            <h3 className="text-xl text-white mt-4 font-semibold">1. Use of the Website</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>1.1. The Website is intended for personal, non-commercial use only.</li>
              <li>1.2. Users must be 18 years or older to use the Website. By using the Website, you represent that you are at least 18 years of age.</li>
              <li>1.3. Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their account. Users agree to accept responsibility for all activities that occur under their account or password.</li>
            </ul>

            <h3 className="text-xl text-white mt-4 font-semibold">2. Ordering</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>2.1. Users may place orders for food from the menu listed on the Website.</li>
              <li>2.2. Prices and availability of items are subject to change without notice.</li>
              <li>2.3. Users agree to provide accurate and current information when placing orders.</li>
              <li>2.4. Users are solely responsible for any consequences resulting from the selection and purchase of food items on the Website.</li>
            </ul>

            <h3 className="text-xl text-white mt-4 font-semibold">3. Payments</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>3.1. Payment for orders can be made using the payment methods accepted by the Website.</li>
              <li>3.2. All payments are processed securely. The Website does not store credit card details.</li>
              <li>3.3. Users are responsible for any charges incurred from their payment method.</li>
            </ul>
            <p>We as a merchant shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.</p>

            <h3 className="text-xl text-white mt-4 font-semibold">4. Intellectual Property</h3>
            <p>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p>
            <p>All trademarks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.</p>
            <p>Unauthorized use of this website may give rise to a claim for damages and/or be a criminal offense. From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. You may not create a link to this website from another website or document without Cater King LLC's prior written consent.</p>

            <h3 className="text-xl text-white mt-4 font-semibold">5. Disclaimer</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>5.1. The Website is provided on an "as is" and "as available" basis without any representations or warranties, express or implied.</li>
              <li>5.2. The Website does not guarantee the accuracy, completeness, or reliability of any content or information provided on the Website.</li>
            </ul>

            <h3 className="text-xl text-white mt-4 font-semibold">6. Limitation of Liability</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>6.1. To the fullest extent permitted by law, the Website shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, or goodwill.</li>
              <li>6.2. In no event shall the total liability of the Website exceed the amount paid by the User for the services provided.</li>
            </ul>

            <h3 className="text-xl text-white mt-4 font-semibold">7. Governing Law</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>7.1. These Terms and Conditions shall be governed by and construed in accordance with the laws of the United Arab Emirates.</li>
            </ul>

            <h3 className="text-xl text-white mt-4 font-semibold">8. Changes to Terms and Conditions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>8.1. The Website reserves the right to modify or replace these Terms and Conditions at any time. Users are responsible for regularly reviewing these Terms and Conditions.</li>
            </ul>
            <p>By using the Website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use the Website.</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Policies;
