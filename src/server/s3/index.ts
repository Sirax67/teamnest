import { eq } from "drizzle-orm";
import { db } from "../db";
import { files } from "../db/file";
import mime, { contentType } from "mime-types";

export const s3 = new Bun.S3Client({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    endpoint: process.env.S3_ENDPOINT,
});

export async function UploadFile(file: File) {
    const mimeType = mime.lookup(file.name);

    const resolverdType = mimeType ? mimeType : "aplication/octet-stream";
    
    const [dbFile] = await db   
        .insert(files)
        .values({
            name: file.name,
            size: file.size,
            contentType: resolverdType,
        })
        .returning();

    const metadata = s3.file(dbFile.id);

    await metadata.write(Buffer.from(await file.arrayBuffer()), {
        type: resolverdType,
    });

    return dbFile.id
}

export async function GetMetadata(id: string) {
    return await db.query.files.findFirst({
        where: eq(files.id, id),
    });
}