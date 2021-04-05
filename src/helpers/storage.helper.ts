import { S3 } from 'aws-sdk';
import { Logger } from '@nestjs/common';
import { env } from 'process'
class UploadService {


    async upload(file) {
        const { originalname } = file;
        const bucketS3 = 'kenvin-stevens';
        return await this.uploadS3(file.buffer, bucketS3, originalname);
    }

    async uploadS3(file, bucket, name) {
        const s3 = this.getS3();
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read'
        };
        return new Promise((resolve, reject) => {
            s3.upload(params, (err, data) => {
            if (err) {
                Logger.error(err);
                reject(err.message);
            }
            resolve(data);
            });
        });
    }

    getS3() {
        return new S3({
            accessKeyId: 'AKIA6D3LVYSF33ZEKIXE',
            secretAccessKey: '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'
        });
    }
}

export const uploadService = new UploadService();