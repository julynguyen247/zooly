import { BadRequestException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;
  private readonly bucket: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const bucket = process.env.SUPABASE_BUCKET || 'test-assets';

    if (!url || !key) {
      throw new Error(
        ' SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in .env',
      );
    }

    this.client = createClient(url, key, {
      auth: { persistSession: false },
    });
    this.bucket = bucket;
  }

  private async uploadSimple(folder: string, file: Express.Multer.File) {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${randomUUID()}.${ext}`;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(key, file.buffer, {
        contentType: file.mimetype || 'application/octet-stream',
        upsert: false,
      });

    if (error) throw new BadRequestException('Upload failed: ' + error.message);

    const { data } = this.client.storage.from(this.bucket).getPublicUrl(key);
    return { url: data?.publicUrl ?? '' };
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File phải là ảnh (image/*)');
    }
    return this.uploadSimple('images', file);
  }

  async uploadAudio(file: Express.Multer.File) {
    if (!file.mimetype.startsWith('audio/')) {
      throw new BadRequestException('File phải là audio (audio/*)');
    }
    return this.uploadSimple('audio', file);
  }
}
