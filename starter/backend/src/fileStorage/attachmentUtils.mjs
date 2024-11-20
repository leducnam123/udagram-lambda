import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const urlExpiration = process.env.SIGNED_URL_EXPIRATION
const bucketName = process.env.ATTACHMENTS_S3_BUCKET

export async function generateAttachmentUrl(id) {
    return await getSignedUrl(
        new S3Client(),
        new PutObjectCommand({
            Bucket: bucketName,
            Key: id
        }),
        {
            expiresIn: urlExpiration
        }
    )
}
export async function getFormattedUrl(id) {
    return `https://${bucketName}.s3.amazonaws.com/${id}`
}
