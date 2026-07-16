/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeMode = 'light' | 'dark';

export interface DesignToken {
  name: string;
  variable: string;
  lightValue: string;
  darkValue: string;
  description: string;
  category: 'background' | 'surface' | 'text' | 'accent' | 'border';
}

export interface MediaProject {
  id: string;
  title: string;
  type: 'Video' | 'Animation' | 'Interactive' | 'Campaign' | 'Asset';
  status: 'In Production' | 'Review' | 'Render Queue' | 'Published' | 'Draft';
  progress: number;
  updatedAt: string;
  author: string;
  channel: string;
  views?: number;
  engagement?: string;
  thumbnail?: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  chartData: number[];
}

export interface ComponentDemo {
  id: string;
  name: string;
  description: string;
  category: string;
}
