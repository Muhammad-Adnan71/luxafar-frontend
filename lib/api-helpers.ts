import { toast } from "components/CMS/components-ui/shadcn/ui/use-toast";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

type EnvVariableKey = "JWT_SECRET_KEY" | "JWT_EXPIRES_IN";

export function getEnvVariable(key: EnvVariableKey): string {
  const value = process.env[key];

  if (!value || value.length === 0) {
    console.error(`The environment variable ${key} is not set.`);
    throw new Error(`The environment variable ${key} is not set.`);
  }

  return value;
}

export function getErrorResponse(
  status: number = 500,
  message: string,
  errors: ZodError | null = null
) {
  return new NextResponse(
    JSON.stringify({
      status: status < 500 ? "fail" : "error",
      message,
      errors: errors ? errors.flatten() : null,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function handleApiError(error: Error): void {
  console.log(error);
  try {
    let errorData;
    try {
      errorData = JSON.parse(error.message);
    } catch (parseError) {
      toast({
        title: error.message,
        variant: "destructive",
        type: "background",
      });
      console.log(error.message);
      return;
    }

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "fieldErrors" in errorData
    ) {
      const fieldErrors = errorData.fieldErrors as Record<string, string[]>;
      Object.keys(fieldErrors).forEach((fieldName) => {
        const validationMessages = fieldErrors[fieldName];
        if (validationMessages.length > 0) {
          const firstValidationMessage = validationMessages[0];

          toast({
            title: firstValidationMessage,
            variant: "destructive",
            type: "background",
          });

          console.log(firstValidationMessage);
        }
      });
    }
  } catch (error: any) {
    toast({
      title: error,
      variant: "destructive",
      type: "background",
    });

    console.log(error);
  }
}

export async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (isJson && data.errors !== null) {
      throw new Error(JSON.stringify(data.errors));
    }
    toast({
      title: data.message || response.statusText,
      variant: "destructive",
      type: "background",
    });

    throw new Error(data.message || response.statusText);
  }

  return data as T;
}
