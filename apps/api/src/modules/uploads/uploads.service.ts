import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from '../../schemas/upload.schema';
import { FirebaseService } from './firebase.service';
import { FileUploadStatus, SUPPORTED_FILE_TYPES, FILE_SIZE_LIMITS } from '@shared/constants';

@Injectable()
export class UploadsService {
  constructor(
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
    private firebaseService: FirebaseService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    companyId: string,
    uploadedBy: string,
    mappingTemplateId?: string,
  ) {
    this.validateFile(file);

    const destination = `companies/${companyId}/uploads`;
    const { filePath, publicUrl } = await this.firebaseService.uploadFile(file, destination);

    const upload = await this.uploadModel.create({
      companyId,
      uploadedBy,
      fileName: file.originalname,
      fileSize: file.size,
      filePath,
      mimeType: file.mimetype,
      status: FileUploadStatus.PENDING,
      mappingTemplateId,
      metadata: {
        publicUrl,
      },
    });

    return upload;
  }

  async findByCompany(companyId: string, query: any = {}) {
    const { page = 1, limit = 10, status } = query;
    const filter: any = { companyId };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [uploads, total] = await Promise.all([
      this.uploadModel
        .find(filter)
        .populate('uploadedBy', 'firstName lastName email')
        .populate('mappingTemplateId', 'name systemType')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      this.uploadModel.countDocuments(filter),
    ]);

    return {
      items: uploads,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const upload = await this.uploadModel
      .findById(id)
      .populate('uploadedBy', 'firstName lastName email')
      .populate('companyId', 'name tin')
      .populate('mappingTemplateId', 'name systemType')
      .lean();

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    return upload;
  }

  async getFileUrl(id: string, expiresIn: number = 3600) {
    const upload = await this.uploadModel.findById(id);
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    const url = await this.firebaseService.getSignedUrl(upload.filePath, expiresIn);
    return { url, expiresIn };
  }

  async updateStatus(
    id: string,
    status: FileUploadStatus,
    data?: {
      rowCount?: number;
      validRowCount?: number;
      errorRowCount?: number;
      errors?: Array<{ row: number; field: string; message: string }>;
    },
  ) {
    const upload = await this.uploadModel.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
          ...data,
          processedAt: status === FileUploadStatus.COMPLETED ? new Date() : undefined,
        },
      },
      { new: true },
    );

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    return upload;
  }

  async deleteFile(id: string) {
    const upload = await this.uploadModel.findById(id);
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    await this.firebaseService.deleteFile(upload.filePath);
    await this.uploadModel.findByIdAndDelete(id);

    return { message: 'File deleted successfully' };
  }

  private validateFile(file: Express.Multer.File) {
    const isSpreadsheet = SUPPORTED_FILE_TYPES.SPREADSHEET.includes(file.mimetype);

    if (!isSpreadsheet) {
      throw new BadRequestException(
        'Invalid file type. Only CSV and Excel files are allowed.',
      );
    }

    if (file.size > FILE_SIZE_LIMITS.CSV_MAX_SIZE) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${FILE_SIZE_LIMITS.CSV_MAX_SIZE / (1024 * 1024)}MB`,
      );
    }
  }
}
