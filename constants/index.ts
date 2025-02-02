
"use client";

export type User = {
  id: string;
  _id: string;
  name: string;
  email: string;
  createAt: string;
  updateAt: string;
  role: string;
};


export type Exam = {
  _id: string;
  title: string;
  duration: number;
  questions: Question[];
};

export type newExam = {
  _id: string;
  title: string;
  duration: number;
  questions: string[];
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctOption: number;
};

export type SelectedAnswersType = {
  question: string;
  selectedOption: string | null;
  }[];
