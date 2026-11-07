"use client";

import React from "react";
import {
  Boxes,
  Server,
  Code2,
  Brain,
  ShieldCheck,
  BookmarkCheck,
  Database,
  Cloud,
  Smartphone,
  FileText,
  LucideProps,
} from "lucide-react";

export function getCategoryLucideIcon(category?: string | null) {
  if (!category) return FileText;
  const lower = category.toLowerCase().trim();

  // AI & Machine Learning
  if (
    lower.includes("ai") ||
    lower.includes("machine learning") ||
    lower.includes("llm") ||
    lower.includes("intelligence")
  ) {
    return Brain;
  }

  // Architecture & System Engineering
  if (
    lower.includes("arsitektur") ||
    lower.includes("architecture") ||
    lower.includes("rekayasa") ||
    lower.includes("sistem") ||
    lower.includes("system")
  ) {
    return Boxes;
  }

  // Backend & APIs
  if (
    lower.includes("backend") ||
    lower.includes("api") ||
    lower.includes("server") ||
    lower.includes("microservice")
  ) {
    return Server;
  }

  // Frontend & Web UI
  if (
    lower.includes("frontend") ||
    lower.includes("web") ||
    lower.includes("ui") ||
    lower.includes("antarmuka")
  ) {
    return Code2;
  }

  // Security
  if (lower.includes("security") || lower.includes("keamanan") || lower.includes("auth")) {
    return ShieldCheck;
  }

  // Database & Storage
  if (
    lower.includes("database") ||
    lower.includes("data") ||
    lower.includes("sql") ||
    lower.includes("storage")
  ) {
    return Database;
  }

  // Cloud & DevOps
  if (
    lower.includes("cloud") ||
    lower.includes("devops") ||
    lower.includes("infra") ||
    lower.includes("docker") ||
    lower.includes("kubernetes")
  ) {
    return Cloud;
  }

  // Mobile
  if (
    lower.includes("mobile") ||
    lower.includes("android") ||
    lower.includes("ios") ||
    lower.includes("flutter")
  ) {
    return Smartphone;
  }

  // Best Practices, Playbook & Standards
  if (
    lower.includes("best practice") ||
    lower.includes("standar") ||
    lower.includes("praktik") ||
    lower.includes("product") ||
    lower.includes("playbook") ||
    lower.includes("manajemen")
  ) {
    return BookmarkCheck;
  }

  return FileText;
}

export interface CategoryIconProps extends LucideProps {
  category?: string | null;
  className?: string;
}

export function CategoryIcon({
  category,
  className = "w-3 h-3 text-[#2C5098]",
  ...props
}: CategoryIconProps) {
  const IconComponent = getCategoryLucideIcon(category);
  return <IconComponent className={className} {...props} />;
}

export default CategoryIcon;
