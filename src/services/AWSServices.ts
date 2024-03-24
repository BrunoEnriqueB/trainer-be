import AWS, { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { AWSDeleteImage, AWSUploadImage } from '@src/domain/AWSException';

export default class AwsServices {
  private client: S3;
  private AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
  private AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;
  private AWS_REGION = process.env.AWS_REGION as string;
  private BUCKETNAME = process.env.BUCKETNAME as string;
  private CLOUDFRONTURL = process.env.CLOUDFRONTURL as string;

  constructor() {
    AWS.config.update({
      accessKeyId: this.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.AWS_SECRET_ACCESS_KEY,
      region: this.AWS_REGION
    });

    this.client = new AWS.S3();
  }

  async uploadFile(file: Express.Multer.File): Promise<ManagedUpload.SendData> {
    return new Promise((resolve, reject): void => {
      const params: S3.PutObjectRequest = {
        Bucket: this.BUCKETNAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: this.convertContentTypeByMimetype(file.mimetype)
      };

      this.client.upload(params, (err: Error, data: ManagedUpload.SendData) => {
        if (err) {
          return reject(new AWSUploadImage());
        }
        data.Location = `${this.CLOUDFRONTURL}${file.originalname}`;
        resolve(data);
      });
    });
  }

  private convertContentTypeByMimetype(mimetype: string){
    return mimetype === "video/quicktime" ? "video/mp4" : mimetype
  }

  async deleteFile(fileName: string): Promise<void> {
    return new Promise((resolve, reject): void => {
      const params: S3.DeleteObjectRequest = {
        Bucket: this.BUCKETNAME,
        Key: fileName
      };

      this.client.deleteObject(
        params,
        (err: Error, data: S3.DeleteObjectOutput) => {
          if (err) {
            return reject(new AWSDeleteImage());
          }

          resolve();
        }
      );
    });
  }
}
