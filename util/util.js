import fs from "fs";
import Jimp from "jimp";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

// getRootPath
// helper function to get the root path of the project
// Note: need to be changed if this file is moved
function getRootPath() {
  return path.join(_dirname, "..");
}

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const outpath = path.join(
        getRootPath(), // root path
        "tmp", // subdirectory
        `filtered.${Math.floor(Math.random() * 2000)}.jpg`
      );
      const photoData = await readImageByteArrayFromURL(inputURL);
      const photo = await Jimp.read(photoData);
      photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale(); // set greyscale
      await photo.writeAsync(outpath); // write to file
      resolve(outpath);
    } catch (error) {
      reject(error);
    }
  });
}

// readImageByteArrayFromURL
// This function reads an image from a URL and returns a promise that resolves to an ArrayBuffer
// Ensure that inputURL is accessible since sometimes directly using Jimp.read(inputURL) throws "Could not find MIME for buffer (null)" error
export async function readImageByteArrayFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(inputURL);
      resolve(response.arrayBuffer());
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
