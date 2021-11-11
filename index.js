#!/usr/bin/env node 

const program = require('commander');
const path = require('path');
const { handleUpload, handleSubmarine, getSubmarineAuth, getAuth, logIn, logInSubmarine } = require('./lib');
program
  .version('1.0.3')
  .name('pinata-cli')
  .description('A command line tool to upload files and folders to Pinata')
  .option('-a, --auth [jwt]', 'API jwt from Pinata')  
  .option('-as --authSubmarine [api key]', 'V2 API Key from Pinata')
  .option('-u, --upload [file or folder]', 'Source folder or file to upload to IPFS')
  .option('-s, --submarine [file or folder]', 'Source folder or file to submarine on Pinata')
  .parse(process.argv)

const main = async () => {
  try {
    const { upload, submarine, auth, authSubmarine } = program.opts();
    if(upload) {
      await getAuth();
      const result = await handleUpload(upload);
      console.log(result);
    }    

    if(submarine) {
      await getSubmarineAuth();
      const result = await handleSubmarine(submarine);
      console.log(result);
    }

    if(auth) {
      await logIn(auth);
      console.log("Authenticated");
    }

    if(authSubmarine) {
      await logInSubmarine(authSubmarine);
      console.log("Authenticated");
    }
  } catch (error) {
    console.log(error)
  }
}

main()