export interface BlockDiff {
  index: number;
  type: string;
  order: number;
}

export interface ModifiedBlock {
  forkBlockIndex: number;
  masterBlockIndex: number;
  type: string;
  order: number;
  fieldsChanged: string[];
  payloadDiff: {
    before: any;
    after: any;
  } | null;
}

export interface BlocksDiff {
  added: BlockDiff[];
  removed: BlockDiff[];
  modified: ModifiedBlock[];
}

export interface SectionDiff {
  id: string | number;
  title: string;
  order: number;
}

export interface ModifiedSection {
  forkSectionId: string | number;
  masterSectionId: string | number;
  forkTitle: string;
  masterTitle: string;
  fieldsChanged: string[];
  blocks: BlocksDiff;
}

export interface SectionsDiff {
  added: SectionDiff[];
  removed: SectionDiff[];
  modified: ModifiedSection[];
}

export interface DiffSummary {
  sectionsAdded: number;
  sectionsRemoved: number;
  sectionsModified: number;
}

export interface DiffResponse {
  data: {
    forkId: string | number;
    masterId: string | number;
    forkSlug: string;
    masterSlug: string;
    forkTitle: string;
    masterTitle: string;
    sections: SectionsDiff;
    summary: DiffSummary;
  };
}