export const contactTemplate = (name: string) =>
  `<div
      style="
        background-color: #092730;
        max-width: 400px;
        padding: 20px;
        margin: 0 auto;
      "
    >
    <div style="text-align:center; width:100%;">
    <a href="https://luxafar.com/">
          <img loading="lazy" style="
          width: 120px;
          height: auto;
          margin: 0 auto;" 
          src="https://luxafar.com/template/logo.png" alt="" />
          </a>
    </div>
      <p
        style="
          margin-bottom: 15px;
          font-size: 13px;
          font-weight: 600;
          color: #A69769;
        "
      >
        Dear ${[name]}
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        Thank you for choosing Luxafar, where we celebrate the uniqueness of
        every journey. Your message has been received and is of great importance
        to us. Our team is currently reviewing your inquiry and will respond
        within 24 hours.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        Should you have any additional details to share, please feel free to
        reply to this email.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        At Luxafar, we firmly believe that there are no standard journeys, only
        extraordinary stories waiting to be written.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        We appreciate your interest in Luxafar and eagerly anticipate crafting
        your exceptional journey.
      </p>
      <p style="margin-bottom: 15px; font-size: 13px; color: #A69769;">
        Best Regards,
      </p>
      <p style="margin-bottom: 20px; font-size: 13px; color: #A69769;">
        Ghazal Sajid <br />CEO <br />Mobile No: +971552944761 <br />WhatsApp No:
        +442034682356 <br />www.luxafar.com
      </p>
      <div
        style="
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
          align-items: center;
        "
      >
        <a href="https://google.com">
          <img loading="lazy" style="width:10px;" src="https://luxafar.com//template/facebook.png" alt="" />
        </a>
        <a href="https://google.com">
          <img loading="lazy" style="width:19px; padding-left:10px;" src="https://luxafar.com//template/twitter.png" alt="" />
        </a>
        <a href="https://google.com">
          <img loading="lazy" style="width:16px; padding-left:10px; " src="https://luxafar.com//template/instagram.png" alt="" />
        </a>
      </div>
    </div>`;
