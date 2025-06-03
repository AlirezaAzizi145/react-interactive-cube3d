import { CSSProperties, FC } from 'react';

export interface FaceContent {
  type: 'video' | 'image' | 'html' | 'empty';
  src?: string;
  html?: string;
}

export interface EffectColors {
  front?: string;
  back?: string;
  right?: string;
  left?: string;
  top?: string;
  bottom?: string;
}

export interface Faces {
  front?: FaceContent;
  back?: FaceContent;
  right?: FaceContent;
  left?: FaceContent;
  top?: FaceContent;
  bottom?: FaceContent;
}

export interface Cube3DProps {
  size?: number;
  responsive?: boolean;
  minSize?: number;
  maxSize?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  interactive?: boolean;
  interactiveEffects?: boolean;
  effectColors?: EffectColors;
  faces?: Faces;
  className?: string;
  style?: CSSProperties;
}

declare const Cube3D: FC<Cube3DProps>;

export default Cube3D; 