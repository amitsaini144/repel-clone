
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

async function uploadFile(buffer: Buffer, file: File, userId: string) {
    const userInfo = await clerkClient.users.getUser(userId!);
    const { firstName } = userInfo;
    const filebuffer = buffer

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${firstName}/${file.name.split('.')[0]}-${Date.now()}.${file.type.split('/')[1]}`,
        Body: filebuffer,
        ContentType: file.type,
    });

    await s3Client.send(putObjectCommand);
    return file.name
}

export async function POST(req: NextRequest) {

    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return new Response('Unauthorized', { status: 401 })
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return new Response('No file found', { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        console.log(buffer);
        const fileName = await uploadFile(buffer, file, userId);

        return Response.json({ succes: true, fileName })
    } catch (error) {
        return Response.json({ succes: false, error })

    }

}