export const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - Trundle</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #F5F6F9;
    }

    .header {
      background: linear-gradient(135deg, #7F4DFF 0%, #6f27ff 100%);
      color: white;
      padding: 60px 16px 16px 16px;
      position: relative;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .back-button {
      position: absolute;
      top: 60px;
      left: 16px;
      width: 30px;
      height: 30px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .back-button::before {
      content: "←";
      color: white;
      font-size: 18px;
      font-weight: bold;
    }

    .header-title {
      font-size: 30px;
      font-weight: 700;
      margin-top: 20px;
      margin-bottom: 23px;
    }

    .content {
      background-color: #F5F6F9;
      padding: 20px 16px 100px 16px;
    }

    .section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .section-subtitle {
      font-size: 14px;
      margin-top: 8px;
      color: #000000;
      font-weight: 500;
      margin-bottom: 8px;
    }

    .section-description {
      font-size: 14px;
      color: rgb(102, 102, 102);
      line-height: 20px;
      font-weight: 400;
      text-align: justify;
      margin-bottom: 8px;
    }

    .section-description:last-child {
      margin-bottom: 0;
    }

    .list-container {
      margin-top: 8px;
    }

    .list-item {
      display: flex;
      align-items: flex-start;
      margin-top: 8px;
      margin-left: 16px;
    }

    .list-arrow {
      color: rgb(102, 102, 102);
      margin-right: 8px;
      margin-top: 6px;
      opacity: 0.7;
      font-size: 10px;
    }

    .list-text {
      font-size: 14px;
      color: rgb(102, 102, 102);
      flex: 1;
      line-height: 20px;
      font-weight: 400;
      text-align: justify;
    }

    .link {
      color: #6f27ff;
      text-decoration: underline;
      cursor: pointer;
    }

    .link:hover {
      color: #5a1fd9;
    }

    .last-updated {
      font-size: 13px;
      color: #000000;
      opacity: 0.5;
      font-weight: 400;
      margin-bottom: 16px;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .header {
        padding: 40px 16px 16px 16px;
        min-height: 160px;
      }

      .header-title {
        font-size: 24px;
      }

      .content {
        padding: 16px 12px 80px 12px;
      }

      .section-title {
        font-size: 15px;
      }

      .section-description {
        font-size: 13px;
      }
    }

    @media (max-width: 480px) {
      .header {
        padding: 30px 12px 12px 12px;
        min-height: 140px;
      }

      .header-title {
        font-size: 20px;
      }

      .content {
        padding: 12px 8px 60px 8px;
      }
    }
  </style>
</head>

<body>
  <div class="content">
    <div class="section">
      <h2 class="section-title">Introduction</h2>
      <p class="section-description">
        Welcome to Tabibito Technologies Private Limited ('We', 'Us', 'Our'). We respect your privacy and want to
        protect your personal information. This Privacy Policy explains how we collect, store, and use your personal
        information when you use our website <a href="https://trundle.me" class="link"
          target="_blank">https://trundle.me</a> and our mobile application, which'll soon be available on Google Play
        Store and Apple Store, collectively referred to as 'Services'. Please read this Privacy Policy and understand it
        before using our Services.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Information We Collect</h2>
      <p class="section-subtitle">We may collect the following types of information:</p>
      <div class="list-container">
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">Personal Identification Information: Name, email address, phone number, and
            address.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">Travel Information: Your travel preferences, booking details, passport details,
            dietary requirements and any other information necessary for fulfilling your travel arrangements.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">Payment Information: Credit/debit card details and billing address.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">Technical Data: Information about your device, IP address, operating system, and
            browser type.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">Usage Data: Information about how you use our Services.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">Marketing and Communications Data: Your preferences in receiving marketing from us and
            your communication preferences.</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">How We Use Your Information</h2>
      <p class="section-subtitle">We use the information we collect from you in various ways, including:</p>
      <div class="list-container">
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">To provide and manage your travel bookings.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">To process transactions.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">To personalize your experience and to allow us to deliver the type of content and
            product offerings in which you are most interested.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">To send periodic emails regarding your travel plans, itineraries, or other products
            and services.</span>
        </div>
        <div class="list-item">
          <span class="list-arrow">→</span>
          <span class="list-text">To follow up with you after correspondence (live chat, email, or phone
            inquiries).</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Sharing Your Information</h2>
      <p class="section-description">
        We do not sell, trade, or otherwise transfer to outside parties your Personal Identification Information unless
        we provide users with advance notice. This does not include website hosting partners and other parties who
        assist us in operating our Services, conducting our business, or serving our users, so long as those parties
        agree to keep this information confidential.
      </p>
      <p class="section-description">
        We may also release information when its release is appropriate to comply with the law, enforce our site
        policies, or protect ours or others' rights, property or safety.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Data Security</h2>
      <p class="section-description">
        We have implemented appropriate security measures to prevent your personal data from being accidentally lost,
        used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those
        employees, agents, contractors, and other third parties who have a business need to know.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Cookies</h2>
      <p class="section-description">
        Our Services use 'Cookies' to identify the areas of our Services that you have visited. We use Cookies to
        personalize the Content that you see on our Services. Most web browsers can be set to disable the use of
        Cookies.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Your Rights</h2>
      <p class="section-description">
        You are entitled to request details of the information we store about you and how we process it.
      </p>
      <p class="section-description">
        You also have the right to withdraw your consent at any time, ask us to rectify or delete your information, or
        oppose the processing of your personal data under certain circumstances.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Changes to This Privacy Policy</h2>
      <p class="section-description">
        We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for
        any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are
        effective immediately after they are posted on this page.
      </p>
    </div>

    <div class="section">
      <h2 class="section-title">Contact Us</h2>
      <p class="section-description">
        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a
          href="mailto:care@trundle.me" class="link">care@trundle.me</a>.
      </p>
    </div>

    <div class="last-updated" id="lastUpdated"></div>
  </div>

  <script>
    // Function to get current date in "Last updated: 19th August, 2025" format
    function getLastUpdatedDate() {
      const date = new Date();
      const day = date.getDate();
      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      // Helper to get ordinal suffix
      function ordinal(n) {
        if (n > 3 && n < 21) return n + 'th';
        switch (n % 10) {
          case 1: return n + "st";
          case 2: return n + "nd";
          case 3: return n + "rd";
          default: return n + "th";
        }
      }

      return \`Last updated: \${ordinal(day)} \${month}, \${year}\`;
    }

    // Set the last updated date when page loads
    document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('lastUpdated').textContent = getLastUpdatedDate();
    });
  </script>
</body>

</html>
`;