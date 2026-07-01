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

  const sections = [
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      body: [
        'This privacy policy sets out how Cater Raja uses and protects any information that you give Cater Raja when you use this website. Cater Raja is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this website, and then you can be assured that it will only be used in accordance with this privacy statement. Cater Raja may change this policy from time to time by updating this page. You should check this page from time to time to ensure that you are happy with any changes.',
        'We may collect the following information: Name and job title, Contact information including email address, Demographic information such as postcode, preferences and interests, Other information relevant to customer surveys and/or offers.',
        'What we do with the information we gather: We require this information to understand your needs and provide you with a better service, and in particular for the following reasons: Internal record keeping. We may use the information to improve our products and services. We may periodically send promotional emails about new products, special offers or other information which we think you may find interesting using the email address which you have provided. From time to time, we may also use your information to contact you for market research purposes. We may contact you by email, phone, fax or mail. We may use the information to customise the website according to your interests.',
        'We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in suitable measures.',
        'How we use cookies: A cookie is a small file which asks permission to be placed on your computer\'s hard drive. Once you agree, the file is added and the cookie helps analyses web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes and dislikes by gathering and remembering information about your preferences.',
        'We use traffic log cookies to identify which pages are being used. This helps us analyses data about webpage traffic and improve our website in order to tailor it to customer needs. We only use this information for statistical analysis purposes and then the data is removed from the system.',
        'Overall, cookies help us provide you with a better website, by enabling us to monitor which pages you find useful and which you do not. A cookie in no way gives us access to your computer or any information about you, other than the data you choose to share with us.',
        'Controlling your personal information: We will not sell, distribute or lease your personal information to third parties unless we have your permission or are required by law to do so. We may use your personal information to send you promotional information about third parties which we think you may find interesting if you tell us that you wish this to happen. If you believe that any information we are holding on you is incorrect or incomplete, please write to or email us as soon as possible. We will promptly correct any information found to be incorrect.',
      ],
    },
    {
      id: 'cancellation-policy',
      title: 'Cancellation & Modification Policy',
      body: [
        'An order placed by the customer can be cancelled only if the request is made at least 24 hours prior to the scheduled delivery time. As all orders are prepared with a minimum 48-hour processing and delivery window, cancellation requests made within 24 hours of delivery will not be accepted.',
        'Any eligible refund will be processed within 7 working days to the customer’s original mode of payment.',
        'Customers can modify their orders only if the request is made at least 24 hours prior to the scheduled delivery time. Modification requests made within 24 hours of delivery will not be accepted due to preparation constraints.',
        'For Cancellation and modification, please contact Cater Raja customer Care at 054 3344555.',
      ],
    },
    {
      id: 'refund-policy',
      title: 'Refund Policy',
      body: [
        'An order placed by the customer can be cancelled only if the request is made at least 24 hours prior to the scheduled delivery time. As all orders are prepared with a minimum 48-hour processing and delivery window, cancellation requests made within 24 hours of delivery will not be accepted.',
        'Any eligible refund will be processed within 7 working days to the customer’s original mode of payment.',
        'For Cancellation and modification, please contact Cater Raja customer Care at 054 3344555.',
      ],
    },
    {
      id: 'shipping-policy',
      title: 'Shipping & Delivery Policy',
      body: [
        'Delivery times are estimated and may vary depending on various factors, including but not limited to, traffic conditions and weather.',
        'We will make reasonable efforts to ensure timely delivery, but shall not be liable for any delays.',
        'Users agree to provide accurate delivery information when placing orders.',
      ],
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      body: [
        'The Website is intended for personal, non-commercial use only. Users must be 18 years or older to use the Website.',
        'Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their account.',
        'Users may place orders for food from the menu listed on the Website. Prices and availability of items are subject to change without notice.',
        'Payment for orders can be made using the payment methods accepted by the Website. All payments are processed securely. The Website does not store credit card details.',
        'The Website is provided on an "as is" and "as available" basis without any representations or warranties, express or implied. The Website does not guarantee the accuracy, completeness, or reliability of any content.',
        'To the fullest extent permitted by law, the Website shall not be liable for any indirect, incidental, special, consequential, or punitive damages. In no event shall the total liability of the Website exceed the amount paid by the User for the services provided.',
        'These Terms and Conditions shall be governed by and construed in accordance with the laws of the United Arab Emirates.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#4A0000] px-4 pb-20 pt-28 text-white sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#2D0000] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.25)] sm:p-8 lg:p-10">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-tan">Policies & support</p>
          <h1 className="mt-3 text-3xl font-playfair font-bold sm:text-4xl">Clear terms, straightforward service, and dependable support.</h1>
          <p className="mt-4 text-sm leading-8 text-gray-300 sm:text-base">Everything you need to understand the booking experience, delivery expectations, and how we handle your information is outlined here.</p>
        </div>

        <div className="space-y-5">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-32 rounded-[24px] border border-white/10 bg-white/5 p-6">
              <h2 className="text-2xl font-playfair font-bold text-tan">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-7 text-gray-300">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Policies;
