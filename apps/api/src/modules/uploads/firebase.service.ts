import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private storage: admin.storage.Storage;
  private bucket: admin.storage.Bucket;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const firebaseConfig = this.configService.get('firebase');

    if (!firebaseConfig.projectId || !firebaseConfig.privateKey || !firebaseConfig.clientEmail) {
      console.warn('Firebase credentials not configured. File upload will not work.');
      return;
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          privateKey: firebaseConfig.privateKey,
          clientEmail: firebaseConfig.clientEmail,
        }),
        storageBucket: firebaseConfig.storageBucket,
      });

      this.storage = admin.storage();
      this.bucket = this.storage.bucket();
    } catch (error) {
      console.error('Failed to initialize Firebase:', error.message);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    destination: string,
  ): Promise<{ filePath: string; publicUrl: string }> {
    if (!this.bucket) {
      throw new BadRequestException('Firebase storage not initialized');
    }

    const fileName = `${destination}/${Date.now()}-${file.originalname}`;
    const fileUpload = this.bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    await fileUpload.makePublic();

    const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;

    return {
      filePath: fileName,
      publicUrl,
    };
  }

  async getFile(filePath: string): Promise<Buffer> {
    if (!this.bucket) {
      throw new BadRequestException('Firebase storage not initialized');
    }

    const file = this.bucket.file(filePath);
    const [buffer] = await file.download();
    return buffer;
  }

  async deleteFile(filePath: string): Promise<void> {
    if (!this.bucket) {
      throw new BadRequestException('Firebase storage not initialized');
    }

    const file = this.bucket.file(filePath);
    await file.delete();
  }

  async getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
    if (!this.bucket) {
      throw new BadRequestException('Firebase storage not initialized');
    }

    const file = this.bucket.file(filePath);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });

    return url;
  }
}
