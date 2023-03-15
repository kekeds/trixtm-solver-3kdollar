const puppeteer = require('puppeteer-extra');
const { default: axios } = require('axios');
const si = require('systeminformation');
const fetch = require('node-fetch');
//puppeteer.use(require("puppeteer-extra-plugin-minmax")());
var ip = require("ip");
const { createCursor, getRandomPagePoint, installMouseHelper } = require('ghost-cursor');
const fs = require('fs');
const rendererString = fs.readFileSync('renderers.txt', 'utf8');
const renderersArray = rendererString.split('\n').map(renderer => renderer.replace('\r', ''));
const uaString = fs.readFileSync('useragents.txt', 'utf8');
const uaArray = uaString.split('\n').map(ua => ua.replace('\r', ''));
const tmp = require('tmp');
const { uuid } = require('uuidv4');
const { exit } = require('process');
//const myArgs = process.argv.slice(2);
//proxy = myArgs[0];
const proxiesString = fs.readFileSync('proxies.txt', 'utf8');
const proxiesArray = proxiesString.split('\n').map(proxy => proxy.replace('\r', ''));
proxy = proxiesArray[Math.floor(Math.random() * proxiesArray.length)];
var tmpobj = tmp.dirSync();
var tempDirPath = tmpobj.name.replace(tmpobj.name.split("\\")[tmpobj.name.split("\\").length - 1], "")
var random_user = uuid().toUpperCase()
var chrome_profile_path = tempDirPath + random_user;


  (async () => {
    if(proxy.includes("@")){//user:pass@ip:port
    console.log(proxy)
    userpass = proxy.split("@")[0]
    ipport = proxy.split("@")[1]
    user = proxy.split("@")[0].split(":")[0]
    pass = proxy.split("@")[0].split(":")[1]
    proxyip = proxy.split("@")[1].split(":")[0]
    port = proxy.split("@")[1].split(":")[1]
    proxyforurl = {
      protocol: 'http',
      host: proxyip,
      port: port,
      auth: {
          username: user,
          password: pass
      }
  }
    }
    else{//ip:port
      ipport = proxy
      proxyip = proxy.split(":")[0]
      port = proxy.split(":")[1]
      userpass = ""
      proxyforurl = {
        protocol: 'http',
        host: proxyip,
        port: port
    }
    }

    runheadless = false
    windowsize = ["1024,768","1280,800","1366,768","1440,900","1600,900","1680,1050","1920,1080","1920,1200"][Math.floor(Math.random() * 10)]
    browser_args = ["--n-wssscan", "--no-pings", "--disable-domain-reliability", "--password-store=basic", "--n-platform=Win64", "--n-product=Gecko", "--n-appname=Netscape", "--vm-ua-full-ver=108.0.5359.73", `--swidth=${windowsize.split(",")[0]}`, `--sheight=${windowsize.split(",")[1]}`, `--window-size=${windowsize}`, "--taskbar_height=40"], "--n-accetplang=en-US,en;q=0.9";
    browser_args.push(`--computer-name=${["John", "Jane", "Michael", "David", "James", "Robert", "Mary", "Michael", "William", "Christopher", "Joshua", "Matthew", "Andrew", "Daniel", "Joseph", "Brian", "Kevin", "Ryan", "Justin", "Anthony", "Nicholas", "Eric", "Steven", "Adam", "Zachary", "Jonathan", "Benjamin", "Brandon", "Gabriel", "Samuel", "Jacob", "Aaron", "Kyle", "Kevin", "Adam", "Tyler", "Richard", "Scott", "Brandon", "Ryan", "Austin", "Stephanie", "Emily", "Sarah", "Amanda", "Melissa", "Megan", "Rachel", "Lauren", "Nicole", "Victoria", "Brittany", "Taylor", "Jordan", "Morgan", "Kayla", "Jennifer", "Jessica", "Kaitlyn", "Danielle", "Brooke", "Natalie", "Alyssa", "Mariah", "Casey", "Brittany", "Samantha", "Taylor", "Courtney", "Brian", "Brandon", "Jonathan", "Adam", "Justin", "Ryan", "Michael", "David", "James", "Robert", "Matthew", "Joseph", "Daniel", "Christopher", "Anthony", "Kevin", "Jason", "Justin", "Nicholas", "Steven", "Eric", "Adam", "Zachary", "Benjamin", "Brandon", "Gabriel", "Samuel", "Jacob", "Aaron", "Kyle", "Kevin"][Math.floor(Math.random() * 100)]}`)
    console.log(chrome_profile_path)
    fs.mkdirSync(chrome_profile_path, { recursive: true }); //make dir

    loaduseragentandrenderersfromfileorapi = "api"
    if(loaduseragentandrenderersfromfileorapi.toLowerCase() == "api"){
      const fingerprintsfromapi = await axios.get('https://fingerprints.bablosoft.com/preview?rand=0.22834126184040704&tags=Microsoft%20Windows,Desktop,Chrome', {proxy: proxyforurl, timeout: 30000})
      .then(response => {
        const data = response.data;
        if(response.data.ua!=="undefined" && response.data.renderer!=="undefined" && response.data.vendor!=="undefined"){return data}
        else{console.log("Failed to obtain browser fingerprint, they were undefined...");
          exit()
          }
        
      })
      .catch(error => {
        console.log("Failed to obtain browser fingerprint:" + error);
        exit()
      });
        fs.writeFileSync(chrome_profile_path + "\\webgl.dat", `{
          "UNMASKED_RENDERER_WEBGL":"${fingerprintsfromapi.renderer}",
          "UNMASKED_VENDOR_WEBGL":"${fingerprintsfromapi.vendor}"
       }`);
      browser_args.push(`--user-agent=${fingerprintsfromapi.ua}`)
      console.log(fingerprintsfromapi.renderer)
      console.log(fingerprintsfromapi.vendor)
      console.log(fingerprintsfromapi.ua)
      }
    else{
      renderer = renderersArray[Math.floor(Math.random() * renderersArray.length)].toString();
      randua = uaArray[Math.floor(Math.random() * uaArray.length)].toString();
      fs.writeFileSync(chrome_profile_path + "\\webgl.dat", `{
        "UNMASKED_RENDERER_WEBGL":"${renderer}",
        "UNMASKED_VENDOR_WEBGL":"Google Inc. (Intel)"
     }`);
    browser_args.push(`--user-agent=${randua}`)
    console.log(renderer)
    console.log("Google Inc. (Intel)")
    console.log(randua)
    }

    browser_args.push('--lang=en')
    browser_args.push(`--user-data-dir=${chrome_profile_path}`)
    //browser_args.push("--user-data-dir=F:\\VMLogin\\profile\\8914DEF7-BBC7-43D9-9DAF-057655D1A848")
    browser_args.push(`--vmlogin-name=${chrome_profile_path}`)
    browser_args.push(`--mac-address=${(()=>{const manufacturers = ['00:02:B3', '00:1C:C0', '00:50:C2', '00:19:DB', '00:0D:60'];const hexDigits = "0123456789ABCDEF";let macAddress = manufacturers[Math.floor(Math.random() * manufacturers.length)];macAddress += ":";for (let i = 0; i < 3; i++) {macAddress += hexDigits[Math.floor(Math.random() * 16)];macAddress += hexDigits[Math.floor(Math.random() * 16)];if (i != 2) {macAddress += ":";}}return macAddress;})()}`)

    const random_int = (min, max) => { return Math.floor(Math.random() * (max - min) + min) }
    //browser_args.push(`--n-concurrent=${Number(random_int(8, 48).toString())}`) //cpu cores
    //browser_args.push(`--n-concurrent=8`) //cpu cores whatever i put, it says 12
    browser_args.push(`--n-memory=${Number([4,8][Math.floor(Math.random() * 2)])}`) //ram
    //browser_args.push('--n-automation') //flagged, webdriver on
    browser_args.push('--webgldata')
    browser_args.push('--canvas-fp=3')
    //browser_args.push('--clientrects-fp') //flagged
    browser_args.push('--vmfont-fp')
    browser_args.push('--webglinfo')
    browser_args.push('--touch-events=disabled')
    browser_args.push('--disable-features=ExtensionsToolbarMenu,FlashDeprecationWarning,EnablePasswordsAccountStorage')
    //browser_args.push('--disable-background-mode') //flagged
    browser_args.push('--disable-gpu')
    browser_args.push('--no-sandbox')
    browser_args.push('--no-first-run')
    browser_args.push(`--proxy-server=http://${ipport},https://${ipport}`)    
    
    if(userpass!==""){browser_args.push(`--proxy-user=${userpass}`)}//add user pass if needed
    try{
      const ipData = await axios.get(`http://ipwho.is/`, {proxy: proxyforurl, timeout: 30000});
      browser_args.push(`--wan-ip=${ipData.data.ip}`)
      browser_args.push(`--lan-ip=${ipData.data.ip}`)
      browser_args.push(`--timezoneid=${ipData.data.timezone.id}`)
      browser_args.push(`--g-latitude=${ipData.data.latitude}`)
      browser_args.push(`--g-longitude=${ipData.data.longitude}`)
    }
    catch (error){
      console.log("Proxy timed out... " + error)
      exit()
    }
    startargs = {executablePath: "browser/chrome.exe",
        args: browser_args,
        defaultViewport: null
    }


    if(runheadless !== undefined && runheadless=="True" || runheadless=="true"){
      startargs["headless"] = true //for headless
    }
    else{
      startargs["headless"] = false //for headfull
    }

    const browser = await puppeteer.launch(startargs);
    

    try{ //try catch to fix memory leak
    const page = await browser.newPage();
    var client = await page.target().createCDPSession();
    await client.send('Emulation.setHardwareConcurrencyOverride', {hardwareConcurrency: [2, 4, 8, 16, 32][Math.floor(Math.random() * [2, 4, 8, 16, 32].length)]});
    //await page.minimize();
    //await page.maximize();
    await page.bringToFront();
    await page.setRequestInterception(true);
    page.on('request', async (req) => {
      if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
          //req.abort();}
          req.continue();}
      else if (req.url().startsWith("https://js.hcaptcha.com/1/api.js") || req.url().startsWith("https://accounts.hcaptcha.com/static/js/b.js") || req.url().includes("hsw.js") || req.url().includes("hcaptcha.js")
      || req.url().includes("challenge.js") || req.url().includes("favicon")) {
        axios.get(req.url(), {})
            .then(function (response) {
                req.respond({
                    status: response.status,
                    body: response.data
                })
            });
        }
      else if (req.url().startsWith("https://accounts.hcaptcha.com/demo?sitekey=4c672d35-0701-42b2-88c3-78380b0db560")) {
          req.respond({
              status: 200,
              body: `<!DOCTYPE html>
              <html lang="en">
              <head>
                <style>body {background-color: black; color: white; font-family: 'Times New Roman', serif; padding-top: 100px;}</style>
              <script src="https://js.hcaptcha.com/1/api.js?reportapi=https%3A%2F%2Faccounts.hcaptcha.com&custom=False" type="text/javascript" async defer></script>
              <div id="hcaptcha-demo" class="h-captcha" data-sitekey="4c672d35-0701-42b2-88c3-78380b0db560" style="text-align: center;" data-callback="onSuccess" data-expired-callback="onExpire"></div>
              <style>
              img {border-radius: 50%;
                  display: block;
                  margin: 0 auto;}
              </style>
              <h2 style="text-align: center;">TrixTM Token Gen V12.6</h2>
              <h2 style="text-align: center;">https://trixtm.com/</h2>
              <h2 style="text-align: center;">https://tokengen.trixtm.com/</h2>
              <img src="data:image/jpeg;base64,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" alt="Avatar" style="width:100px">          
              </html>`
            });
        }
      //else if (req.url().startsWith("https://newassets.hcaptcha.com/i/")) {
      //  axios.get(req.url(), {})
      //      .then(function (response) {
      //          req.respond({
      //              status: response.status,
      //              body: response.data
      //          })
      //      });
      //  }
      else if (req.url().startsWith("https://imgs.hcaptcha.com")) {
        //imglinks.push(req.url())
        axios.get(req.url(), {responseType: 'arraybuffer'})
            .then(function (response) {
                req.respond({
                    status: 200,
                    contentType: 'image/jpeg',
                    body: response.data
                })
            });
        }
      else {
            req.continue();
      }
    })
    page.on('response', async (response) => {
      if(response.request().url().includes("https://hcaptcha.com/checkcaptcha/") && response.request().method() === "POST"){
      const resp = await response.json();
      const hcaptoken = resp["generated_pass_UUID"];
      if(hcaptoken !== undefined){
          //onsole.log("hCaptcha solved: " + hcaptoken)
          console.log("hCaptcha solved:")
          console.log(hcaptoken)
          serverport = "8888"
          let data = {
                hcaptoken: hcaptoken,
                proxy: proxy
            };
            fetch("http://" + ip.address() + ":" + serverport + "/hcaptcha", {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {'Content-Type': 'application/json'}
            })
            
          solved = "finished"
          //browser.close();
          const browserPID = browser.process().pid
          process.kill(browserPID);
          console.log("Browser killed by PID: " + browserPID)//kill by PID, no more memory leak
          await browser.close()
          fs.rmSync(chrome_profile_path, { recursive: true, force: true});  
          console.log("Browser data folder deleted!")
          
      }
      else{console.log("HCaptcha failed!")
      solved = "finished"
      //await browser.close();
      const browserPID = browser.process().pid
      process.kill(browserPID);
      console.log("Browser killed by PID: " + browserPID)//kill by PID, no more memory leak
      await browser.close()
      fs.rmSync(chrome_profile_path, { recursive: true, force: true});  
      console.log("Browser data folder deleted!")
      };

  }
  })
    //await page.setViewport({ width: 910, height: 931});

  //  await page.evaluateOnNewDocument(() => {
  //    chrome.privacy.network.webRTCIPHandlingPolicy.set({
  //        value: "default_public_interface_only" 
  //    });
  //});


    //await page.minimize();
    const cursor = createCursor(page);
    //await installMouseHelper(page)
    await page.goto("https://accounts.hcaptcha.com/demo?sitekey=4c672d35-0701-42b2-88c3-78380b0db560", {waitUntil: 'load', timeout: 30000})
    
    //await page.minimize();
    //await page.maximize();
    //await page.setExtraHTTPHeaders({ 'referer': 'https://discord.com/' })
    
    //await browser.close();
    box = await page.waitForSelector('iframe', { timeout: 15000 })
    const outer = await page.waitForSelector('iframe[data-hcaptcha-response]', { timeout: 30000 });
    const outerFrame = await outer?.contentFrame();
    const inner = await page.waitForSelector('iframe:not([data-hcaptcha-response])', { timeout: 30000 });
    const innerFrame = await inner?.contentFrame();
    start = await outerFrame.waitForXPath(`//*[@id="checkbox"]`, { timeout: 30000 });
    console.log("Loaded")
    //await page.maximize();
    await cursor.click(start, { waitForClick: random_int(100, 170) })
    console.log("clicked")
    //await page.maximize();
    solved = "false"
    outer: for(let i=1; i<=5; i++){
    await innerFrame.waitForSelector('.challenge-container', { timeout: 20000 });
    await innerFrame.waitForSelector('.prompt-text', { timeout: 20000 });
    let captchaTitle = await innerFrame.evaluate(() => document.querySelector(".prompt-text", { timeout: 20000 })?.textContent);
    console.log(captchaTitle.toString()) //Please click each image containing a ....
    await innerFrame.$$(".task-grid .task-image .image", { timeout: 20000 }); //wait for imgs to load
    await page.waitForTimeout(3000);
    const extractLinks = (str) => {
      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
      const matches = str.match(regex);
      return matches || [];
    }
  var frame = page.mainFrame().childFrames()[0]
  elHandleArray = await frame.$$('.task-image .image')
  links = []
  imgbase64 = []
  //await page.minimize();
  //await page.maximize();
  for (let i = 0; i < 9; i++) { //try 5 times
      var urlString = await frame.evaluate(el => getComputedStyle(el).backgroundImage, elHandleArray[i])
      const link = extractLinks(urlString);
      links.push(link[0])
      await axios.get(link[0], {responseType: 'arraybuffer'})
            .then(function (response) {
              base64img = Buffer.from(response.data).toString('base64');
              imgbase64.push(base64img)
            });
      }
    data = {
      "question": captchaTitle.toString(),
      "queries": imgbase64,
      "links": links
    }
    serverport = "8888"
    const response = await fetch("http://" + ip.address() + ":" + serverport + "/predict", {
              method: 'POST',
              body: JSON.stringify(data),
              headers: {'Content-Type': 'application/json'}
            })
    const apiresponse = await response.text();
    //const apiresponse = await response.json();
    console.log("Server response: " + apiresponse) //[2,4,6,7,9]
    //await page.minimize();
    //await page.maximize();
    const imageElements = await innerFrame.$$('.task-image');
    if(apiresponse!=="error"){  //click images now
      const answers = JSON.parse(apiresponse);
      answers.sort(() => Math.random() - 0.5); //mix
      for (let i = 0; i < answers.length; i++) {
        imgnumbertoclick = answers[i]-1
        //await page.maximize();
        await cursor.click(imageElements[imgnumbertoclick], { waitForClick: random_int(100, 170) })
      }
    //await page.maximize();
    submit = await innerFrame.waitForSelector("body > div.challenge-interface > div.button-submit.button")
    await cursor.click(submit, { waitForClick: random_int(100, 170) })
    solved = "true"
    console.log("FINISHED")
    break
    }
    else{ //refresh
      console.log("Predict server returned an error, retrying, attempt " + i)
      refresh = await innerFrame.waitForSelector("body > div.challenge-interface > div.refresh.button > div.refresh-off > svg")
      await cursor.click(refresh, { waitForClick: random_int(100, 170) })
    }
  }//while true end
  //if after 5 retries it fails, close the browser
  if(solved!="true"){
    console.log("5 failed attempts, closing browser...")
    //await browser.close();
    const browserPID = browser.process().pid
    process.kill(browserPID);
    console.log("Browser killed by PID: " + browserPID)//kill by PID, no more memory leak
    await browser.close()
    fs.rmSync(chrome_profile_path, { recursive: true, force: true});  
    console.log("Browser data folder deleted!")
  }
  else{
    for(i=1; i<=6; i++){
      if(solved!="finished"){await page.waitForTimeout(5000);}
      else{break}
    }
    await browser.close()
    fs.rmSync(chrome_profile_path, { recursive: true, force: true});  
  }

}catch (e) {//print the error
  console.log("Error:");
  console.log(e);
  const browserPID = browser.process().pid
  process.kill(browserPID);
  console.log("Browser killed by PID: " + browserPID)//kill by PID, no more memory leak
  await browser.close()
  fs.rmSync(chrome_profile_path, { recursive: true, force: true});  
  console.log("Browser data folder deleted!")
}


})();//final backets




