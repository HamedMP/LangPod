import axios from "axios";

export interface LessonRequest {
  topic: string;
  language: string;
  nativeLanguage: string;
  difficulty: string;
}

export interface AudioSegment {
  text: string;
  voice: string;
  audio: string;
}

export interface LessonResponse {
  conversation: string;
  audio: string;
  segments: AudioSegment[];
}

export const createLesson = async (data: LessonRequest): Promise<LessonResponse> => {
  const response = await axios.post("/api/lesson", data);
  return response.data;
}; 