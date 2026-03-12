import textFileIcon from "../assets/icons8-text-file-64.png";
import pdfIcon from "../assets/icons8-pdf-48.png";
import pptIcon from "../assets/icons8-microsoft-powerpoint-2019-48.png";
import wordIcon from "../assets/icons8-word-48.png";
import unknownIcon from "../assets/icons8-text-50.png";

export const getFileIconByName = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") return pdfIcon;
  if (ext === "doc" || ext === "docx") return wordIcon;
  if (ext === "ppt" || ext === "pptx") return pptIcon;
  if (ext === "txt" || ext === "md" || ext === "rtf") return textFileIcon;
  if (ext === "text") return textFileIcon;

  return unknownIcon;
};
