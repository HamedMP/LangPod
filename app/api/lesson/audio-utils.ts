import { Readable } from 'stream';

/**
 * Concatenates multiple WAV audio buffers by properly handling WAV headers
 * and combining only the audio data portions
 */
export async function concatenateAudio(audioBuffers: Buffer[]): Promise<Buffer> {
  // Move declaration outside try block so it's accessible in catch
  const validBuffers = audioBuffers.filter(buffer => buffer.length > 0);
  console.log(`Concatenating ${validBuffers.length} audio buffers`);
  
  try {
    if (validBuffers.length === 0) {
      console.warn('No valid audio buffers to concatenate.');
      return Buffer.alloc(0);
    }

    if (validBuffers.length === 1) {
      console.log('Only one buffer, returning as-is');
      return validBuffers[0];
    }

    // Get header from first buffer
    const firstBuffer = validBuffers[0];
    console.log('First buffer size:', firstBuffer.length, 'bytes');

    const header = Buffer.alloc(44); // WAV header is 44 bytes
    firstBuffer.copy(header, 0, 0, 44);
    console.log('WAV header details:', {
      format: header.toString('ascii', 8, 12),
      channels: header.readUInt16LE(22),
      sampleRate: header.readUInt32LE(24),
      bitsPerSample: header.readUInt16LE(34)
    });

    // Extract and concatenate PCM data from all buffers
    const pcmBuffers = validBuffers.map((buffer, i) => {
      const pcm = buffer.slice(44);
      console.log(`Buffer ${i} PCM size:`, pcm.length, 'bytes');
      return pcm;
    });
    
    const combinedPcm = Buffer.concat(pcmBuffers);
    console.log('Combined PCM size:', combinedPcm.length, 'bytes');

    // Update header with new size information
    const totalSize = combinedPcm.length + 36;
    header.writeUInt32LE(totalSize, 4);
    header.writeUInt32LE(combinedPcm.length, 40);
    console.log('New WAV file total size:', totalSize + 8, 'bytes');

    return Buffer.concat([header, combinedPcm]);

  } catch (error) {
    console.error('Error in concatenateAudio:', error);
    return validBuffers[0] || Buffer.alloc(0);
  }
} 