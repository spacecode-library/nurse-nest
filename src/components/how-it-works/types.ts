
import { ReactNode } from 'react';

export interface StepType {
  number: number;
  title: string;
  description: string;
  icon: ReactNode;
  imageSrc: string;
  imageAlt: string;
}
