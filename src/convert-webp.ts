import { z } from "zod";
import { BaseTool } from "./base-tool.js";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const CONVERT_WEBP_TOOL_NAME = "convert_webp";
const CONVERT_WEBP_DESCRIPTION =
  "Activate this tool when convert_webp is mentioned in the message, it converts selected image files to WebP format";

export class ConvertWebpTool extends BaseTool {
  name = CONVERT_WEBP_TOOL_NAME;
  description = CONVERT_WEBP_DESCRIPTION;

  constructor(apiKey?: string, params?: Record<string, string>) {
    super(apiKey, params);
    console.error(`ConvertWebpTool initialized`);
  }

  schema = z.object({
    absolutePathToProjectDirectory: z
      .string()
      .describe("Path to the project root directory"),
    clientPlatform: z.string().describe("Client's platform"),
    clientCwd: z.string().describe("Client's current working directory"),
    directoryContents: z
      .array(
        z.object({
          name: z.string(),
          type: z.enum(["file", "directory"]),
        })
      )
      .describe("Directory contents provided by client"),
    parentDirectoryContents: z
      .array(
        z.object({
          name: z.string(),
          type: z.enum(["file", "directory"]),
        })
      )
      .describe("Parent directory contents provided by client"),
    selectedFiles: z
      .array(z.string())
      .describe("Files selected by the client for conversion")
      .optional(),
  });

  async execute({
    absolutePathToProjectDirectory,
    clientPlatform,
    clientCwd,
    directoryContents,
    parentDirectoryContents,
    selectedFiles = [],
  }: z.infer<typeof this.schema>) {
    try {
      // 지원되는 이미지 파일 확장자
      const supportedExtensions = [".png", ".jpg", ".jpeg"];

      // 선택된 파일 중 지원되는 이미지 파일만 필터링
      const imageFiles = selectedFiles.filter((fileName) => {
        const ext = path.extname(fileName).toLowerCase();
        return supportedExtensions.includes(ext);
      });

      if (imageFiles.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  message:
                    "변환할 이미지 파일(PNG, JPG, JPEG)이 선택되지 않았거나 지원되지 않는 형식입니다.",
                  directory: clientCwd,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      // 이미지 파일을 WebP로 변환
      const conversionResults = await Promise.all(
        imageFiles.map(async (fileName) => {
          const inputPath = path.join(clientCwd, fileName);
          const outputFileName =
            path.basename(fileName, path.extname(fileName)) + ".webp";
          const outputPath = path.join(clientCwd, outputFileName);

          try {
            // Sharp 라이브러리를 사용하여 WebP로 변환
            await sharp(inputPath).webp({ quality: 80 }).toFile(outputPath);

            return {
              originalFile: fileName,
              webpFile: outputFileName,
              success: true,
            };
          } catch (error: any) {
            return {
              originalFile: fileName,
              error: error.message,
              success: false,
            };
          }
        })
      );

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                message: "선택한 이미지 변환이 완료되었습니다.",
                results: conversionResults,
                directory: clientCwd,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: {
                  message: error.message,
                  code: error.code,
                  path: error.path,
                  clientRequest: {
                    path: absolutePathToProjectDirectory,
                    platform: clientPlatform,
                    cwd: clientCwd,
                    selectedFiles,
                  },
                  serverEnvironment: {
                    platform: process.platform,
                    cwd: process.cwd(),
                    apiKeyProvided: !!this.apiKey,
                  },
                },
              },
              null,
              2
            ),
          },
        ],
      };
    }
  }
}
