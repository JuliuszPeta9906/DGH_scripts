import { config } from "dotenv";
import { DOMParser } from "xmldom";
import fs from "fs";
config();

const imagesURLs = fs
  .readFileSync("./eBay-upload-img/images.txt", "utf8") // read the file to string
  .split(/\r\n/) // split the string to string[] on "\n"
  .filter((url) => url.trim() !== ""); // filter empty lines

(async () => {
  const responses = await Promise.all(
    imagesURLs.map((url) => {
      const body = `<?xml version="1.0" encoding="utf-8"?>
<UploadSiteHostedPicturesRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
    <eBayAuthToken>${process.env.EBAY_AUTH_TOKEN}</eBayAuthToken>
  </RequesterCredentials>
  <ErrorLanguage>en_US</ErrorLanguage>
  <WarningLevel>High</WarningLevel>
  <ExternalPictureURL>${url}</ExternalPictureURL>
  <PictureName>Developer Page Banner</PictureName>
</UploadSiteHostedPicturesRequest>
`;

      return fetch("https://api.ebay.com/ws/api.dll", {
        method: "POST",
        headers: {
          "Content-Type": "text/xml", // Specify that you are sending XML data
          "X-EBAY-API-COMPATIBILITY-LEVEL": "967",
          "X-EBAY-API-SITEID": "77",
          "X-EBAY-API-CALL-NAME": "UploadSiteHostedPictures",
        },
        body,
      });
    })
  );

  const data = await Promise.all(responses.map((res) => res.text()));
  const parser = new DOMParser();

  const results = data.map((res) => {
    const xmlDoc = parser.parseFromString(res, "text/xml");
    const tag = xmlDoc.getElementsByTagName("MemberURL")[0];

    if (!!tag?.textContent) return tag?.textContent;

    // return xmlDoc.getElementsByTagName("LongMessage")[0]?.textContent;
    return res;
  });

  fs.writeFileSync("./eBay-upload-img/output.txt", results.join("\n"));
})();
