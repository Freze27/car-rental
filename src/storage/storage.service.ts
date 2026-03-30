import { Injectable } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly endpoint: string;

  constructor() {
    this.bucket = process.env.YANDEX_STORAGE_BUCKET!;
    this.endpoint = process.env.YANDEX_STORAGE_ENDPOINT!;

    this.client = new S3Client({
      region: process.env.YANDEX_STORAGE_REGION!,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: process.env.YANDEX_STORAGE_ACCESS_KEY!,
        secretAccessKey: process.env.YANDEX_STORAGE_SECRET_KEY!,
      },
    });
  }

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${Date.now()}.${ext}`;

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();
    return `${this.endpoint}/${this.bucket}/${key}`;
  }

  async delete(url: string): Promise<void> {
    const key = url.replace(`${this.endpoint}/${this.bucket}/`, '');
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }
}
