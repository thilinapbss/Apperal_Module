/**
 * Style Master Domain Types
 * Types specific to Style Master operations
 */

/**
 * Style Master form data
 */
export interface StyleMasterFormData {
  styleMasterCode: string;
  styleMasterName: string;
  departments: string;
  customer: string;
  merchandiser: string;
  branch: string;
  vendorMerchandiser: string;
  segmentCode: string;
  packingSegment: string;
  considerPacking: string;
  vcp: string;
  make: string;
  price: string;
  reference: string;
  seasonSelection: string;
  styleColor: string;
  styleStatus: string;
}

/**
 * Style Master segment data
 */
export interface SegmentData {
  type: 'Color' | 'Size' | 'Season';
  code: string;
  name: string;
  values?: Array<{ code: string; name: string }>;
}

/**
 * Style Master segments collection
 */
export interface SegmentsData {
  Color?: Array<{ code: string; name: string; values?: Array<{ code: string; name: string }> }>;
  Size?: Array<{ code: string; name: string; values?: Array<{ code: string; name: string }> }>;
  Season?: Array<{ code: string; name: string; values?: Array<{ code: string; name: string }> }>;
}

/**
 * Attachment detail
 */
export interface AttachmentDetail {
  docName: string;
  remarks: string;
}

/**
 * Raw material
 */
export interface RawMaterial {
  itemCode: string;
  itemName: string;
}

/**
 * Allocation hierarchy row
 */
export interface AllocationHierarchyRow {
  rowIndex: number;
  quantity: string;
}

/**
 * Complete Style Master data
 */
export interface StyleMasterData extends StyleMasterFormData {
  segments?: SegmentsData;
  attachmentDetails?: AttachmentDetail[];
  rawMaterials?: RawMaterial[];
  allocationHierarchy?: AllocationHierarchyRow[];
}

/**
 * Finish goods row
 */
export interface FinishGoodsRow {
  rowIndex: number;
  itemCode: string;
  buyerPOItem?: string;
}

/**
 * Result of filling all segment data
 */
export interface FillSegmentDataResult {
  allSelected: boolean;
  successCount: number;
  totalSegments: number;
  failedSegments: string[];
}

/**
 * Result of selecting buyer PO items
 */
export interface SelectBuyerPOItemsResult {
  allSelected: boolean;
  successCount: number;
  totalRows: number;
  failedRows: number[];
}
