import { ProjectStatus } from '../../prisma/generated/client';

export const allowedTransitions: Record<ProjectStatus, ProjectStatus[]> = {
  NOT_STARTED: [ProjectStatus.IN_PROGRESS],
  IN_PROGRESS: [ProjectStatus.NOT_STARTED, ProjectStatus.ON_HOLD],
  ON_HOLD: [ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED],
  COMPLETED: [ProjectStatus.ON_HOLD],
};
