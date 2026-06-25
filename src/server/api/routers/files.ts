import Elysia, { t } from "elysia";
import { GetMetadata, s3, UploadFile } from "../../s3";

export const filesRouter = new Elysia({
  prefix: "/files",
})
  .post(
    "/",
    async ({ body }) => {
      const savedFileId = await UploadFile(body.file);
      return savedFileId;
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    },
  )
  .get("/:id", async ({ params, set }) => {
    const metadata = await GetMetadata(params.id);

    if (!metadata) {
      set.status = 404;
      return;
    }

    set.headers["Content-Type"] = metadata.contentType;
    set.headers["Content-Disposition"] =
      `attachment; filename="${encodeURIComponent(metadata.name)}"`;

    const s3File = s3.file(params.id);

    return new Response(s3File.stream(), {
      headers: {
        "Content-Type": metadata.contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(metadata.name)}"`,
      },
    });
  });