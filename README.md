## Pinata Upload CLI (Unofficial)

### What is this?

This is a simple command line tools designed to allow developers (and those familiar with the command line) to easily upload files and folders to their Pinata account. It is specifically built to help with large folder uploads. 

**Background**

I am the Head of Product at Pinata. I work closely with our customers and see both their successes and their friction points. One such friction point was with uploading large folders. NFT PFP projects exacerbated this. 

To solve the problem, I built this small utility. In the process, we as a company have also hopefully found a better solution across the board for large folder uploads. 

### Wait, what is Pinata? 

[Pinata](https://pinata.cloud) is a media and content distribution platform built on top of IPFS. Pinata gives creators and developers and brands and everyone else control over their media and the distribution of said media, allowing everyone to be their own YouTube or Instagram or Netflix. 

### How to use this CLI

Make sure you are using a recent version of Node. I recommend `14.17.6` or above.

First, you have to install it.

`npm i -g pinata-upload-cli`

Once it's installed, you will be able to check all the functionality by running: 

`pinata-cli -h` 

You can upload files and folders using this CLI, and you can upload them to the public IPFS network through Pinata, or you can Submarine them. [Read more about Submarining here](https://www.pinata.cloud/blog/introducing-submarining-what-it-is-why-you-need-it). 

To upload to the public IPFS network, you'll need a Pinata V1 API Key JWT. To upload to Pinata Submarine, you'll need a V2 API Key. Both of these are easily available in the Pinata web app once you've created an account. 

**Note: Pinata Submarine is only available on paid Professional Plans.**

### Example Usage 

Authenticate Public IPFS: 

```
pinata-cli -a [Pinata JWT]
```

Authenticate Submarining: 

```
pinata-cli -as [Pinata V2 API Key]
```

Upload a folder or file to public IPFS: 

```
pinata-cli -u ../../../test/folder/relative/path
```

Upload a folder or file to private Pinata Submarine: 

```
pinata-cli -s ../../../test/folder/relative/path
```