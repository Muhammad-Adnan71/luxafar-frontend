export const bespokeTemplate = (
  name: string,
  email: string,
  countryCode: string,
  phoneNumber: string,
  preferredCountry: string,
  tripDays: string,
  form: any
) => `  <div
      style="
        background-color: #092730;
        max-width: 500px;
        padding: 20px;
        margin: 0 auto;
      "
    >
      <div style="text-align: center; width: 100%">
        <a href="https://luxafar.com/">
          <img
            style="width: 120px; height: auto; margin: 0 auto"
            src="https://luxafar.com/template/logo.png"
            alt=""
          />
        </a>
      </div>
      <div>
        <p style="margin:0;margin-bottom: 5px; font-size: 13px; color: #ffffff">
          Name:
          <strong style="color: #a69769; text-transform: capitalize"
            >${[name]}</strong
          >
        </p>
        <p
          style="margin:0;margin-bottom: 5px; font-size: 13px; color: #ffffff !important"
        >
          Email:
          <strong style="color: #a69769 !important">${[email]}</strong>
        </p>
        <p style="margin:0;margin-bottom: 5px; font-size: 13px; color: #ffffff">
          Phone:
          <strong style="color: #a69769; text-transform: capitalize"
            >${[countryCode]}${[phoneNumber]}</strong
          >
        </p>
        <p style="margin:0;margin-bottom: 5px; font-size: 13px; color: #ffffff">
          Preferred Country:
          <strong style="color: #a69769; text-transform: capitalize"
            >${[preferredCountry]}</strong
          >
        </p>
        <p style="margin:0;margin-bottom: 5px; font-size: 13px; color: #ffffff">
          Trip Length:
          <strong style="color: #a69769; text-transform: capitalize"
            >${[tripDays]}</strong
          >
        </p>
      </div>
      <div style="margin:0; margin-top:20px;">
        ${form.bespokeFormQuestionAndAnswer.map(
          (item: any) => `
        <div style="border-bottom: 1px solid #a69769;padding-bottom:5px">
          <div style="margin: 0;">
            <p style="margin: 0; font-size: 13px; color: #a69769">
              <strong style="color: #ffffff">Question: </strong>${
                item?.BespokeQuestion?.question
              }
            </p>
            <p style="margin: 0; font-size: 13px; color: #a69769">
              <strong style="color: #ffffff">Answer: </strong>${item?.answer}
            </p>
          </div>
        
            ${
              item?.additionalText
                ? `
            <p
              style="
                margin: 0;
                font-size: 13px;
                color: #a69769;
              "
            >
              <strong style="color: #ffffff">Additional Notes: </strong>${[
                item?.additionalText,
              ]}
            </p>
            `
                : ""
            }
          
        </div>
        `
        )}
      </div>
      <div
        style="
        margin:0;
        margin-top:20px;
          display: flex;
          gap: 20px;
          margin-bottom: 10px;
          align-items: center;
        "
      >
        <a style="color:inherit" href="https://google.com">
          <img
            style="width: 10px"
            src="https://luxafar.com/template/facebook.png"
            alt=""
          />
        </a>
        <a style="color:inherit" href="https://google.com">
          <img
            style="width: 19px; padding-left: 10px"
            src="https://luxafar.com/template/twitter.png"
            alt=""
          />
        </a>
        <a style="color:inherit" href="https://google.com">
          <img
            style="width: 16px; padding-left: 10px"
            src="https://luxafar.com/template/instagram.png"
            alt=""  
          />
        </a>
      </div>
    </div>`;
