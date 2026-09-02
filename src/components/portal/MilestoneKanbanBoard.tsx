'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Plus,
  Sparkles,
  ArrowRight,
  Layers,
  Check,
  MoreVertical
} from 'lucide-react';
import { Milestone, MilestoneStatus, Task } from '@/types/portal';

interface MilestoneKanbanBoardProps {
  milestones: Milestone[];
  onToggleTask?: (milestoneId: string, taskOrTaskId: any) => void;
  onUpdateMilestoneStatus?: (milestoneId: string, newStatus: MilestoneStatus) => void;
  onOpenAddMilestone?: () => void;
  isDemo?: boolean;
  isAdmin?: boolean;
}

interface ColumnConfig {
  key: MilestoneStatus;
  title: string;
  subtitle: string;
  dotColor: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

const KANBAN_COLUMNS: ColumnConfig[] = [
  {
    key: 'To Do',
    title: 'To Do / Backlog',
    subtitle: 'Sprint persiapan & antrean',
    dotColor: 'bg-amber-500',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
  },
  {
    key: 'In Progress',
    title: 'In Progress / Active',
    subtitle: 'Fokus pengerjaan saat ini',
    dotColor: 'bg-blue-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-[#2C5098]',
    badgeBorder: 'border-blue-200',
  },
  {
    key: 'Done',
    title: 'Done / Completed',
    subtitle: 'Selesai & terverifikasi',
    dotColor: 'bg-emerald-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
  },
];

export const MilestoneKanbanBoard: React.FC<MilestoneKanbanBoardProps> = ({
  milestones,
  onToggleTask,
  onUpdateMilestoneStatus,
  onOpenAddMilestone,
  isDemo = false,
  isAdmin = false,
}) => {
  // Track which milestone cards have expanded their full tasks list
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});

  const toggleExpandTasks = (milestoneId: string) => {
    setExpandedTasks(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };

  const calculateProgress = (ms: Milestone) => {
    if (!ms.tasks || ms.tasks.length === 0) {
      return ms.status === 'Done' ? 100 : 0;
    }
    const completed = ms.tasks.filter((t: any) => t.completed || t.isDone).length;
    return Math.round((completed / ms.tasks.length) * 100);
  };

  return (
    <div className="w-full">
      {/* Kanban Columns Row */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x -mx-1 px-1">
        {KANBAN_COLUMNS.map((column) => {
          const columnMilestones = milestones.filter((m) => m.status === column.key);

          return (
            <div
              key={column.key}
              className="bg-slate-100/70 rounded-[2rem] p-4 border border-slate-200/80 flex flex-col min-h-[520px] min-w-[320px] sm:min-w-[360px] flex-1 snap-start"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-200/80">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    {column.key === 'In Progress' && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${column.dotColor}`}></span>
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm font-sans">{column.title}</h3>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${column.badgeBg} ${column.badgeText} ${column.badgeBorder}`}
                      >
                        {columnMilestones.length}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">{column.subtitle}</p>
                  </div>
                </div>

                {(isAdmin || isDemo) && onOpenAddMilestone && column.key === 'To Do' && (
                  <button
                    onClick={onOpenAddMilestone}
                    className="w-7 h-7 rounded-xl bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                    title="Tambah Milestone Baru"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Column Cards Container */}
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-0.5">
                {columnMilestones.length === 0 ? (
                  <div className="h-44 border-2 border-dashed border-slate-200/80 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs text-center p-4 space-y-1.5">
                    <Layers className="w-6 h-6 text-slate-300 stroke-[1.5]" />
                    <span className="font-medium text-[11px]">Belum ada milestone di tahap ini</span>
                  </div>
                ) : (
                  columnMilestones.map((ms, idx) => {
                    const progress = calculateProgress(ms);
                    const completedTasks = ms.tasks.filter((t: any) => t.completed || t.isDone).length;
                    const isExpanded = !!expandedTasks[ms.id];
                    const displayedTasks = isExpanded ? ms.tasks : ms.tasks.slice(0, 3);
                    const hasMoreTasks = ms.tasks.length > 3;

                    return (
                      <div
                        key={ms.id}
                        className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 space-y-3.5 shadow-2xs hover:shadow-md ${
                          ms.status === 'In Progress'
                            ? 'border-blue-300 ring-1 ring-blue-500/10'
                            : 'border-slate-200/90'
                        }`}
                      >
                        {/* Card Header: Sprint Tag, Due Date & Quick Status Switcher */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {ms.title.startsWith('Sprint') ? ms.title.split(':')[0] : `Sprint ${idx + 1}`}
                            </span>
                            {ms.status === 'In Progress' && (
                              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold font-mono bg-blue-50 text-[#2C5098] border border-blue-200">
                                Active
                              </span>
                            )}
                          </div>

                          {/* Quick Status Selector for Admin or Demo Mode */}
                          {(isAdmin || isDemo) && onUpdateMilestoneStatus ? (
                            <select
                              value={ms.status}
                              onChange={(e) => onUpdateMilestoneStatus(ms.id, e.target.value as MilestoneStatus)}
                              className="text-[10px] font-bold font-mono bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:outline-hidden focus:border-blue-500 transition-colors"
                              title="Pindahkan status sprint/milestone"
                            >
                              <option value="To Do">Pindah: To Do</option>
                              <option value="In Progress">Pindah: In Progress</option>
                              <option value="Done">Pindah: Done</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{ms.dueDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug font-sans hover:text-[#2C5098] transition-colors">
                            {ms.title}
                          </h4>
                          {ms.description && (
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mt-1">
                              {ms.description}
                            </p>
                          )}
                        </div>

                        {/* Progress Bar & Percentage */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-500">
                              Tugas: <strong className="text-slate-800">{completedTasks}/{ms.tasks.length}</strong>
                            </span>
                            <span className="font-bold text-[#2C5098]">{progress}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                progress === 100
                                  ? 'bg-emerald-500'
                                  : 'bg-gradient-to-r from-[#2C5098] to-blue-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Task Checklist Items */}
                        {ms.tasks.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 space-y-1.5">
                            <div className="space-y-1">
                              {displayedTasks.map((task: any) => {
                                const isDone = task.isDone !== undefined ? task.isDone : task.completed;
                                const isInteractive = isDemo || isAdmin;

                                return (
                                  <div
                                    key={task.id}
                                    onClick={() => isInteractive && onToggleTask?.(ms.id, task)}
                                    className={`flex items-start gap-2 p-1.5 rounded-lg text-xs transition-colors ${
                                      isInteractive ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'
                                    }`}
                                  >
                                    <div
                                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                        isDone
                                          ? 'bg-[#2C5098] text-white'
                                          : 'border border-slate-300 bg-white hover:border-[#2C5098]'
                                      }`}
                                    >
                                      {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                                    </div>
                                    <span
                                      className={`leading-tight text-[11px] ${
                                        isDone ? 'line-through text-slate-400' : 'text-slate-700 font-medium'
                                      }`}
                                    >
                                      {task.title}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* View More Tasks Accordion Toggle */}
                            {hasMoreTasks && (
                              <button
                                type="button"
                                onClick={() => toggleExpandTasks(ms.id)}
                                className="w-full py-1 text-[11px] font-bold text-slate-500 hover:text-[#2C5098] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <span>
                                  {isExpanded
                                    ? 'Sembunyikan tugas'
                                    : `+${ms.tasks.length - 3} tugas lainnya`}
                                </span>
                                {isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {/* Card Footer: Metadata Badges (Deliverables & Comments) */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                          <div className="flex items-center gap-2.5">
                            {ms.deliverables && ms.deliverables.length > 0 && (
                              <span className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
                                <FileText className="w-3.5 h-3.5 text-blue-500" />
                                <span>{ms.deliverables.length}</span>
                              </span>
                            )}
                            {ms.comments && ms.comments.length > 0 && (
                              <span className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
                                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                                <span>{ms.comments.length}</span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className="text-[10px]">{ms.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
