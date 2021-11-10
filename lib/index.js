const fs = require("fs");
const rfs = require("recursive-fs");
const FormData = require("form-data");
const basePathConverter = require("base-path-converter");
const got = require("got");

const isDirectory = async (filepath) => {
  const stats = fs.statSync(filepath);
  if(stats.isDirectory()) {
    return true;
  }
  return false;
}

const getAuth = async () => {
  try {
    return fs.readFileSync(".pinata-creds");
  } catch (error) {
    throw "Not logged in";
  }
};

const getSubmarineAuth = async () => {
  try {
    return fs.readFileSync(".pinata-creds-submarine");
  } catch (error) {
    throw "Not logged in";
  }
};

const logIn = async (jwt) => {
  return fs.writeFileSync(".pinata-creds", jwt);
};

const logInSubmarine = async (apiKey) => {
  return fs.writeFileSync(".pinata-creds-submarine", apiKey);
};

const logOut = async () => {
  return fs.writeFileSync(".pinata-creds", "");
};

const upload = async (filepath) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const jwt = await getAuth();
  try {
    let data = new FormData();
    const directory = await isDirectory(filepath);
    
    if(directory) {
      const { dirs, files } = await rfs.read(filepath);
    
      for (const file of files) {
        data.append(`file`, fs.createReadStream(file), {
          filepath: basePathConverter(filepath, file),
        });
      }
    } else {
      data.append('file', fs.createReadStream(filepath));
    }    

    const response = await got(url, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        Authorization:
          `Bearer ${jwt}`,
      },
      body: data,
    }).on("uploadProgress", (progress) => {
      console.log(progress);
      if(progress.percent === 1) {        
        console.log("Pinning, please wait...");
      }
    });
    return JSON.parse(response.body);
  } catch (error) {
    console.log(error);
  }
};

const uploadSubmarine = async (filepath) => {
  const url = `https://managed.mypinata.cloud/api/v1/content`;
  try {
    const key = await getSubmarineAuth();
    let data = new FormData();
    
    const directory = await isDirectory(filepath);
    
    if(directory) {
      const { dirs, files } = await rfs.read(filepath);
    
      for (const file of files) {
        data.append(`files`, fs.createReadStream(file), {
          filepath: basePathConverter(filepath, file),
        });
      }
    } else {
      data.append('files', fs.createReadStream(filepath));
    }
    

    data.append("cidVersion", "0");
    data.append("pinToIPFS", "false");
    data.append("wrapWithDirectory", "false");    

    const response = await got(url, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        "x-api-key": key
      },
      body: data,
    }).on("uploadProgress", (progress) => {
      console.log(progress);
      if(progress.percent === 1) {        
        console.log("Finishing processing, please wait...");
      }
    });
    return JSON.parse(response.body);
  } catch (error) {
    console.log(error);
  }
}

const contentExists = (filepath) => {
  return fs.existsSync(filepath);
};

const handleUpload = async (filepath) => {
  try {
    if (!contentExists(filepath)) {
      throw "it doesn't exist!";
    } else {
      //  upload here
      const res = await upload(filepath);
      return res;
    }
  } catch (error) {
    throw error;
  }
};

const handleSubmarine = async (filepath) => {
  try {
    if (!contentExists(filepath)) {
      throw "it doesn't exist!";
    } else {
      //  upload here
      const res = await uploadSubmarine(filepath);
      return res;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  handleUpload,
  handleSubmarine,
  getAuth,
  getSubmarineAuth, 
  logOut,
  logIn,
  logInSubmarine
};
