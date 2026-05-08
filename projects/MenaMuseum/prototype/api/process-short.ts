/**
 * Server-side Video Processing Function (Node.js / Edge Compatible)
 * Uses fluent-ffmpeg to merge user video with museum template.
 */

import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

// Mock S3/Storage helper
const downloadFile = async (url: string): Promise<string> => {
  const tmpPath = path.join('/tmp', `input-${Date.now()}.mp4`);
  // ... download logic ...
  return tmpPath;
};

const uploadFile = async (localPath: string): Promise<string> => {
  // ... upload to R2/S3 logic ...
  return `https://cdn.menamuseum.com/shorts/${Date.now()}.mp4`;
};

export const processShortVideo = async (req: { userVideoUrl: string; templateId: string }) => {
  const userVideoPath = await downloadFile(req.userVideoUrl);
  const templatePath = path.join('./templates', `${req.templateId}.mp4`);
  const outputPath = path.join('/tmp', `output-${Date.now()}.mp4`);

  return new Promise<string>((resolve, reject) => {
    ffmpeg()
      .input(templatePath)
      .input(userVideoPath)
      .videoFilters([
        // Example: Chroma Key (Green Screen) removal
        // Assumes template has a green box where user video should go
        {
          filter: 'colorkey',
          options: '0x00FF00:0.3:0.2',
          inputs: '1:v'
        },
        // Overlay user video on top
        {
          filter: 'overlay',
          options: '(W-w)/2:(H-h)/2'
        }
      ])
      .output(outputPath)
      .outputOptions(['-c:v libx264', '-preset fast', '-shortest'])
      .on('end', async () => {
        console.log('Processing finished');
        const publicUrl = await uploadFile(outputPath);
        
        // Cleanup temp files
        fs.unlinkSync(userVideoPath);
        fs.unlinkSync(outputPath);
        
        resolve(publicUrl);
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      })
      .run();
  });
};
