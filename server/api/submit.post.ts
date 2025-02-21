import fs from 'fs/promises';
import formidable, { File } from 'formidable';
import axios from 'axios';
import { defineEventHandler, createError } from 'h3';

const runtimeConfig = useRuntimeConfig()
const axiosInstance = axios.create({ baseURL: runtimeConfig['baseUrl'] })

export default defineEventHandler(async (event) => {
  const form = formidable({ multiples: true });

  try {
    // Parse incoming form data
    const { fields, files }: { fields: any; files: any } = await new Promise((resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    // Prepare FormData
    const formData = new FormData();

    // Append fields
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, Array.isArray(value) ? value[0] : value);
    });

    // Append files - read content into buffer
    for (const [key, file] of Object.entries(files)) {
      const fileArray = file as File[]; // Explicitly cast file to File[]
      const fileObj = fileArray[0]; // Assuming single file upload per field
      const fileContent = await fs.readFile(fileObj.filepath); // Read file content as buffer

      const fileBlob = new Blob([fileContent], { type: fileObj.mimetype as string });
      // Append file content (buffer) to FormData
      formData.append(key, fileBlob)
    }

    // Log FormData headers for debugging
    axiosInstance.defaults.headers.post = { ...getHeaders(event) }

    // Send FormData to external API
    const externalResponse = await axiosInstance.post(
      '/customers/onboard', // Replace with actual endpoint
      formData,
    );
    // Return the response data from external API
    return externalResponse.data;

  } catch (error: any) {
    throw createError({
      statusCode: error?.status ?? 523,
      statusMessage: error?.message.includes('ENETUNREACH') ? 'Network Error' : error.message.includes('EHOSTUNREACH') ? 'An unexpected error occurred. Please contact support with Reference ID: B100' : error.message,
      data: typeof error.response?.data === 'string' ? error.response?.statusText : error.response?.data || null,
    });
  }
});
