// _utils/puppeteerRunner.ts
import puppeteer from "puppeteer";

export async function runPuppeteerTask(url: string): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"], // useful for Docker or some environments
  });

  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: 0,
  });

  // Wait for the dynamic content to load
  await page.waitForSelector(".infinite-scroll-component__outerdiv", {
    timeout: 10000, // 10 seconds max
  });

  // Extract the HTML of the target div
  const content = await page.$eval(
    ".infinite-scroll-component__outerdiv",
    (el) => el.outerHTML
  );

  await browser.close();
  // try{
  //   const response = await fetch(
  //     "https://ikoncloud-dev.keross.com/aiagent/webhook-test/11751fe8-7c86-49aa-b7f4-d73df60f4258",
  //     {
  //       method: "POST", // Specify the request method
  //       headers: {
  //         "Content-Type": "application/json", // Indicate the data format
  //       },
  //       body: JSON.stringify({
  //         // Convert the data to JSON
  //         data: content,
  //       }),
  //     }
  //   );

  //   const data = await response.json();
  //   console.log("Response from server:", data);

  //   return data[0]?.message?.content?.tenders;
  // }catch (error) {
  //   console.error("Error sending data:", error);
  // }

  return content;
}
