// Merge Preview Types
export type FieldStatus = 'apply' | 'conflict' | 'noop';
export type MergeAction = 'add' | 'remove' | 'modify' | 'noop' | 'conflict';

export interface FieldChange {
  key: string;
  masterValue: any;
  forkValue: any;
  status: FieldStatus;
}

export interface BlockPlan {
  forkBlockIndex?: number;
  masterBlockIndex?: number;
  action: MergeAction;
  masterBlock?: any;
  fields: FieldChange[];
}

export interface SectionPlan {
  forkSectionId?: string | number;
  masterSectionId?: string | number;
  forkIndex?: number;
  masterIndex?: number;
  action: MergeAction;
  masterSection?: {
    title?: string;
    subtitle?: string;
    order?: number;
    content?: any;
  };
  fields: FieldChange[];
  blocks: BlockPlan[];
}

export interface MergeSummary {
  sectionsAdded: number;
  sectionsRemoved: number;
  sectionsModified: number;
  conflicts: number;
}

export interface MergePreviewResponse {
  data: {
    forkId: string | number;
    masterId: string | number;
    forkSlug: string;
    masterSlug: string;
    forkTitle: string;
    masterTitle: string;
    baseMasterUpdatedAt: string;
    currentMasterUpdatedAt: string;
    summary: MergeSummary;
    plan: SectionPlan[];
  };
}

// Merge Apply Types
export interface BlockSelection {
  forkBlockIndex?: number;
  masterBlockIndex?: number;
  acceptBlock?: boolean;
  action?: MergeAction;
  masterBlock?: any;
  fieldAccept?: {
    order?: boolean;
    payload?: boolean;
    content?: boolean;
    text?: boolean;
    author?: boolean;
    role?: boolean;
    device?: boolean;
    screenshots?: boolean;
  };
}

export interface SectionSelection {
  forkSectionId?: string | number;
  masterSectionId?: string | number;
  action?: MergeAction;
  acceptSection?: boolean;
  masterSection?: {
    title?: string;
    subtitle?: string;
    order?: number;
    content?: any;
  };
  fieldAccept?: {
    title?: boolean;
    subtitle?: boolean;
    order?: boolean;
    payload?: boolean;
  };
  blocks?: BlockSelection[];
}

export interface MergeApplyRequest {
  selections: SectionSelection[];
}

export interface AppliedCounts {
  sectionsAdded: number;
  sectionsRemoved: number;
  sectionsModified: number;
  blocksAdded: number;
  blocksRemoved: number;
  blocksModified: number;
}

export interface MergeApplyResponse {
  data: {
    ok: boolean;
    forkId: string | number;
    backupId: string | number;
    appliedCounts: AppliedCounts;
    message: string;
  };
}