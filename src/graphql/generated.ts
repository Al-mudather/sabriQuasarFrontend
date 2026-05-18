import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  Decimal: { input: number; output: number; }
  ExpectedErrorType: { input: any; output: any; }
  GenericScalar: { input: any; output: any; }
  JSONString: { input: Record<string, number>; output: Record<string, number>; }
  SocialCamelJSON: { input: any; output: any; }
  Time: { input: any; output: any; }
  Upload: { input: File; output: File; }
};

export type AffiliateNode = MyNode & {
  __typename?: 'AffiliateNode';
  affiliateLink: Scalars['String']['output'];
  affiliaterecruitSet: AffiliateRecruitNodeConnection;
  affiliatewithdrawSet: AffiliateWithdrawNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};


export type AffiliateNodeAffiliaterecruitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type AffiliateNodeAffiliatewithdrawSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type AffiliateNodeConnection = {
  __typename?: 'AffiliateNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AffiliateNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `AffiliateNode` and its cursor. */
export type AffiliateNodeEdge = {
  __typename?: 'AffiliateNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<AffiliateNode>;
};

export type AffiliateRecruitNode = MyNode & {
  __typename?: 'AffiliateRecruitNode';
  affiliate: AffiliateNode;
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isSuccessful: Scalars['Boolean']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  reward: Maybe<Scalars['Decimal']['output']>;
  successfulOn: Maybe<Scalars['DateTime']['output']>;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};

export type AffiliateRecruitNodeConnection = {
  __typename?: 'AffiliateRecruitNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AffiliateRecruitNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `AffiliateRecruitNode` and its cursor. */
export type AffiliateRecruitNodeEdge = {
  __typename?: 'AffiliateRecruitNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<AffiliateRecruitNode>;
};

export type AffiliateWithdrawNode = MyNode & {
  __typename?: 'AffiliateWithdrawNode';
  affiliate: AffiliateNode;
  created: Scalars['DateTime']['output'];
  fullFilledOn: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isFullFilled: Scalars['Boolean']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  requestedAmount: Scalars['Decimal']['output'];
  requestedOn: Maybe<Scalars['DateTime']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type AffiliateWithdrawNodeConnection = {
  __typename?: 'AffiliateWithdrawNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AffiliateWithdrawNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `AffiliateWithdrawNode` and its cursor. */
export type AffiliateWithdrawNodeEdge = {
  __typename?: 'AffiliateWithdrawNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<AffiliateWithdrawNode>;
};

/** Create   */
export type ApprovePyramidWithdraw = {
  __typename?: 'ApprovePyramidWithdraw';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PyramidWithdrawNode>;
  isDone: Maybe<Scalars['Boolean']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ApprovePyramidWithdrawInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
};

/**
 * Archive account and revoke refresh tokens.
 *
 * User must be verified and confirm password.
 */
export type ArchiveAccount = {
  __typename?: 'ArchiveAccount';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type ArchiveCourseQuestion = {
  __typename?: 'ArchiveCourseQuestion';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  question: Maybe<QuestionNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type ArchiveQuestionReply = {
  __typename?: 'ArchiveQuestionReply';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  questionReply: Maybe<QuestionReplyNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type AssignAttachmentTransactionManager = {
  __typename?: 'AssignAttachmentTransactionManager';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionManagerNode>;
  manager: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type AssignAttachmentTransactionManagerInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  manager?: InputMaybe<Scalars['Int']['input']>;
};

/** Create   */
export type AssignCourseInstructor = {
  __typename?: 'AssignCourseInstructor';
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CourseInstructorNode>;
  instructor: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type AssignCourseInstructorInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  instructor?: InputMaybe<Scalars['Int']['input']>;
};

/** Create   */
export type AssignInstructor = {
  __typename?: 'AssignInstructor';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<InstructorNode>;
  qualification: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type AssignInstructorInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  qualification?: InputMaybe<Scalars['String']['input']>;
};

export type AttachmentTransactionManagerNode = MyNode & {
  __typename?: 'AttachmentTransactionManagerNode';
  attachmenttransactionSet: AttachmentTransactionNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  manager: CustomUserNode;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidId: Maybe<Scalars['String']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type AttachmentTransactionManagerNodeAttachmenttransactionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AttachmentTransactionManagerNodeConnection = {
  __typename?: 'AttachmentTransactionManagerNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttachmentTransactionManagerNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `AttachmentTransactionManagerNode` and its cursor. */
export type AttachmentTransactionManagerNodeEdge = {
  __typename?: 'AttachmentTransactionManagerNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<AttachmentTransactionManagerNode>;
};

export type AttachmentTransactionNode = MyNode & {
  __typename?: 'AttachmentTransactionNode';
  attachment: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  doneVerification: Scalars['Boolean']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  marketer: Maybe<PyramidNode>;
  marketerEndorse: Scalars['Boolean']['output'];
  operationNumber: Maybe<Scalars['String']['output']>;
  order: OrderNode;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidManager: Maybe<AttachmentTransactionManagerNode>;
  pyramidManagerEndorse: Scalars['Boolean']['output'];
  pyramidRetryPlease: Scalars['Boolean']['output'];
  retryPlease: Scalars['Boolean']['output'];
  similarOperations: Maybe<SubAttachmentTransactionNodeConnection>;
  updated: Scalars['DateTime']['output'];
};


export type AttachmentTransactionNodeSimilarOperationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  operationNumber?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};

export type AttachmentTransactionNodeConnection = {
  __typename?: 'AttachmentTransactionNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<AttachmentTransactionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `AttachmentTransactionNode` and its cursor. */
export type AttachmentTransactionNodeEdge = {
  __typename?: 'AttachmentTransactionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<AttachmentTransactionNode>;
};

export type BatchNode = MyNode & {
  __typename?: 'BatchNode';
  batchName: Maybe<Scalars['String']['output']>;
  certificateSet: CertificateNodeConnection;
  courseName: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  endDate: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  instructorName: Maybe<Scalars['String']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  totalHours: Maybe<Scalars['Float']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type BatchNodeCertificateSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type BatchNodeConnection = {
  __typename?: 'BatchNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<BatchNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `BatchNode` and its cursor. */
export type BatchNodeEdge = {
  __typename?: 'BatchNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<BatchNode>;
};

/** Bulk update conversion rates  */
export type BulkUpdateRates = {
  __typename?: 'BulkUpdateRates';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  updatedCount: Maybe<Scalars['Int']['output']>;
};

export type CaptureBraintreeCheckout = {
  __typename?: 'CaptureBraintreeCheckout';
  braintreeClientToken: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  session: Maybe<Scalars['JSONString']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CapturePaypalCheckout = {
  __typename?: 'CapturePaypalCheckout';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  session: Maybe<Scalars['JSONString']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CertificateNode = MyNode & {
  __typename?: 'CertificateNode';
  batch: Maybe<BatchNode>;
  created: Scalars['DateTime']['output'];
  endDate: Maybe<Scalars['DateTime']['output']>;
  enrollment: Maybe<EnrollmentNode>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isManual: Scalars['Boolean']['output'];
  isPrintable: Scalars['Boolean']['output'];
  isPrinted: Scalars['Boolean']['output'];
  isReady: Scalars['Boolean']['output'];
  issueDate: Maybe<Scalars['DateTime']['output']>;
  period: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  relatedWith: Maybe<Scalars['String']['output']>;
  serial: Maybe<Scalars['String']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  totalHours: Maybe<Scalars['Float']['output']>;
  updated: Scalars['DateTime']['output'];
  user: Maybe<CustomUserNode>;
};

export type CertificateNodeConnection = {
  __typename?: 'CertificateNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CertificateNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CertificateNode` and its cursor. */
export type CertificateNodeEdge = {
  __typename?: 'CertificateNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CertificateNode>;
};

/** Simple GraphQL subscription. */
export type CheckoutSubscription = {
  __typename?: 'CheckoutSubscription';
  notification: Maybe<NotificationNode>;
};

/** Create   */
export type ClaimAlhasifPartnerBalance = {
  __typename?: 'ClaimAlhasifPartnerBalance';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ClaimAlhasifPartnerBalanceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type ClaimCoursePartnerBalance = {
  __typename?: 'ClaimCoursePartnerBalance';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ClaimCoursePartnerBalanceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type ClaimPyramidLedgerBalance = {
  __typename?: 'ClaimPyramidLedgerBalance';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PyramidBalanceNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ClaimPyramidLedgerBalanceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type ClaimSabriPartnerBalance = {
  __typename?: 'ClaimSabriPartnerBalance';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ClaimSabriPartnerBalanceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Records when user clicks telegram link with course details and URL - prevents duplicate clicks  */
export type ClickTelegramLink = {
  __typename?: 'ClickTelegramLink';
  enrollment: Maybe<EnrollmentNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ContentArticleNode = MyNode & {
  __typename?: 'ContentArticleNode';
  article: Maybe<Scalars['String']['output']>;
  articleFromUrl: Maybe<Scalars['String']['output']>;
  articleTitle: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type ContentArticleNodeConnection = {
  __typename?: 'ContentArticleNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContentArticleNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `ContentArticleNode` and its cursor. */
export type ContentArticleNodeEdge = {
  __typename?: 'ContentArticleNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ContentArticleNode>;
};

export type ContentFileInput = {
  attachment: Scalars['Upload']['input'];
  title: Scalars['String']['input'];
};

export type ContentFileNode = MyNode & {
  __typename?: 'ContentFileNode';
  attachment: Scalars['String']['output'];
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
};

export type ContentQuizNode = MyNode & {
  __typename?: 'ContentQuizNode';
  contentquizquestionSet: ContentQuizQuestionNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isMandatory: Maybe<Scalars['Boolean']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  quizTitle: Scalars['String']['output'];
  submissions: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type ContentQuizNodeContentquizquestionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ContentQuizNodeConnection = {
  __typename?: 'ContentQuizNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContentQuizNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `ContentQuizNode` and its cursor. */
export type ContentQuizNodeEdge = {
  __typename?: 'ContentQuizNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ContentQuizNode>;
};

export type ContentQuizQuestionAnswerNode = MyNode & {
  __typename?: 'ContentQuizQuestionAnswerNode';
  answer: Maybe<Scalars['String']['output']>;
  contentQuizQuestion: ContentQuizQuestionNode;
  coursequizsolutionSet: CourseQuizSolutionNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isCorrect: Scalars['Boolean']['output'];
  order: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
  why: Maybe<Scalars['String']['output']>;
};


export type ContentQuizQuestionAnswerNodeCoursequizsolutionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ContentQuizQuestionAnswerNodeConnection = {
  __typename?: 'ContentQuizQuestionAnswerNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContentQuizQuestionAnswerNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `ContentQuizQuestionAnswerNode` and its cursor. */
export type ContentQuizQuestionAnswerNodeEdge = {
  __typename?: 'ContentQuizQuestionAnswerNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ContentQuizQuestionAnswerNode>;
};

export type ContentQuizQuestionNode = MyNode & {
  __typename?: 'ContentQuizQuestionNode';
  contentQuiz: ContentQuizNode;
  contentquizquestionanswerSet: ContentQuizQuestionAnswerNodeConnection;
  coursequizsolutionSet: CourseQuizSolutionNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  imageQuestion: Maybe<Scalars['String']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  question: Maybe<Scalars['String']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type ContentQuizQuestionNodeContentquizquestionanswerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ContentQuizQuestionNodeCoursequizsolutionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ContentQuizQuestionNodeConnection = {
  __typename?: 'ContentQuizQuestionNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContentQuizQuestionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `ContentQuizQuestionNode` and its cursor. */
export type ContentQuizQuestionNodeEdge = {
  __typename?: 'ContentQuizQuestionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ContentQuizQuestionNode>;
};

export type ContentTypeNode = MyNode & {
  __typename?: 'ContentTypeNode';
  appLabel: Scalars['String']['output'];
  courseunitcontentSet: CourseUnitContentNodeConnection;
  homepagesliderSet: HomePageSliderNodeConnection;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  model: Scalars['String']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  questionSet: QuestionNodeConnection;
};


export type ContentTypeNodeCourseunitcontentSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ContentTypeNodeHomepagesliderSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type ContentTypeNodeQuestionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type ContentUnion = ContentArticleNode | ContentFileNode | ContentQuizNode | ContentVideoNode | CourseUnitNode;

export type ContentVideoInput = {
  cipherIframe?: InputMaybe<Scalars['String']['input']>;
  isMeeting?: InputMaybe<Scalars['Boolean']['input']>;
  meetingData?: InputMaybe<Scalars['JSONString']['input']>;
  meetingType?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  video?: InputMaybe<Scalars['String']['input']>;
  videoMetadata?: InputMaybe<Scalars['JSONString']['input']>;
  videoTime?: InputMaybe<Scalars['String']['input']>;
  videoType?: InputMaybe<Scalars['String']['input']>;
};

export type ContentVideoNode = MyNode & {
  __typename?: 'ContentVideoNode';
  cipherIframe: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isMeeting: Scalars['Boolean']['output'];
  meetingData: Maybe<Scalars['JSONString']['output']>;
  meetingType: Maybe<Scalars['String']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  smartnodeKeyFile: Maybe<Scalars['String']['output']>;
  title: Maybe<Scalars['String']['output']>;
  updated: Scalars['DateTime']['output'];
  video: Maybe<Scalars['String']['output']>;
  videoMetadata: Maybe<Scalars['JSONString']['output']>;
  videoTime: Maybe<Scalars['Time']['output']>;
  videoTimeSeconds: Maybe<Scalars['String']['output']>;
  videoType: Maybe<ContentVideoVideoType>;
};

export type ContentVideoNodeConnection = {
  __typename?: 'ContentVideoNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<ContentVideoNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `ContentVideoNode` and its cursor. */
export type ContentVideoNodeEdge = {
  __typename?: 'ContentVideoNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<ContentVideoNode>;
};

/** An enumeration. */
export type ContentVideoVideoType =
  /** VdoCipher */
  | 'TYPE_CIPHER'
  /** Al-Hasif Video */
  | 'TYPE_HASIF'
  /** Not Specified */
  | 'TYPE_NONE'
  /** Smart Node */
  | 'TYPE_SMART'
  /** Youtube Video */
  | 'TYPE_YOUTUBE'
  /** Zoom Life Video */
  | 'TYPE_ZOOM_LIFE';

export type ConversionRateType = {
  __typename?: 'ConversionRateType';
  fromCurrency: Maybe<Scalars['String']['output']>;
  isAvailable: Maybe<Scalars['Boolean']['output']>;
  rate: Maybe<Scalars['Decimal']['output']>;
  reverseRate: Maybe<Scalars['Decimal']['output']>;
  toCurrency: Maybe<Scalars['String']['output']>;
};

export type CourseInput = {
  affiliateCommission?: InputMaybe<Scalars['Int']['input']>;
  allowEnrollment?: InputMaybe<Scalars['Boolean']['input']>;
  brief?: InputMaybe<Scalars['String']['input']>;
  certificateSignature?: InputMaybe<Scalars['Upload']['input']>;
  courseFee?: InputMaybe<Scalars['Float']['input']>;
  courseFeeInSdg?: InputMaybe<Scalars['Float']['input']>;
  courseLanguage?: InputMaybe<Scalars['Int']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['Int']['input']>;
  cover?: InputMaybe<Scalars['Upload']['input']>;
  examLink?: InputMaybe<Scalars['String']['input']>;
  hasCertificate?: InputMaybe<Scalars['Boolean']['input']>;
  isCompound?: InputMaybe<Scalars['Boolean']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  period?: InputMaybe<Scalars['Int']['input']>;
  profile?: InputMaybe<Scalars['Upload']['input']>;
  telegramLink?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  totalHours?: InputMaybe<Scalars['Int']['input']>;
};

export type CourseInstructorNode = MyNode & {
  __typename?: 'CourseInstructorNode';
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  instructor: InstructorNode;
  isMainInstructor: Scalars['Boolean']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type CourseInstructorNodeConnection = {
  __typename?: 'CourseInstructorNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseInstructorNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseInstructorNode` and its cursor. */
export type CourseInstructorNodeEdge = {
  __typename?: 'CourseInstructorNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseInstructorNode>;
};

export type CourseLanguageNode = MyNode & {
  __typename?: 'CourseLanguageNode';
  courseSet: CourseNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  languageCode: Scalars['String']['output'];
  languageName: Scalars['String']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type CourseLanguageNodeCourseSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

export type CourseLanguageNodeConnection = {
  __typename?: 'CourseLanguageNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseLanguageNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseLanguageNode` and its cursor. */
export type CourseLanguageNodeEdge = {
  __typename?: 'CourseLanguageNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseLanguageNode>;
};

export type CourseNode = MyNode & {
  __typename?: 'CourseNode';
  affiliateCommission: Scalars['Int']['output'];
  affiliaterecruitSet: AffiliateRecruitNodeConnection;
  allowEnrollment: Scalars['Boolean']['output'];
  brief: Scalars['String']['output'];
  certificateSignature: Maybe<Scalars['String']['output']>;
  compoundCourses: CourseNodeConnection;
  courseFee: Scalars['Decimal']['output'];
  courseFeeInSdg: Scalars['Decimal']['output'];
  courseHours: Maybe<Scalars['String']['output']>;
  courseLanguage: CourseLanguageNode;
  courseSet: CourseNodeConnection;
  courseSpecialities: CourseSpecialityNodeConnection;
  courseSpeciality: CourseSpecialityNode;
  courseinstructorSet: CourseInstructorNodeConnection;
  courseunitSet: CourseUnitNodeConnection;
  cover: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  currency: Maybe<Scalars['JSONString']['output']>;
  enrolled: Maybe<Scalars['Boolean']['output']>;
  enrollmentCount: Maybe<Scalars['Int']['output']>;
  enrollmentSet: EnrollmentNodeConnection;
  examLink: Maybe<Scalars['String']['output']>;
  hasCertificate: Scalars['Boolean']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isCompound: Scalars['Boolean']['output'];
  isDraft: Scalars['Boolean']['output'];
  isPaid: Scalars['Boolean']['output'];
  isSdgExchange: Scalars['Boolean']['output'];
  lifestreamSet: LifeStreamNodeConnection;
  orderdetailsSet: OrderDetailsNodeConnection;
  otherCourses: CourseUnitNodeConnection;
  partnerbalanceSet: PartnerBalanceNodeConnection;
  partnerrewardledgerSet: PartnerRewardLedgerNodeConnection;
  period: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  prerequisiteSet: PrerequisiteNodeConnection;
  profile: Maybe<Scalars['String']['output']>;
  pyramidrecruitSet: PyramidRecruitNodeConnection;
  slug: Maybe<Scalars['String']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  telegramLink: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  totalHours: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
  whatyouwilllearnSet: WhatYouWillLearnNodeConnection;
};


export type CourseNodeAffiliaterecruitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodeCompoundCoursesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type CourseNodeCourseSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type CourseNodeCourseSpecialitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodeCourseinstructorSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodeCourseunitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type CourseNodeEnrollmentSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  course_Title?: InputMaybe<Scalars['String']['input']>;
  course_Title_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};


export type CourseNodeLifestreamSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodeOrderdetailsSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodeOtherCoursesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type CourseNodePartnerbalanceSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodePartnerrewardledgerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodePrerequisiteSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodePyramidrecruitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseNodeWhatyouwilllearnSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type CourseNodeConnection = {
  __typename?: 'CourseNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseNode` and its cursor. */
export type CourseNodeEdge = {
  __typename?: 'CourseNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseNode>;
};

export type CourseQuizSolutionNode = MyNode & {
  __typename?: 'CourseQuizSolutionNode';
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  question: ContentQuizQuestionNode;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
  userAnswer: ContentQuizQuestionAnswerNode;
};

export type CourseQuizSolutionNodeConnection = {
  __typename?: 'CourseQuizSolutionNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseQuizSolutionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseQuizSolutionNode` and its cursor. */
export type CourseQuizSolutionNodeEdge = {
  __typename?: 'CourseQuizSolutionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseQuizSolutionNode>;
};

export type CourseSpecialityInput = {
  institute?: InputMaybe<Scalars['Int']['input']>;
  speciality?: InputMaybe<Scalars['String']['input']>;
};

export type CourseSpecialityNode = MyNode & {
  __typename?: 'CourseSpecialityNode';
  courseSet: CourseNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  institute: Maybe<InstituteNode>;
  pk: Maybe<Scalars['Int']['output']>;
  specialities: CourseNodeConnection;
  speciality: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
};


export type CourseSpecialityNodeCourseSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


export type CourseSpecialityNodeSpecialitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

export type CourseSpecialityNodeConnection = {
  __typename?: 'CourseSpecialityNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseSpecialityNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseSpecialityNode` and its cursor. */
export type CourseSpecialityNodeEdge = {
  __typename?: 'CourseSpecialityNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseSpecialityNode>;
};

export type CourseUnitContentInput = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
  courseUnitId?: InputMaybe<Scalars['Int']['input']>;
};

export type CourseUnitContentNode = MyNode & {
  __typename?: 'CourseUnitContentNode';
  content: Maybe<ContentUnion>;
  contentType: ContentTypeNode;
  courseUnit: CourseUnitNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isFree: Scalars['Boolean']['output'];
  isMandatory: Scalars['Boolean']['output'];
  learningprogressSet: LearningProgressNodeConnection;
  modelName: Maybe<Scalars['String']['output']>;
  modelValue: Maybe<Scalars['JSONString']['output']>;
  objectId: Scalars['Int']['output'];
  order: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type CourseUnitContentNodeLearningprogressSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type CourseUnitContentNodeConnection = {
  __typename?: 'CourseUnitContentNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseUnitContentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseUnitContentNode` and its cursor. */
export type CourseUnitContentNodeEdge = {
  __typename?: 'CourseUnitContentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseUnitContentNode>;
};

export type CourseUnitInput = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CourseUnitNode = MyNode & {
  __typename?: 'CourseUnitNode';
  course: Maybe<CourseNode>;
  courseunitSet: CourseUnitNodeConnection;
  courseunitcontentSet: CourseUnitContentNodeConnection;
  created: Scalars['DateTime']['output'];
  external: Maybe<CourseUnitNode>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isExternal: Scalars['Boolean']['output'];
  lifestreamSet: LifeStreamNodeConnection;
  order: Maybe<Scalars['Int']['output']>;
  otherCourses: CourseNodeConnection;
  pk: Maybe<Scalars['Int']['output']>;
  title: Maybe<Scalars['String']['output']>;
  updated: Scalars['DateTime']['output'];
};


export type CourseUnitNodeCourseunitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


export type CourseUnitNodeCourseunitcontentSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseUnitNodeLifestreamSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CourseUnitNodeOtherCoursesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};

export type CourseUnitNodeConnection = {
  __typename?: 'CourseUnitNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CourseUnitNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CourseUnitNode` and its cursor. */
export type CourseUnitNodeEdge = {
  __typename?: 'CourseUnitNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CourseUnitNode>;
};

/** Create   */
export type CreateAttachmentTransaction = {
  __typename?: 'CreateAttachmentTransaction';
  attachment: Maybe<Scalars['Upload']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  doneVerification: Maybe<Scalars['Boolean']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionNode>;
  marketer: Maybe<Scalars['Int']['output']>;
  marketerEndorse: Maybe<Scalars['Boolean']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  pyramidManager: Maybe<Scalars['Int']['output']>;
  pyramidManagerEndorse: Maybe<Scalars['Boolean']['output']>;
  pyramidRetryPlease: Maybe<Scalars['Boolean']['output']>;
  retryPlease: Maybe<Scalars['Boolean']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateAttachmentTransactionInput = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  marketer?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  pyramidManager?: InputMaybe<Scalars['Int']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Create   */
export type CreateBatch = {
  __typename?: 'CreateBatch';
  batchName: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  courseName: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<BatchNode>;
  instructorName: Maybe<Scalars['String']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  totalHours: Maybe<Scalars['Float']['output']>;
};

export type CreateBatchInput = {
  batchName?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  courseName?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  instructorName?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  totalHours?: InputMaybe<Scalars['Float']['input']>;
};

export type CreateBraintreeCheckout = {
  __typename?: 'CreateBraintreeCheckout';
  braintreeClientToken: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateBulkOrderDetails = {
  __typename?: 'CreateBulkOrderDetails';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  order: Maybe<OrderNodeConnection>;
  orderDetails: Maybe<OrderDetailsNodeConnection>;
  success: Maybe<Scalars['Boolean']['output']>;
};


/** Enables logged in users to create order request  */
export type CreateBulkOrderDetailsOrderArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  isDonePayment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Enables logged in users to create order request  */
export type CreateBulkOrderDetailsOrderDetailsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Create   */
export type CreateCertificate = {
  __typename?: 'CreateCertificate';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CertificateNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateCertificateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type CreateContentFile = {
  __typename?: 'CreateContentFile';
  content: Maybe<ContentFileNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type CreateContentQuiz = {
  __typename?: 'CreateContentQuiz';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizNode>;
  isMandatory: Maybe<Scalars['Boolean']['output']>;
  quizTitle: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateContentQuizInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  isMandatory?: InputMaybe<Scalars['Boolean']['input']>;
  quizTitle?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type CreateContentQuizQuestion = {
  __typename?: 'CreateContentQuizQuestion';
  clientMutationId: Maybe<Scalars['String']['output']>;
  contentQuiz: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  imageQuestion: Maybe<Scalars['Upload']['output']>;
  instance: Maybe<ContentQuizQuestionNode>;
  order: Maybe<Scalars['Int']['output']>;
  question: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type CreateContentQuizQuestionAnswer = {
  __typename?: 'CreateContentQuizQuestionAnswer';
  answer: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  contentQuizQuestion: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizQuestionAnswerNode>;
  isCorrect: Maybe<Scalars['Boolean']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  why: Maybe<Scalars['String']['output']>;
};

export type CreateContentQuizQuestionAnswerInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contentQuizQuestion?: InputMaybe<Scalars['Int']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  why?: InputMaybe<Scalars['String']['input']>;
};

export type CreateContentQuizQuestionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contentQuiz?: InputMaybe<Scalars['Int']['input']>;
  imageQuestion?: InputMaybe<Scalars['Upload']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type CreateContentUnit = {
  __typename?: 'CreateContentUnit';
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  external: Maybe<Scalars['Int']['output']>;
  instance: Maybe<CourseUnitNode>;
  success: Maybe<Scalars['Boolean']['output']>;
  title: Maybe<Scalars['String']['output']>;
};

export type CreateContentUnitInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  external?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type CreateContentVideo = {
  __typename?: 'CreateContentVideo';
  content: Maybe<ContentVideoNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateCourse = {
  __typename?: 'CreateCourse';
  course: Maybe<CourseNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateCourseQuestion = {
  __typename?: 'CreateCourseQuestion';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  question: Maybe<QuestionNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type CreateCourseQuizSolution = {
  __typename?: 'CreateCourseQuizSolution';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CourseQuizSolutionNode>;
  question: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  userAnswer: Maybe<Scalars['Int']['output']>;
};

export type CreateCourseQuizSolutionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  question?: InputMaybe<Scalars['Int']['input']>;
  userAnswer?: InputMaybe<Scalars['Int']['input']>;
};

/** Create company  */
export type CreateCourseSpeciality = {
  __typename?: 'CreateCourseSpeciality';
  courseSpeciality: Maybe<CourseSpecialityNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateCourseUnit = {
  __typename?: 'CreateCourseUnit';
  courseUnit: Maybe<CourseUnitNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create currency  */
export type CreateCurrency = {
  __typename?: 'CreateCurrency';
  currency: Maybe<CurrencyNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create currency converter  */
export type CreateCurrencyConverter = {
  __typename?: 'CreateCurrencyConverter';
  currencyConverter: Maybe<CurrencyConverterNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create currency rate history record  */
export type CreateCurrencyRateHistory = {
  __typename?: 'CreateCurrencyRateHistory';
  currencyRateHistory: Maybe<CurrencyRateHistoryNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateFeedback = {
  __typename?: 'CreateFeedback';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  feedback: Maybe<EnrollmentFeedbackNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type CreateHomePageSlider = {
  __typename?: 'CreateHomePageSlider';
  clientMutationId: Maybe<Scalars['String']['output']>;
  cost: Maybe<Scalars['Float']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<HomePageSliderNode>;
  institute: Maybe<Scalars['Int']['output']>;
  isPublished: Maybe<Scalars['Boolean']['output']>;
  modelType: Maybe<Scalars['String']['output']>;
  objectId: Maybe<Scalars['Int']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateHomePageSliderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  institute?: InputMaybe<Scalars['Int']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  modelType?: InputMaybe<Scalars['String']['input']>;
  objectId?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Create   */
export type CreateInstitute = {
  __typename?: 'CreateInstitute';
  brief: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  cover: Maybe<Scalars['Upload']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<InstituteNode>;
  profile: Maybe<Scalars['Upload']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  title: Maybe<Scalars['String']['output']>;
};

export type CreateInstituteInput = {
  brief?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<Scalars['Upload']['input']>;
  profile?: InputMaybe<Scalars['Upload']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type CreateInstructor = {
  __typename?: 'CreateInstructor';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<InstructorNode>;
  qualification: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateInstructorInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  qualification?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type CreateLifeStream = {
  __typename?: 'CreateLifeStream';
  agenda: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  createData: Maybe<Scalars['JSONString']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<LifeStreamNode>;
  success: Maybe<Scalars['Boolean']['output']>;
  topic: Maybe<Scalars['String']['output']>;
};

export type CreateLifeStreamInput = {
  agenda?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  createData?: InputMaybe<Scalars['JSONString']['input']>;
  topic?: InputMaybe<Scalars['String']['input']>;
};

/** Update  */
export type CreateLifeStreamSignature = {
  __typename?: 'CreateLifeStreamSignature';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<LifeStreamSignatureNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateLifeStreamSignatureInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type CreateManualBatchCertificate = {
  __typename?: 'CreateManualBatchCertificate';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CertificateNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateManualBatchCertificateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type CreateManualCertificate = {
  __typename?: 'CreateManualCertificate';
  clientMutationId: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CertificateNode>;
  relatedWith: Maybe<Scalars['String']['output']>;
  serial: Maybe<Scalars['String']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  totalHours: Maybe<Scalars['Float']['output']>;
};

export type CreateManualCertificateInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  relatedWith?: InputMaybe<Scalars['String']['input']>;
  serial?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  totalHours?: InputMaybe<Scalars['Float']['input']>;
};

/** Enables logged in users to create order request  */
export type CreateNewOrderWithBulkOrderDetails = {
  __typename?: 'CreateNewOrderWithBulkOrderDetails';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  order: Maybe<OrderNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateOrder = {
  __typename?: 'CreateOrder';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  order: Maybe<OrderNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type CreatePartnerBalance = {
  __typename?: 'CreatePartnerBalance';
  balance: Maybe<Scalars['Float']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerBalanceNode>;
  partnerType: Maybe<Scalars['String']['output']>;
  pyramidHead: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreatePartnerBalanceInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  partnerType?: InputMaybe<Scalars['String']['input']>;
  pyramidHead?: InputMaybe<Scalars['Int']['input']>;
};

/** Create   */
export type CreatePartnerRewardLedger = {
  __typename?: 'CreatePartnerRewardLedger';
  amount: Maybe<Scalars['Float']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerRewardLedgerNode>;
  isRedeemed: Maybe<Scalars['Boolean']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  partnerType: Maybe<Scalars['String']['output']>;
  pyramidHead: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreatePartnerRewardLedgerInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  isRedeemed?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  partnerType?: InputMaybe<Scalars['String']['input']>;
  pyramidHead?: InputMaybe<Scalars['Int']['input']>;
};

/** Create   */
export type CreatePartnerWithdraw = {
  __typename?: 'CreatePartnerWithdraw';
  amount: Maybe<Scalars['Float']['output']>;
  approvedBy: Maybe<Scalars['Int']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerWithdrawNode>;
  isDone: Maybe<Scalars['Boolean']['output']>;
  partnerBalance: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  user: Maybe<Scalars['Int']['output']>;
};

export type CreatePartnerWithdrawInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  approvedBy?: InputMaybe<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  partnerBalance?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['Int']['input']>;
};

export type CreatePaypalCheckout = {
  __typename?: 'CreatePaypalCheckout';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  paymentUrl: Maybe<Scalars['String']['output']>;
  session: Maybe<Scalars['JSONString']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreatePrerequisite = {
  __typename?: 'CreatePrerequisite';
  content: Maybe<PrerequisiteNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateQuestionReply = {
  __typename?: 'CreateQuestionReply';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  questionReply: Maybe<QuestionReplyNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateSmartNodeCheckout = {
  __typename?: 'CreateSmartNodeCheckout';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateStripeCheckout = {
  __typename?: 'CreateStripeCheckout';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  paymentUrl: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type CreateWhatYouWillLearn = {
  __typename?: 'CreateWhatYouWillLearn';
  content: Maybe<WhatYouWillLearnNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update  */
export type CreateZoomLifeStream = {
  __typename?: 'CreateZoomLifeStream';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<LifeStreamNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type CreateZoomLifeStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type CurrencyConverterInput = {
  conversionRate?: InputMaybe<Scalars['Decimal']['input']>;
  fromCurrency?: InputMaybe<Scalars['Int']['input']>;
  toCurrency?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * GraphQL type for CurrencyConverter model with admin-only access.
 * Only staff members can access currency conversion information.
 */
export type CurrencyConverterNode = MyNode & {
  __typename?: 'CurrencyConverterNode';
  conversionPair: Maybe<Scalars['String']['output']>;
  /** Conversion rate: 1 unit of from_currency = X units of to_currency */
  conversionRate: Scalars['Decimal']['output'];
  created: Scalars['DateTime']['output'];
  /** Currency to convert from */
  fromCurrency: Maybe<CurrencyNode>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  /** When the rate was last updated */
  lastRateUpdate: Maybe<Scalars['DateTime']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  /** Previous conversion rate for comparison */
  previousRate: Maybe<Scalars['Decimal']['output']>;
  rateAgeDays: Maybe<Scalars['Int']['output']>;
  /** Percentage change from previous rate */
  rateChangePercentage: Maybe<Scalars['Decimal']['output']>;
  rateDirection: Maybe<Scalars['String']['output']>;
  rateHistory: CurrencyRateHistoryNodeConnection;
  reverseRate: Maybe<Scalars['Decimal']['output']>;
  /** Currency to convert to */
  toCurrency: Maybe<CurrencyNode>;
  updated: Scalars['DateTime']['output'];
  updatedBy: Maybe<CustomUserNode>;
};


/**
 * GraphQL type for CurrencyConverter model with admin-only access.
 * Only staff members can access currency conversion information.
 */
export type CurrencyConverterNodeRateHistoryArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  changePercentage?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  converter_FromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_FromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  previousRate?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  rate_Gt?: InputMaybe<Scalars['Float']['input']>;
  rate_Gte?: InputMaybe<Scalars['Float']['input']>;
  rate_Lt?: InputMaybe<Scalars['Float']['input']>;
  rate_Lte?: InputMaybe<Scalars['Float']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};

export type CurrencyConverterNodeConnection = {
  __typename?: 'CurrencyConverterNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CurrencyConverterNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CurrencyConverterNode` and its cursor. */
export type CurrencyConverterNodeEdge = {
  __typename?: 'CurrencyConverterNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CurrencyConverterNode>;
};

export type CurrencyInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
};

/**
 * GraphQL type for Currency model with admin-only access.
 * Only staff members can access currency information.
 */
export type CurrencyNode = MyNode & {
  __typename?: 'CurrencyNode';
  /** ISO 4217 three-letter currency code (e.g., USD, EUR) */
  code: Scalars['String']['output'];
  /** Currency to convert from */
  conversionsFrom: CurrencyConverterNodeConnection;
  /** Currency to convert to */
  conversionsTo: CurrencyConverterNodeConnection;
  converterCount: Maybe<Scalars['Int']['output']>;
  created: Scalars['DateTime']['output'];
  createdBy: Maybe<CustomUserNode>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  /** Whether this currency is actively used */
  isActive: Scalars['Boolean']['output'];
  isMajorCurrency: Maybe<Scalars['Boolean']['output']>;
  /** Full currency name (e.g., US Dollar, Euro) */
  name: Scalars['String']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  /** Currency symbol (e.g., $, €, £) */
  symbol: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
  updatedBy: Maybe<CustomUserNode>;
};


/**
 * GraphQL type for Currency model with admin-only access.
 * Only staff members can access currency information.
 */
export type CurrencyNodeConversionsFromArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversionRate?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastRateUpdate?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  rateChangePercentage?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  toCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  toCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/**
 * GraphQL type for Currency model with admin-only access.
 * Only staff members can access currency information.
 */
export type CurrencyNodeConversionsToArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversionRate?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastRateUpdate?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  rateChangePercentage?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  toCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  toCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CurrencyNodeConnection = {
  __typename?: 'CurrencyNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CurrencyNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CurrencyNode` and its cursor. */
export type CurrencyNodeEdge = {
  __typename?: 'CurrencyNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CurrencyNode>;
};

export type CurrencyRateHistoryInput = {
  changePercentage?: InputMaybe<Scalars['Decimal']['input']>;
  converter?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  previousRate?: InputMaybe<Scalars['Decimal']['input']>;
  rate?: InputMaybe<Scalars['Decimal']['input']>;
};

/**
 * GraphQL type for CurrencyRateHistory model with admin-only access.
 * Only staff members can access currency rate history information.
 */
export type CurrencyRateHistoryNode = MyNode & {
  __typename?: 'CurrencyRateHistoryNode';
  changeDirection: Maybe<Scalars['String']['output']>;
  changeMagnitude: Maybe<Scalars['String']['output']>;
  /** Percentage change from previous rate */
  changePercentage: Maybe<Scalars['Decimal']['output']>;
  conversionPair: Maybe<Scalars['String']['output']>;
  converter: CurrencyConverterNode;
  created: Scalars['DateTime']['output'];
  formattedChange: Maybe<Scalars['String']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  /** Optional notes about the rate change */
  notes: Scalars['String']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  /** The previous conversion rate */
  previousRate: Maybe<Scalars['Decimal']['output']>;
  /** The new conversion rate */
  rate: Scalars['Decimal']['output'];
  updatedBy: Maybe<CustomUserNode>;
};

export type CurrencyRateHistoryNodeConnection = {
  __typename?: 'CurrencyRateHistoryNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CurrencyRateHistoryNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CurrencyRateHistoryNode` and its cursor. */
export type CurrencyRateHistoryNodeEdge = {
  __typename?: 'CurrencyRateHistoryNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CurrencyRateHistoryNode>;
};

export type CustomUserNode = MyNode & {
  __typename?: 'CustomUserNode';
  affiliateSet: AffiliateNodeConnection;
  affiliaterecruitSet: AffiliateRecruitNodeConnection;
  approvedBy: PartnerWithdrawNodeConnection;
  archived: Maybe<Scalars['Boolean']['output']>;
  certificateName: Maybe<Scalars['String']['output']>;
  certificateNameConfirm: Maybe<Scalars['String']['output']>;
  certificateSet: CertificateNodeConnection;
  coursequizsolutionSet: CourseQuizSolutionNodeConnection;
  createdCurrencies: CurrencyNodeConnection;
  currencyratehistorySet: CurrencyRateHistoryNodeConnection;
  dateJoined: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  enrollmentSet: EnrollmentNodeConnection;
  firstName: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  gender: Maybe<UserGender>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  instructorSet: InstructorNodeConnection;
  /** Designates whether this user should be treated as active. Unselect this instead of deleting accounts. */
  isActive: Scalars['Boolean']['output'];
  isAttachmentTransactionManager: Maybe<Scalars['Boolean']['output']>;
  isInstructor: Maybe<Scalars['Boolean']['output']>;
  isPyramidAdmin: Maybe<Scalars['Boolean']['output']>;
  isPyramidMarketer: Maybe<Scalars['Boolean']['output']>;
  /** Designates whether the user can log into this admin site. */
  isStaff: Scalars['Boolean']['output'];
  /** Designates that this user has all permissions without explicitly assigning them. */
  isSuperuser: Scalars['Boolean']['output'];
  lastLogin: Maybe<Scalars['DateTime']['output']>;
  lastName: Scalars['String']['output'];
  lifestreamSet: LifeStreamNodeConnection;
  lifestreamsignatureSet: LifeStreamSignatureNodeConnection;
  manager: AttachmentTransactionManagerNodeConnection;
  notificationSet: NotificationNodeConnection;
  orderSet: OrderNodeConnection;
  partnerwithdrawSet: PartnerWithdrawNodeConnection;
  phoneNumber: Maybe<Scalars['String']['output']>;
  phoneNumber2: Maybe<Scalars['String']['output']>;
  phoneNumber3: Maybe<Scalars['String']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidSet: PyramidNodeConnection;
  pyramidaffiliateSet: PyramidAffiliateNodeConnection;
  pyramidwithdrawSet: PyramidWithdrawNodeConnection;
  questionSet: QuestionNodeConnection;
  questionreplySet: QuestionReplyNodeConnection;
  secondaryEmail: Maybe<Scalars['String']['output']>;
  socialAuth: SocialNodeConnection;
  updatedConverters: CurrencyConverterNodeConnection;
  updatedCurrencies: CurrencyNodeConnection;
  userCurrency: Maybe<Scalars['String']['output']>;
  username: Scalars['String']['output'];
  verified: Maybe<Scalars['Boolean']['output']>;
};


export type CustomUserNodeAffiliateSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeAffiliaterecruitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeApprovedByArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeCertificateSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeCoursequizsolutionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeCreatedCurrenciesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_Icontains?: InputMaybe<Scalars['String']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


export type CustomUserNodeCurrencyratehistorySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  changePercentage?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  converter_FromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_FromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  previousRate?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  rate_Gt?: InputMaybe<Scalars['Float']['input']>;
  rate_Gte?: InputMaybe<Scalars['Float']['input']>;
  rate_Lt?: InputMaybe<Scalars['Float']['input']>;
  rate_Lte?: InputMaybe<Scalars['Float']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};


export type CustomUserNodeEnrollmentSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  course_Title?: InputMaybe<Scalars['String']['input']>;
  course_Title_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};


export type CustomUserNodeInstructorSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeLifestreamSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeLifestreamsignatureSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeManagerArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeNotificationSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  extraData?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  source?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


export type CustomUserNodeOrderSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  isDonePayment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodePartnerwithdrawSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodePyramidSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pyramidId?: InputMaybe<Scalars['String']['input']>;
};


export type CustomUserNodePyramidaffiliateSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodePyramidwithdrawSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeQuestionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeQuestionreplySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type CustomUserNodeSocialAuthArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  provider_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  uid?: InputMaybe<Scalars['String']['input']>;
  uid_In?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


export type CustomUserNodeUpdatedConvertersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversionRate?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastRateUpdate?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  rateChangePercentage?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  toCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  toCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


export type CustomUserNodeUpdatedCurrenciesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_Icontains?: InputMaybe<Scalars['String']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type CustomUserNodeConnection = {
  __typename?: 'CustomUserNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<CustomUserNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `CustomUserNode` and its cursor. */
export type CustomUserNodeEdge = {
  __typename?: 'CustomUserNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<CustomUserNode>;
};

export type DashboardAuth = {
  __typename?: 'DashboardAuth';
  refreshToken: Maybe<Scalars['String']['output']>;
  token: Maybe<Scalars['String']['output']>;
  user: Maybe<CustomUserNode>;
};

/**
 * Delete account permanently or make `user.is_active=False`.
 *
 * The behavior is defined on settings.
 * Anyway user refresh tokens are revoked.
 *
 * User must be verified and confirm password.
 */
export type DeleteAccount = {
  __typename?: 'DeleteAccount';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Delete  */
export type DeleteBatch = {
  __typename?: 'DeleteBatch';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<BatchNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteBatchInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type DeleteContentFile = {
  __typename?: 'DeleteContentFile';
  content: Maybe<ContentFileNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Delete  */
export type DeleteContentQuiz = {
  __typename?: 'DeleteContentQuiz';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteContentQuizInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Delete  */
export type DeleteContentQuizQuestion = {
  __typename?: 'DeleteContentQuizQuestion';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizQuestionNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Delete  */
export type DeleteContentQuizQuestionAnswer = {
  __typename?: 'DeleteContentQuizQuestionAnswer';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizQuestionAnswerNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteContentQuizQuestionAnswerInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteContentQuizQuestionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type DeleteContentVideo = {
  __typename?: 'DeleteContentVideo';
  content: Maybe<ContentVideoNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type DeleteCourse = {
  __typename?: 'DeleteCourse';
  course: Maybe<CourseNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type DeleteCourseInstructor = {
  __typename?: 'DeleteCourseInstructor';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CourseInstructorNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteCourseInstructorInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Delete course_speciality  */
export type DeleteCourseSpeciality = {
  __typename?: 'DeleteCourseSpeciality';
  courseSpeciality: Maybe<CourseSpecialityNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type DeleteCourseUnit = {
  __typename?: 'DeleteCourseUnit';
  courseUnit: Maybe<CourseUnitNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Delete currency  */
export type DeleteCurrency = {
  __typename?: 'DeleteCurrency';
  currency: Maybe<CurrencyNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Delete currency converter  */
export type DeleteCurrencyConverter = {
  __typename?: 'DeleteCurrencyConverter';
  currencyConverter: Maybe<CurrencyConverterNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Delete currency rate history record  */
export type DeleteCurrencyRateHistory = {
  __typename?: 'DeleteCurrencyRateHistory';
  currencyRateHistory: Maybe<CurrencyRateHistoryNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type DeleteHomePageSlider = {
  __typename?: 'DeleteHomePageSlider';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<HomePageSliderNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteHomePageSliderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Delete  */
export type DeleteLifeStream = {
  __typename?: 'DeleteLifeStream';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<LifeStreamNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeleteLifeStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Delete  */
export type DeletePartnerBalance = {
  __typename?: 'DeletePartnerBalance';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerBalanceNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeletePartnerBalanceInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Delete  */
export type DeletePartnerRewardLedger = {
  __typename?: 'DeletePartnerRewardLedger';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerRewardLedgerNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeletePartnerRewardLedgerInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Delete  */
export type DeletePartnerWithdraw = {
  __typename?: 'DeletePartnerWithdraw';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerWithdrawNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type DeletePartnerWithdrawInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type DeletePrerequisite = {
  __typename?: 'DeletePrerequisite';
  content: Maybe<PrerequisiteNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type DeleteWhatYouWillLearn = {
  __typename?: 'DeleteWhatYouWillLearn';
  content: Maybe<WhatYouWillLearnNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type DoneReadingNotification = {
  __typename?: 'DoneReadingNotification';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type EndLearningUnit = {
  __typename?: 'EndLearningUnit';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  learning: Maybe<LearningProgressNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type EnrollmentFeedbackNode = MyNode & {
  __typename?: 'EnrollmentFeedbackNode';
  created: Scalars['DateTime']['output'];
  enrollment: EnrollmentNode;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  rating: Scalars['Int']['output'];
  text: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
};

export type EnrollmentFeedbackNodeConnection = {
  __typename?: 'EnrollmentFeedbackNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EnrollmentFeedbackNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `EnrollmentFeedbackNode` and its cursor. */
export type EnrollmentFeedbackNodeEdge = {
  __typename?: 'EnrollmentFeedbackNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<EnrollmentFeedbackNode>;
};

export type EnrollmentNode = MyNode & {
  __typename?: 'EnrollmentNode';
  applyEnrollmentConstraints: Scalars['Boolean']['output'];
  certificateSet: CertificateNodeConnection;
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  endEnrollmentDate: Maybe<Scalars['DateTime']['output']>;
  enrollmentDate: Maybe<Scalars['DateTime']['output']>;
  enrollmentfeedbackSet: EnrollmentFeedbackNodeConnection;
  extraEnrollmentDate: Maybe<Scalars['DateTime']['output']>;
  extraEnrollmentDateEnd: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isExpired: Scalars['Boolean']['output'];
  isPaidSubscription: Scalars['Boolean']['output'];
  learningprogressSet: LearningProgressNodeConnection;
  lifestreamsignatureSet: LifeStreamSignatureNodeConnection;
  metadata: Scalars['JSONString']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};


export type EnrollmentNodeCertificateSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type EnrollmentNodeEnrollmentfeedbackSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type EnrollmentNodeLearningprogressSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type EnrollmentNodeLifestreamsignatureSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type EnrollmentNodeConnection = {
  __typename?: 'EnrollmentNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<EnrollmentNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `EnrollmentNode` and its cursor. */
export type EnrollmentNodeEdge = {
  __typename?: 'EnrollmentNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<EnrollmentNode>;
};

export type HomePageSliderNode = MyNode & {
  __typename?: 'HomePageSliderNode';
  contentType: Maybe<ContentTypeNode>;
  cost: Maybe<Scalars['Float']['output']>;
  created: Scalars['DateTime']['output'];
  endDate: Maybe<Scalars['DateTime']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  institute: Maybe<InstituteNode>;
  isPublished: Scalars['Boolean']['output'];
  objectId: Scalars['Int']['output'];
  order: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  slide: Maybe<SlideUnion>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type HomePageSliderNodeConnection = {
  __typename?: 'HomePageSliderNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<HomePageSliderNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `HomePageSliderNode` and its cursor. */
export type HomePageSliderNodeEdge = {
  __typename?: 'HomePageSliderNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<HomePageSliderNode>;
};

export type InstituteNode = MyNode & {
  __typename?: 'InstituteNode';
  brief: Scalars['String']['output'];
  coursespecialitySet: CourseSpecialityNodeConnection;
  cover: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  homepagesliderSet: HomePageSliderNodeConnection;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  profile: Maybe<Scalars['String']['output']>;
  slug: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
};


export type InstituteNodeCoursespecialitySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type InstituteNodeHomepagesliderSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type InstituteNodeConnection = {
  __typename?: 'InstituteNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InstituteNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `InstituteNode` and its cursor. */
export type InstituteNodeEdge = {
  __typename?: 'InstituteNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<InstituteNode>;
};

export type InstructorNode = MyNode & {
  __typename?: 'InstructorNode';
  courseinstructorSet: CourseInstructorNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  image: Maybe<Scalars['String']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  qualification: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};


export type InstructorNodeCourseinstructorSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type InstructorNodeConnection = {
  __typename?: 'InstructorNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<InstructorNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `InstructorNode` and its cursor. */
export type InstructorNodeEdge = {
  __typename?: 'InstructorNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<InstructorNode>;
};

/** Create   */
export type JoinPlatform = {
  __typename?: 'JoinPlatform';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PyramidAffiliateNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type JoinPlatformInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type JoinPyramidProgram = {
  __typename?: 'JoinPyramidProgram';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PyramidNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type JoinPyramidProgramInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type LearningProgressNode = MyNode & {
  __typename?: 'LearningProgressNode';
  begin: Maybe<Scalars['DateTime']['output']>;
  complete: Maybe<Scalars['DateTime']['output']>;
  courseUnitContent: CourseUnitContentNode;
  created: Scalars['DateTime']['output'];
  enrollment: EnrollmentNode;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type LearningProgressNodeConnection = {
  __typename?: 'LearningProgressNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LearningProgressNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `LearningProgressNode` and its cursor. */
export type LearningProgressNodeEdge = {
  __typename?: 'LearningProgressNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<LearningProgressNode>;
};

export type LifeStreamNode = MyNode & {
  __typename?: 'LifeStreamNode';
  agenda: Maybe<Scalars['String']['output']>;
  course: Maybe<CourseNode>;
  courseUnit: Maybe<CourseUnitNode>;
  createData: Maybe<Scalars['JSONString']['output']>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  lifestreamsignatureSet: LifeStreamSignatureNodeConnection;
  pk: Maybe<Scalars['Int']['output']>;
  responseData: Maybe<Scalars['JSONString']['output']>;
  status: Maybe<LifeStreamStatus>;
  topic: Scalars['String']['output'];
  updated: Scalars['DateTime']['output'];
  user: Maybe<CustomUserNode>;
};


export type LifeStreamNodeLifestreamsignatureSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type LifeStreamNodeConnection = {
  __typename?: 'LifeStreamNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LifeStreamNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `LifeStreamNode` and its cursor. */
export type LifeStreamNodeEdge = {
  __typename?: 'LifeStreamNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<LifeStreamNode>;
};

export type LifeStreamSignatureNode = MyNode & {
  __typename?: 'LifeStreamSignatureNode';
  enrollment: Maybe<EnrollmentNode>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  lifeStream: Maybe<LifeStreamNode>;
  pk: Maybe<Scalars['Int']['output']>;
  signature: Maybe<Scalars['String']['output']>;
  user: Maybe<CustomUserNode>;
};

export type LifeStreamSignatureNodeConnection = {
  __typename?: 'LifeStreamSignatureNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<LifeStreamSignatureNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `LifeStreamSignatureNode` and its cursor. */
export type LifeStreamSignatureNodeEdge = {
  __typename?: 'LifeStreamSignatureNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<LifeStreamSignatureNode>;
};

/** An enumeration. */
export type LifeStreamStatus =
  /** Created */
  | 'A_1'
  /** Cloud Sync Success */
  | 'A_2'
  /** Cloud Sync Error */
  | 'A_3'
  /** Expired */
  | 'A_4';

/** Create   */
export type MakePyramidWithdraw = {
  __typename?: 'MakePyramidWithdraw';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PyramidWithdrawNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type MakePyramidWithdrawInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Upload   */
export type MarketerAttachmentTransactionConfirmation = {
  __typename?: 'MarketerAttachmentTransactionConfirmation';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionNode>;
  marketerEndorse: Maybe<Scalars['Boolean']['output']>;
  retryPlease: Maybe<Scalars['Boolean']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type MarketerAttachmentTransactionConfirmationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};

export type MyNode = {
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
};

/** An object with an ID */
export type Node = {
  /** The ID of the object. */
  id: Scalars['ID']['output'];
};

export type NotificationNode = MyNode & {
  __typename?: 'NotificationNode';
  created: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  extraData: Maybe<Scalars['String']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isRead: Maybe<Scalars['Boolean']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  source: Maybe<CustomUserNode>;
  title: Scalars['String']['output'];
  type: NotificationType;
  updated: Scalars['DateTime']['output'];
};

export type NotificationNodeConnection = {
  __typename?: 'NotificationNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<NotificationNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `NotificationNode` and its cursor. */
export type NotificationNodeEdge = {
  __typename?: 'NotificationNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<NotificationNode>;
};

/** Simple GraphQL subscription. */
export type NotificationSubscription = {
  __typename?: 'NotificationSubscription';
  notification: Maybe<NotificationNode>;
};

/** An enumeration. */
export type NotificationType =
  /** Admin Notification */
  | 'ADMIN'
  /** Checkout session completed */
  | 'CHECKOUT_DONE'
  /** Checkout session failed */
  | 'CHECKOUT_FAILED'
  /** Course Action */
  | 'COURSE'
  /** Student Enrollment Complete */
  | 'ENROLLMENT_DONE'
  /** Student Enrollment Complete */
  | 'ENROLLMENT_FAILED'
  /** Question Answer Notification */
  | 'QUESTION_ANS'
  /** Question Asking Notification */
  | 'QUESTION_ASK';

/**
 * Obtain JSON web token for given user.
 *
 * Allow to perform login with different fields,
 * and secondary email if set. The fields are
 * defined on settings.
 *
 * Not verified users can login by default. This
 * can be changes on settings.
 *
 * If user is archived, make it unarchive and
 * return `unarchiving=True` on output.
 */
export type ObtainJsonWebToken = {
  __typename?: 'ObtainJSONWebToken';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  refreshToken: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  token: Maybe<Scalars['String']['output']>;
  unarchiving: Maybe<Scalars['Boolean']['output']>;
  user: Maybe<CustomUserNode>;
};

/** An enumeration. */
export type OrderCurrency =
  /** Euro */
  | 'EUR'
  /** Pound sterling */
  | 'GBP'
  /** Saudi Riyal */
  | 'SAR'
  /** Sudanese Pound */
  | 'SDG'
  /** Us Dollar */
  | 'USD';

export type OrderDetailsNode = MyNode & {
  __typename?: 'OrderDetailsNode';
  cost: Scalars['Decimal']['output'];
  costSdg: Scalars['Decimal']['output'];
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  order: OrderNode;
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type OrderDetailsNodeConnection = {
  __typename?: 'OrderDetailsNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrderDetailsNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `OrderDetailsNode` and its cursor. */
export type OrderDetailsNodeEdge = {
  __typename?: 'OrderDetailsNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<OrderDetailsNode>;
};

export type OrderNode = MyNode & {
  __typename?: 'OrderNode';
  attachmenttransactionSet: AttachmentTransactionNodeConnection;
  created: Scalars['DateTime']['output'];
  currency: OrderCurrency;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  invoiceNumber: Scalars['String']['output'];
  isCanceled: Scalars['Boolean']['output'];
  isDonePayment: Scalars['Boolean']['output'];
  isSpam: Scalars['Boolean']['output'];
  orderTotal: Maybe<Scalars['Float']['output']>;
  orderdetailsSet: OrderDetailsNodeConnection;
  partnerledgerSet: PartnerLedgerNodeConnection;
  partnerrewardledgerSet: PartnerRewardLedgerNodeConnection;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidledgerSet: PyramidLedgerNodeConnection;
  totalAmount: Scalars['Decimal']['output'];
  totalAmountSdg: Scalars['Decimal']['output'];
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
  userPaid: Scalars['Decimal']['output'];
};


export type OrderNodeAttachmenttransactionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};


export type OrderNodeOrderdetailsSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type OrderNodePartnerledgerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type OrderNodePartnerrewardledgerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type OrderNodePyramidledgerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type OrderNodeConnection = {
  __typename?: 'OrderNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<OrderNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `OrderNode` and its cursor. */
export type OrderNodeEdge = {
  __typename?: 'OrderNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<OrderNode>;
};

/** The Relay compliant `PageInfo` type, containing data necessary to paginate this connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['String']['output']>;
};

export type PartnerBalanceNode = MyNode & {
  __typename?: 'PartnerBalanceNode';
  balance: Maybe<Scalars['Decimal']['output']>;
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  partnerType: PartnerBalancePartnerType;
  partnerwithdrawSet: PartnerWithdrawNodeConnection;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidHead: PyramidNode;
  updated: Scalars['DateTime']['output'];
};


export type PartnerBalanceNodePartnerwithdrawSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PartnerBalanceNodeConnection = {
  __typename?: 'PartnerBalanceNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PartnerBalanceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PartnerBalanceNode` and its cursor. */
export type PartnerBalanceNodeEdge = {
  __typename?: 'PartnerBalanceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PartnerBalanceNode>;
};

/** An enumeration. */
export type PartnerBalancePartnerType =
  /** Course */
  | 'CUR'
  /** Al-Hasif */
  | 'HSF'
  /** Marketing */
  | 'MRK'
  /** Sabri Training Center */
  | 'SBR';

/** Create   */
export type PartnerBalanceWithdraw = {
  __typename?: 'PartnerBalanceWithdraw';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerWithdrawNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type PartnerBalanceWithdrawInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type PartnerLedgerNode = MyNode & {
  __typename?: 'PartnerLedgerNode';
  alhasif: Maybe<Scalars['Decimal']['output']>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isRedeemed: Scalars['Boolean']['output'];
  isRefunded: Scalars['Boolean']['output'];
  marketing: Maybe<Scalars['Decimal']['output']>;
  order: Maybe<OrderNode>;
  pk: Maybe<Scalars['Int']['output']>;
  sabri: Maybe<Scalars['Decimal']['output']>;
  teacher: Maybe<Scalars['Decimal']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type PartnerLedgerNodeConnection = {
  __typename?: 'PartnerLedgerNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PartnerLedgerNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PartnerLedgerNode` and its cursor. */
export type PartnerLedgerNodeEdge = {
  __typename?: 'PartnerLedgerNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PartnerLedgerNode>;
};

export type PartnerRewardLedgerNode = MyNode & {
  __typename?: 'PartnerRewardLedgerNode';
  amount: Maybe<Scalars['Decimal']['output']>;
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isRedeemed: Scalars['Boolean']['output'];
  order: Maybe<OrderNode>;
  partnerType: PartnerRewardLedgerPartnerType;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidHead: PyramidNode;
  updated: Scalars['DateTime']['output'];
};

export type PartnerRewardLedgerNodeConnection = {
  __typename?: 'PartnerRewardLedgerNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PartnerRewardLedgerNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PartnerRewardLedgerNode` and its cursor. */
export type PartnerRewardLedgerNodeEdge = {
  __typename?: 'PartnerRewardLedgerNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PartnerRewardLedgerNode>;
};

/** An enumeration. */
export type PartnerRewardLedgerPartnerType =
  /** Course */
  | 'CUR'
  /** Al-Hasif */
  | 'HSF'
  /** Marketing */
  | 'MRK'
  /** Sabri Training Center */
  | 'SBR';

export type PartnerWithdrawNode = MyNode & {
  __typename?: 'PartnerWithdrawNode';
  amount: Scalars['Decimal']['output'];
  approvedBy: Maybe<CustomUserNode>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isDone: Scalars['Boolean']['output'];
  partnerBalance: PartnerBalanceNode;
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};

export type PartnerWithdrawNodeConnection = {
  __typename?: 'PartnerWithdrawNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PartnerWithdrawNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PartnerWithdrawNode` and its cursor. */
export type PartnerWithdrawNodeEdge = {
  __typename?: 'PartnerWithdrawNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PartnerWithdrawNode>;
};

/**
 * Change account password when user knows the old password.
 *
 * A new token and refresh token are sent. User must be verified.
 */
export type PasswordChange = {
  __typename?: 'PasswordChange';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  refreshToken: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  token: Maybe<Scalars['String']['output']>;
};

/**
 * Change user password without old password.
 *
 * Receive the token that was sent by email.
 *
 * If token and new passwords are valid, update
 * user password and in case of using refresh
 * tokens, revoke all of them.
 *
 * Also, if user has not been verified yet, verify it.
 */
export type PasswordReset = {
  __typename?: 'PasswordReset';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type PrerequisiteInput = {
  course?: InputMaybe<Scalars['Int']['input']>;
  link?: InputMaybe<Scalars['String']['input']>;
  prerequisite?: InputMaybe<Scalars['String']['input']>;
};

export type PrerequisiteNode = MyNode & {
  __typename?: 'PrerequisiteNode';
  course: Maybe<CourseNode>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  link: Maybe<Scalars['String']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  prerequisite: Maybe<Scalars['String']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type PrerequisiteNodeConnection = {
  __typename?: 'PrerequisiteNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PrerequisiteNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PrerequisiteNode` and its cursor. */
export type PrerequisiteNodeEdge = {
  __typename?: 'PrerequisiteNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PrerequisiteNode>;
};

export type ProgressInput = {
  courseId: Scalars['Int']['input'];
  courseUnitContentId: Scalars['Int']['input'];
  courseUnitId: Scalars['Int']['input'];
  enrollmentId: Scalars['Int']['input'];
};

export type PyramidAffiliateNode = MyNode & {
  __typename?: 'PyramidAffiliateNode';
  amount: Maybe<Scalars['Float']['output']>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  pyramidAccount: PyramidNode;
  pyramidrecruitSet: PyramidRecruitNodeConnection;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};


export type PyramidAffiliateNodePyramidrecruitSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PyramidAffiliateNodeConnection = {
  __typename?: 'PyramidAffiliateNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PyramidAffiliateNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PyramidAffiliateNode` and its cursor. */
export type PyramidAffiliateNodeEdge = {
  __typename?: 'PyramidAffiliateNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PyramidAffiliateNode>;
};

/** Upload   */
export type PyramidAttachmentTransactionConfirmation = {
  __typename?: 'PyramidAttachmentTransactionConfirmation';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionNode>;
  marketerEndorse: Maybe<Scalars['Boolean']['output']>;
  pyramidManagerEndorse: Maybe<Scalars['Boolean']['output']>;
  pyramidRetryPlease: Maybe<Scalars['Boolean']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type PyramidAttachmentTransactionConfirmationInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PyramidBalanceNode = MyNode & {
  __typename?: 'PyramidBalanceNode';
  balance: Maybe<Scalars['Float']['output']>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  pyramidAccount: PyramidNode;
  updated: Scalars['DateTime']['output'];
};

export type PyramidBalanceNodeConnection = {
  __typename?: 'PyramidBalanceNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PyramidBalanceNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PyramidBalanceNode` and its cursor. */
export type PyramidBalanceNodeEdge = {
  __typename?: 'PyramidBalanceNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PyramidBalanceNode>;
};

export type PyramidLedgerNode = MyNode & {
  __typename?: 'PyramidLedgerNode';
  amount: Scalars['Decimal']['output'];
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isChange: Scalars['Boolean']['output'];
  isRedeemed: Scalars['Boolean']['output'];
  order: Maybe<OrderNode>;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidAccount: Maybe<PyramidNode>;
  updated: Scalars['DateTime']['output'];
};

export type PyramidLedgerNodeConnection = {
  __typename?: 'PyramidLedgerNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PyramidLedgerNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PyramidLedgerNode` and its cursor. */
export type PyramidLedgerNodeEdge = {
  __typename?: 'PyramidLedgerNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PyramidLedgerNode>;
};

export type PyramidNode = MyNode & {
  __typename?: 'PyramidNode';
  attachmenttransactionSet: AttachmentTransactionNodeConnection;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isAdmin: Scalars['Boolean']['output'];
  isBlocked: Scalars['Boolean']['output'];
  isHead: Scalars['Boolean']['output'];
  isSuperuser: Scalars['Boolean']['output'];
  parent: Maybe<PyramidNode>;
  partnerbalanceSet: PartnerBalanceNodeConnection;
  partnerrewardledgerSet: PartnerRewardLedgerNodeConnection;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidCode: Maybe<Scalars['String']['output']>;
  pyramidId: Maybe<Scalars['String']['output']>;
  pyramidSet: PyramidNodeConnection;
  pyramidaffiliateSet: PyramidAffiliateNodeConnection;
  pyramidbalance: Maybe<PyramidBalanceNode>;
  pyramidledgerSet: PyramidLedgerNodeConnection;
  pyramidwithdrawSet: PyramidWithdrawNodeConnection;
  updated: Scalars['DateTime']['output'];
  user: Maybe<CustomUserNode>;
};


export type PyramidNodeAttachmenttransactionSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};


export type PyramidNodePartnerbalanceSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type PyramidNodePartnerrewardledgerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type PyramidNodePyramidSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pyramidId?: InputMaybe<Scalars['String']['input']>;
};


export type PyramidNodePyramidaffiliateSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type PyramidNodePyramidledgerSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type PyramidNodePyramidwithdrawSetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type PyramidNodeConnection = {
  __typename?: 'PyramidNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PyramidNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PyramidNode` and its cursor. */
export type PyramidNodeEdge = {
  __typename?: 'PyramidNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PyramidNode>;
};

export type PyramidRecruitNode = MyNode & {
  __typename?: 'PyramidRecruitNode';
  affiliate: PyramidAffiliateNode;
  cost: Maybe<Scalars['Decimal']['output']>;
  course: CourseNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type PyramidRecruitNodeConnection = {
  __typename?: 'PyramidRecruitNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PyramidRecruitNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PyramidRecruitNode` and its cursor. */
export type PyramidRecruitNodeEdge = {
  __typename?: 'PyramidRecruitNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PyramidRecruitNode>;
};

export type PyramidWithdrawNode = MyNode & {
  __typename?: 'PyramidWithdrawNode';
  amount: Maybe<Scalars['Float']['output']>;
  approvedBy: Maybe<CustomUserNode>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  isDone: Scalars['Boolean']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  pyramidAccount: PyramidNode;
  updated: Scalars['DateTime']['output'];
};

export type PyramidWithdrawNodeConnection = {
  __typename?: 'PyramidWithdrawNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<PyramidWithdrawNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `PyramidWithdrawNode` and its cursor. */
export type PyramidWithdrawNodeEdge = {
  __typename?: 'PyramidWithdrawNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<PyramidWithdrawNode>;
};

/** Simple GraphQL subscription. */
export type QuestionAnswerSubscription = {
  __typename?: 'QuestionAnswerSubscription';
  answer: Maybe<QuestionReplyNode>;
  notification: Maybe<NotificationNode>;
  question: Maybe<QuestionNode>;
};

export type QuestionNode = MyNode & {
  __typename?: 'QuestionNode';
  archived: Scalars['Boolean']['output'];
  contentType: ContentTypeNode;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  objectId: Scalars['Int']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  question: Scalars['String']['output'];
  questionreplySet: QuestionReplyNodeConnection;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};


export type QuestionNodeQuestionreplySetArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type QuestionNodeConnection = {
  __typename?: 'QuestionNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<QuestionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `QuestionNode` and its cursor. */
export type QuestionNodeEdge = {
  __typename?: 'QuestionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<QuestionNode>;
};

export type QuestionReplyNode = MyNode & {
  __typename?: 'QuestionReplyNode';
  answer: Scalars['String']['output'];
  archived: Scalars['Boolean']['output'];
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  pk: Maybe<Scalars['Int']['output']>;
  question: QuestionNode;
  updated: Scalars['DateTime']['output'];
  user: CustomUserNode;
};

export type QuestionReplyNodeConnection = {
  __typename?: 'QuestionReplyNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<QuestionReplyNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `QuestionReplyNode` and its cursor. */
export type QuestionReplyNodeEdge = {
  __typename?: 'QuestionReplyNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<QuestionReplyNode>;
};

export type RateUpdateInput = {
  conversionRate: Scalars['Decimal']['input'];
  converterId: Scalars['Int']['input'];
};

/** Upload   */
export type ReUploadAttachmentTransaction = {
  __typename?: 'ReUploadAttachmentTransaction';
  attachment: Maybe<Scalars['Upload']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type ReUploadAttachmentTransactionInput = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RefreshToken = {
  __typename?: 'RefreshToken';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  payload: Maybe<Scalars['GenericScalar']['output']>;
  refreshToken: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  token: Maybe<Scalars['String']['output']>;
};

/**
 * Register user with fields defined in the settings.
 *
 * If the email field of the user model is part of the
 * registration fields (default), check if there is
 * no user with that email or as a secondary email.
 *
 * If it exists, it does not register the user,
 * even if the email field is not defined as unique
 * (default of the default django user model).
 *
 * When creating the user, it also creates a `UserStatus`
 * related to that user, making it possible to track
 * if the user is archived, verified and has a secondary
 * email.
 *
 * Send account verification email.
 *
 * If allowed to not verified users login, return token.
 */
export type Register = {
  __typename?: 'Register';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  refreshToken: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  token: Maybe<Scalars['String']['output']>;
};

/** Enables logged in users to create order request  */
export type RemoveBulkOrderDetails = {
  __typename?: 'RemoveBulkOrderDetails';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  order: Maybe<OrderNodeConnection>;
  orderDetails: Maybe<OrderDetailsNodeConnection>;
  success: Maybe<Scalars['Boolean']['output']>;
};


/** Enables logged in users to create order request  */
export type RemoveBulkOrderDetailsOrderArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  isDonePayment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** Enables logged in users to create order request  */
export type RemoveBulkOrderDetailsOrderDetailsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** Enables logged in users to create order request  */
export type RemoveUserOrder = {
  __typename?: 'RemoveUserOrder';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  order: Maybe<OrderNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Sends activation email.
 *
 * It is called resend because theoretically
 * the first activation email was sent when
 * the user registered.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type ResendActivationEmail = {
  __typename?: 'ResendActivationEmail';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type RevokeToken = {
  __typename?: 'RevokeToken';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  revoked: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** The project root mutation */
export type RootMutation = {
  __typename?: 'RootMutation';
  /** Create   */
  approvePyramidWithdraw: Maybe<ApprovePyramidWithdraw>;
  /**
   * Archive account and revoke refresh tokens.
   *
   * User must be verified and confirm password.
   */
  archiveAccount: Maybe<ArchiveAccount>;
  /** Enables logged in users to create order request  */
  archiveCourseQuestion: Maybe<ArchiveCourseQuestion>;
  /** Enables logged in users to create order request  */
  archiveQuestionReply: Maybe<ArchiveQuestionReply>;
  /** Create   */
  assignAttachmentTransactionManager: Maybe<AssignAttachmentTransactionManager>;
  /** Create   */
  assignCourseInstructor: Maybe<AssignCourseInstructor>;
  /** Create   */
  assignInstructor: Maybe<AssignInstructor>;
  /** Bulk update conversion rates  */
  bulkUpdateRates: Maybe<BulkUpdateRates>;
  captureBraintreeCheckout: Maybe<CaptureBraintreeCheckout>;
  /** Enables logged in users to create order request  */
  capturePaypalCheckout: Maybe<CapturePaypalCheckout>;
  /** Create   */
  claimAlhasifPartnerBalance: Maybe<ClaimAlhasifPartnerBalance>;
  /** Create   */
  claimCoursePartnerBalance: Maybe<ClaimCoursePartnerBalance>;
  /** Create   */
  claimPyramidLedgerBalance: Maybe<ClaimPyramidLedgerBalance>;
  /** Create   */
  claimSabriPartnerBalance: Maybe<ClaimSabriPartnerBalance>;
  /** Records when user clicks telegram link with course details and URL - prevents duplicate clicks  */
  clickTelegramLink: Maybe<ClickTelegramLink>;
  /** Create   */
  createAttachmentTransaction: Maybe<CreateAttachmentTransaction>;
  /** Create   */
  createBatch: Maybe<CreateBatch>;
  createBraintreeCheckout: Maybe<CreateBraintreeCheckout>;
  /** Enables logged in users to create order request  */
  createBulkOrderDetails: Maybe<CreateBulkOrderDetails>;
  /** Create   */
  createCertificate: Maybe<CreateCertificate>;
  /** Enables logged in users to create order request  */
  createContentFile: Maybe<CreateContentFile>;
  /** Create   */
  createContentQuiz: Maybe<CreateContentQuiz>;
  /** Create   */
  createContentQuizQuestion: Maybe<CreateContentQuizQuestion>;
  /** Create   */
  createContentQuizQuestionAnswer: Maybe<CreateContentQuizQuestionAnswer>;
  /** Create   */
  createContentUnit: Maybe<CreateContentUnit>;
  /** Enables logged in users to create order request  */
  createContentVideo: Maybe<CreateContentVideo>;
  /** Enables logged in users to create order request  */
  createCourse: Maybe<CreateCourse>;
  /** Enables logged in users to create order request  */
  createCourseQuestion: Maybe<CreateCourseQuestion>;
  /** Create   */
  createCourseQuizSolution: Maybe<CreateCourseQuizSolution>;
  /** Create company  */
  createCourseSpeciality: Maybe<CreateCourseSpeciality>;
  /** Enables logged in users to create order request  */
  createCourseUnit: Maybe<CreateCourseUnit>;
  /** Create currency  */
  createCurrency: Maybe<CreateCurrency>;
  /** Create currency converter  */
  createCurrencyConverter: Maybe<CreateCurrencyConverter>;
  /** Create currency rate history record  */
  createCurrencyRateHistory: Maybe<CreateCurrencyRateHistory>;
  /** Enables logged in users to create order request  */
  createFeedback: Maybe<CreateFeedback>;
  /** Create   */
  createHomePageSlider: Maybe<CreateHomePageSlider>;
  /** Create   */
  createInstitute: Maybe<CreateInstitute>;
  /** Create   */
  createInstructor: Maybe<CreateInstructor>;
  /** Create   */
  createLifeStream: Maybe<CreateLifeStream>;
  /** Update  */
  createLifeStreamSignature: Maybe<CreateLifeStreamSignature>;
  /** Create   */
  createManualBatchCertificate: Maybe<CreateManualBatchCertificate>;
  /** Create   */
  createManualCertificate: Maybe<CreateManualCertificate>;
  /** Enables logged in users to create order request  */
  createNewOrderWithBulkOrderDetails: Maybe<CreateNewOrderWithBulkOrderDetails>;
  /** Enables logged in users to create order request  */
  createOrder: Maybe<CreateOrder>;
  /** Create   */
  createPartnerBalance: Maybe<CreatePartnerBalance>;
  /** Create   */
  createPartnerRewardLedger: Maybe<CreatePartnerRewardLedger>;
  /** Create   */
  createPartnerWithdraw: Maybe<CreatePartnerWithdraw>;
  createPaypalCheckout: Maybe<CreatePaypalCheckout>;
  /** Enables logged in users to create order request  */
  createPrerequisite: Maybe<CreatePrerequisite>;
  /** Enables logged in users to create order request  */
  createQuestionReply: Maybe<CreateQuestionReply>;
  /** Enables logged in users to create order request  */
  createSmartNodeCheckout: Maybe<CreateSmartNodeCheckout>;
  /** Enables logged in users to create order request  */
  createStripeCheckout: Maybe<CreateStripeCheckout>;
  /** Enables logged in users to create order request  */
  createWhatYouWillLearn: Maybe<CreateWhatYouWillLearn>;
  /** Update  */
  createZoomLifeStream: Maybe<CreateZoomLifeStream>;
  dashboardAuth: Maybe<DashboardAuth>;
  /**
   * Delete account permanently or make `user.is_active=False`.
   *
   * The behavior is defined on settings.
   * Anyway user refresh tokens are revoked.
   *
   * User must be verified and confirm password.
   */
  deleteAccount: Maybe<DeleteAccount>;
  /** Delete  */
  deleteBatch: Maybe<DeleteBatch>;
  /** Enables logged in users to create order request  */
  deleteContentFile: Maybe<DeleteContentFile>;
  /** Delete  */
  deleteContentQuiz: Maybe<DeleteContentQuiz>;
  /** Delete  */
  deleteContentQuizQuestion: Maybe<DeleteContentQuizQuestion>;
  /** Delete  */
  deleteContentQuizQuestionAnswer: Maybe<DeleteContentQuizQuestionAnswer>;
  /** Enables logged in users to create order request  */
  deleteContentVideo: Maybe<DeleteContentVideo>;
  /** Enables logged in users to create order request  */
  deleteCourse: Maybe<DeleteCourse>;
  /** Create   */
  deleteCourseInstructor: Maybe<DeleteCourseInstructor>;
  /** Delete course_speciality  */
  deleteCourseSpeciality: Maybe<DeleteCourseSpeciality>;
  /** Enables logged in users to create order request  */
  deleteCourseUnit: Maybe<DeleteCourseUnit>;
  /** Delete currency  */
  deleteCurrency: Maybe<DeleteCurrency>;
  /** Delete currency converter  */
  deleteCurrencyConverter: Maybe<DeleteCurrencyConverter>;
  /** Delete currency rate history record  */
  deleteCurrencyRateHistory: Maybe<DeleteCurrencyRateHistory>;
  /** Create   */
  deleteHomePageSlider: Maybe<DeleteHomePageSlider>;
  /** Delete  */
  deleteLifeStream: Maybe<DeleteLifeStream>;
  /** Delete  */
  deletePartnerBalance: Maybe<DeletePartnerBalance>;
  /** Delete  */
  deletePartnerRewardLedger: Maybe<DeletePartnerRewardLedger>;
  /** Delete  */
  deletePartnerWithdraw: Maybe<DeletePartnerWithdraw>;
  /** Enables logged in users to create order request  */
  deletePrerequisite: Maybe<DeletePrerequisite>;
  /** Enables logged in users to create order request  */
  deleteWhatYouWillLearn: Maybe<DeleteWhatYouWillLearn>;
  /** Enables logged in users to create order request  */
  doneReadingNotification: Maybe<DoneReadingNotification>;
  /** Enables logged in users to create order request  */
  endLearningUnit: Maybe<EndLearningUnit>;
  /** Create   */
  joinPlatform: Maybe<JoinPlatform>;
  /** Create   */
  joinPyramidProgram: Maybe<JoinPyramidProgram>;
  /** Create   */
  makePyramidWithdraw: Maybe<MakePyramidWithdraw>;
  /** Upload   */
  marketerAttachmentTransactionConfirmation: Maybe<MarketerAttachmentTransactionConfirmation>;
  /** Create   */
  partnerBalanceWithdraw: Maybe<PartnerBalanceWithdraw>;
  /**
   * Change account password when user knows the old password.
   *
   * A new token and refresh token are sent. User must be verified.
   */
  passwordChange: Maybe<PasswordChange>;
  /**
   * Change user password without old password.
   *
   * Receive the token that was sent by email.
   *
   * If token and new passwords are valid, update
   * user password and in case of using refresh
   * tokens, revoke all of them.
   *
   * Also, if user has not been verified yet, verify it.
   */
  passwordReset: Maybe<PasswordReset>;
  /** Upload   */
  pyramidAttachmentTransactionConfirmation: Maybe<PyramidAttachmentTransactionConfirmation>;
  /** Upload   */
  reUploadAttachmentTransaction: Maybe<ReUploadAttachmentTransaction>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  refreshToken: Maybe<RefreshToken>;
  /**
   * Register user with fields defined in the settings.
   *
   * If the email field of the user model is part of the
   * registration fields (default), check if there is
   * no user with that email or as a secondary email.
   *
   * If it exists, it does not register the user,
   * even if the email field is not defined as unique
   * (default of the default django user model).
   *
   * When creating the user, it also creates a `UserStatus`
   * related to that user, making it possible to track
   * if the user is archived, verified and has a secondary
   * email.
   *
   * Send account verification email.
   *
   * If allowed to not verified users login, return token.
   */
  register: Maybe<Register>;
  /** Enables logged in users to create order request  */
  removeBulkOrderDetails: Maybe<RemoveBulkOrderDetails>;
  /** Enables logged in users to create order request  */
  removeUserOrder: Maybe<RemoveUserOrder>;
  /**
   * Sends activation email.
   *
   * It is called resend because theoretically
   * the first activation email was sent when
   * the user registered.
   *
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  resendActivationEmail: Maybe<ResendActivationEmail>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  revokeToken: Maybe<RevokeToken>;
  /**
   * Send password reset email.
   *
   * For non verified users, send an activation
   * email instead.
   *
   * Accepts both primary and secondary email.
   *
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  sendPasswordResetEmail: Maybe<SendPasswordResetEmail>;
  /** Upload   */
  setAttachmentTransactionOperationNumber: Maybe<SetAttachmentTransactionOperationNumber>;
  /** Social Auth for JSON Web Token (JWT) */
  socialAuth: Maybe<SocialAuthJwt>;
  /** Enables logged in users to create order request  */
  startLearningUnit: Maybe<StartLearningUnit>;
  /** Enables logged in users to create order request  */
  toggleCourseInCompoundCourse: Maybe<ToggleCourseInCompoundCourse>;
  /** Enables logged in users to create order request  */
  toggleIsFree: Maybe<ToggleIsFree>;
  /** Enables logged in users to create order request  */
  toggleIsMandatory: Maybe<ToggleIsMandatory>;
  /**
   * Obtain JSON web token for given user.
   *
   * Allow to perform login with different fields,
   * and secondary email if set. The fields are
   * defined on settings.
   *
   * Not verified users can login by default. This
   * can be changes on settings.
   *
   * If user is archived, make it unarchive and
   * return `unarchiving=True` on output.
   */
  tokenAuth: Maybe<ObtainJsonWebToken>;
  /**
   * Update user model fields, defined on settings.
   *
   * User must be verified.
   */
  updateAccount: Maybe<UpdateAccount>;
  /** Update  */
  updateBatch: Maybe<UpdateBatch>;
  /** Create   */
  updateCertificateName: Maybe<UpdateCertificateName>;
  /** Enables logged in users to create order request  */
  updateContentFile: Maybe<UpdateContentFile>;
  /** Update  */
  updateContentQuiz: Maybe<UpdateContentQuiz>;
  /** Update  */
  updateContentQuizQuestion: Maybe<UpdateContentQuizQuestion>;
  /** Update  */
  updateContentQuizQuestionAnswer: Maybe<UpdateContentQuizQuestionAnswer>;
  /** Enables logged in users to create order request  */
  updateContentVideo: Maybe<UpdateContentVideo>;
  /** Enables logged in users to create order request  */
  updateCourse: Maybe<UpdateCourse>;
  /** Update course_speciality  */
  updateCourseSpeciality: Maybe<UpdateCourseSpeciality>;
  /** Enables logged in users to create order request  */
  updateCourseUnit: Maybe<UpdateCourseUnit>;
  /** Enables logged in users to create order request  */
  updateCourseUnitContentOrder: Maybe<UpdateCourseUnitContentOrder>;
  /** Enables logged in users to create order request  */
  updateCourseUnitOrder: Maybe<UpdateCourseUnitOrder>;
  /** Update currency  */
  updateCurrency: Maybe<UpdateCurrency>;
  /** Update currency converter  */
  updateCurrencyConverter: Maybe<UpdateCurrencyConverter>;
  /** Update currency rate history notes  */
  updateCurrencyRateHistoryNotes: Maybe<UpdateCurrencyRateHistoryNotes>;
  /** Create   */
  updateHomePageSlider: Maybe<UpdateHomePageSlider>;
  /** Create   */
  updateInstitute: Maybe<UpdateInstitute>;
  /** Create   */
  updateInstructor: Maybe<UpdateInstructor>;
  /** Update  */
  updateLifeStream: Maybe<UpdateLifeStream>;
  /** Update  */
  updatePartnerBalance: Maybe<UpdatePartnerBalance>;
  /** Update  */
  updatePartnerRewardLedger: Maybe<UpdatePartnerRewardLedger>;
  /** Update  */
  updatePartnerWithdraw: Maybe<UpdatePartnerWithdraw>;
  /** Enables logged in users to create order request  */
  updatePrerequisite: Maybe<UpdatePrerequisite>;
  /** Enables logged in users to create order request  */
  updatePrerequisiteOrder: Maybe<UpdatePrerequisiteOrder>;
  /** Create   */
  updateUserProfile: Maybe<UpdateUser>;
  /** Enables logged in users to create order request  */
  updateWhatYouWillLearn: Maybe<UpdateWhatYouWillLearn>;
  /** Enables logged in users to create order request  */
  updateWhatYouWillLearnOrder: Maybe<UpdateWhatYouWillLearnOrder>;
  /** Upload   */
  uploadAttachmentTransaction: Maybe<UploadAttachmentTransaction>;
  /**
   * Verify user account.
   *
   * Receive the token that was sent by email.
   * If the token is valid, make the user verified
   * by making the `user.status.verified` field true.
   */
  verifyAccount: Maybe<VerifyAccount>;
  /** Same as `grapgql_jwt` implementation, with standard output. */
  verifyToken: Maybe<VerifyToken>;
};


/** The project root mutation */
export type RootMutationApprovePyramidWithdrawArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ApprovePyramidWithdrawInput;
};


/** The project root mutation */
export type RootMutationArchiveAccountArgs = {
  password: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationArchiveCourseQuestionArgs = {
  questionId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationArchiveQuestionReplyArgs = {
  questionReplyId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationAssignAttachmentTransactionManagerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: AssignAttachmentTransactionManagerInput;
};


/** The project root mutation */
export type RootMutationAssignCourseInstructorArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: AssignCourseInstructorInput;
};


/** The project root mutation */
export type RootMutationAssignInstructorArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: AssignInstructorInput;
};


/** The project root mutation */
export type RootMutationBulkUpdateRatesArgs = {
  rateUpdates?: InputMaybe<Array<InputMaybe<RateUpdateInput>>>;
};


/** The project root mutation */
export type RootMutationCaptureBraintreeCheckoutArgs = {
  nonce?: InputMaybe<Scalars['String']['input']>;
  orderId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationCapturePaypalCheckoutArgs = {
  orderId: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationClaimAlhasifPartnerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ClaimAlhasifPartnerBalanceInput;
};


/** The project root mutation */
export type RootMutationClaimCoursePartnerBalanceArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ClaimCoursePartnerBalanceInput;
};


/** The project root mutation */
export type RootMutationClaimPyramidLedgerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ClaimPyramidLedgerBalanceInput;
};


/** The project root mutation */
export type RootMutationClaimSabriPartnerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ClaimSabriPartnerBalanceInput;
};


/** The project root mutation */
export type RootMutationClickTelegramLinkArgs = {
  enrollmentId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationCreateAttachmentTransactionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateAttachmentTransactionInput;
};


/** The project root mutation */
export type RootMutationCreateBatchArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateBatchInput;
};


/** The project root mutation */
export type RootMutationCreateBraintreeCheckoutArgs = {
  orderId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationCreateBulkOrderDetailsArgs = {
  courseIds: Array<InputMaybe<Scalars['Int']['input']>>;
  currency: Scalars['String']['input'];
  orderId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationCreateCertificateArgs = {
  enrollmentId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateCertificateInput;
};


/** The project root mutation */
export type RootMutationCreateContentFileArgs = {
  contentData?: InputMaybe<ContentFileInput>;
  courseUnitContentData?: InputMaybe<CourseUnitContentInput>;
};


/** The project root mutation */
export type RootMutationCreateContentQuizArgs = {
  courseUnitContent?: InputMaybe<CourseUnitContentInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateContentQuizInput;
};


/** The project root mutation */
export type RootMutationCreateContentQuizQuestionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateContentQuizQuestionInput;
};


/** The project root mutation */
export type RootMutationCreateContentQuizQuestionAnswerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateContentQuizQuestionAnswerInput;
};


/** The project root mutation */
export type RootMutationCreateContentUnitArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateContentUnitInput;
};


/** The project root mutation */
export type RootMutationCreateContentVideoArgs = {
  contentData?: InputMaybe<ContentVideoInput>;
  courseUnitContentData?: InputMaybe<CourseUnitContentInput>;
};


/** The project root mutation */
export type RootMutationCreateCourseArgs = {
  courseData?: InputMaybe<CourseInput>;
};


/** The project root mutation */
export type RootMutationCreateCourseQuestionArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
  question: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationCreateCourseQuizSolutionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateCourseQuizSolutionInput;
};


/** The project root mutation */
export type RootMutationCreateCourseSpecialityArgs = {
  inputData?: InputMaybe<CourseSpecialityInput>;
};


/** The project root mutation */
export type RootMutationCreateCourseUnitArgs = {
  courseUnitData?: InputMaybe<CourseUnitInput>;
};


/** The project root mutation */
export type RootMutationCreateCurrencyArgs = {
  inputData?: InputMaybe<CurrencyInput>;
};


/** The project root mutation */
export type RootMutationCreateCurrencyConverterArgs = {
  inputData?: InputMaybe<CurrencyConverterInput>;
};


/** The project root mutation */
export type RootMutationCreateCurrencyRateHistoryArgs = {
  inputData?: InputMaybe<CurrencyRateHistoryInput>;
};


/** The project root mutation */
export type RootMutationCreateFeedbackArgs = {
  enrollmentId: Scalars['Int']['input'];
  rating: Scalars['Int']['input'];
  text: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationCreateHomePageSliderArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateHomePageSliderInput;
};


/** The project root mutation */
export type RootMutationCreateInstituteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateInstituteInput;
};


/** The project root mutation */
export type RootMutationCreateInstructorArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateInstructorInput;
  password?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationCreateLifeStreamArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateLifeStreamInput;
};


/** The project root mutation */
export type RootMutationCreateLifeStreamSignatureArgs = {
  enrollmentId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateLifeStreamSignatureInput;
  lifeStreamId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationCreateManualBatchCertificateArgs = {
  batchId?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateManualBatchCertificateInput;
  userEmail?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationCreateManualCertificateArgs = {
  course?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateManualCertificateInput;
  userEmail?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationCreateNewOrderWithBulkOrderDetailsArgs = {
  courseIds: Array<InputMaybe<Scalars['Int']['input']>>;
};


/** The project root mutation */
export type RootMutationCreatePartnerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreatePartnerBalanceInput;
};


/** The project root mutation */
export type RootMutationCreatePartnerRewardLedgerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreatePartnerRewardLedgerInput;
};


/** The project root mutation */
export type RootMutationCreatePartnerWithdrawArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreatePartnerWithdrawInput;
};


/** The project root mutation */
export type RootMutationCreatePaypalCheckoutArgs = {
  currency: Scalars['String']['input'];
  orderId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationCreatePrerequisiteArgs = {
  contentData?: InputMaybe<PrerequisiteInput>;
};


/** The project root mutation */
export type RootMutationCreateQuestionReplyArgs = {
  answer: Scalars['String']['input'];
  questionId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationCreateSmartNodeCheckoutArgs = {
  card?: InputMaybe<Scalars['String']['input']>;
  expDate?: InputMaybe<Scalars['String']['input']>;
  ipin?: InputMaybe<Scalars['Int']['input']>;
  orderId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationCreateStripeCheckoutArgs = {
  cancelUrl?: InputMaybe<Scalars['String']['input']>;
  currency: Scalars['String']['input'];
  orderId: Scalars['Int']['input'];
  successUrl?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationCreateWhatYouWillLearnArgs = {
  contentData?: InputMaybe<WhatYouWillLearnInput>;
};


/** The project root mutation */
export type RootMutationCreateZoomLifeStreamArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: CreateZoomLifeStreamInput;
};


/** The project root mutation */
export type RootMutationDashboardAuthArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationDeleteAccountArgs = {
  password: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationDeleteBatchArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteBatchInput;
};


/** The project root mutation */
export type RootMutationDeleteContentFileArgs = {
  contentData?: InputMaybe<ContentFileInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
  courseUnitContentData?: InputMaybe<CourseUnitContentInput>;
};


/** The project root mutation */
export type RootMutationDeleteContentQuizArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteContentQuizInput;
};


/** The project root mutation */
export type RootMutationDeleteContentQuizQuestionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteContentQuizQuestionInput;
};


/** The project root mutation */
export type RootMutationDeleteContentQuizQuestionAnswerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteContentQuizQuestionAnswerInput;
};


/** The project root mutation */
export type RootMutationDeleteContentVideoArgs = {
  contentData?: InputMaybe<ContentVideoInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
  courseUnitContentData?: InputMaybe<CourseUnitContentInput>;
};


/** The project root mutation */
export type RootMutationDeleteCourseArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteCourseInstructorArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteCourseInstructorInput;
};


/** The project root mutation */
export type RootMutationDeleteCourseSpecialityArgs = {
  courseSpecialityId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteCourseUnitArgs = {
  courseUnitData?: InputMaybe<CourseUnitInput>;
  courseUnitId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteCurrencyArgs = {
  currencyId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteCurrencyConverterArgs = {
  converterId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteCurrencyRateHistoryArgs = {
  historyId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteHomePageSliderArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteHomePageSliderInput;
};


/** The project root mutation */
export type RootMutationDeleteLifeStreamArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeleteLifeStreamInput;
};


/** The project root mutation */
export type RootMutationDeletePartnerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeletePartnerBalanceInput;
};


/** The project root mutation */
export type RootMutationDeletePartnerRewardLedgerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeletePartnerRewardLedgerInput;
};


/** The project root mutation */
export type RootMutationDeletePartnerWithdrawArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: DeletePartnerWithdrawInput;
};


/** The project root mutation */
export type RootMutationDeletePrerequisiteArgs = {
  contentData?: InputMaybe<PrerequisiteInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationDeleteWhatYouWillLearnArgs = {
  contentData?: InputMaybe<WhatYouWillLearnInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationEndLearningUnitArgs = {
  progressData: ProgressInput;
  progressId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationJoinPlatformArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: JoinPlatformInput;
  marketingCode?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationJoinPyramidProgramArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: JoinPyramidProgramInput;
};


/** The project root mutation */
export type RootMutationMakePyramidWithdrawArgs = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: MakePyramidWithdrawInput;
};


/** The project root mutation */
export type RootMutationMarketerAttachmentTransactionConfirmationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: MarketerAttachmentTransactionConfirmationInput;
};


/** The project root mutation */
export type RootMutationPartnerBalanceWithdrawArgs = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: PartnerBalanceWithdrawInput;
  partnerBalanceId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationPasswordChangeArgs = {
  newPassword1: Scalars['String']['input'];
  newPassword2: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationPasswordResetArgs = {
  newPassword1: Scalars['String']['input'];
  newPassword2: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationPyramidAttachmentTransactionConfirmationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: PyramidAttachmentTransactionConfirmationInput;
  userPaid?: InputMaybe<Scalars['Float']['input']>;
};


/** The project root mutation */
export type RootMutationReUploadAttachmentTransactionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: ReUploadAttachmentTransactionInput;
};


/** The project root mutation */
export type RootMutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationRegisterArgs = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password1: Scalars['String']['input'];
  password2: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationRemoveBulkOrderDetailsArgs = {
  courseIds: Array<InputMaybe<Scalars['Int']['input']>>;
  orderId: Scalars['Int']['input'];
};


/** The project root mutation */
export type RootMutationRemoveUserOrderArgs = {
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationResendActivationEmailArgs = {
  email: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationRevokeTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationSendPasswordResetEmailArgs = {
  email: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationSetAttachmentTransactionOperationNumberArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: SetAttachmentTransactionOperationNumberInput;
};


/** The project root mutation */
export type RootMutationSocialAuthArgs = {
  accessToken: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  provider: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationStartLearningUnitArgs = {
  progressData: ProgressInput;
};


/** The project root mutation */
export type RootMutationToggleCourseInCompoundCourseArgs = {
  addCourseIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  mode?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationToggleIsFreeArgs = {
  courseUnitContentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationToggleIsMandatoryArgs = {
  courseUnitContentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationTokenAuthArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationUpdateAccountArgs = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  phoneNumber3?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateBatchArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateBatchInput;
};


/** The project root mutation */
export type RootMutationUpdateCertificateNameArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateCertificateNameInput;
};


/** The project root mutation */
export type RootMutationUpdateContentFileArgs = {
  contentData?: InputMaybe<ContentFileInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
  courseUnitContentData?: InputMaybe<CourseUnitContentInput>;
};


/** The project root mutation */
export type RootMutationUpdateContentQuizArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateContentQuizInput;
};


/** The project root mutation */
export type RootMutationUpdateContentQuizQuestionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateContentQuizQuestionInput;
};


/** The project root mutation */
export type RootMutationUpdateContentQuizQuestionAnswerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateContentQuizQuestionAnswerInput;
};


/** The project root mutation */
export type RootMutationUpdateContentVideoArgs = {
  contentData?: InputMaybe<ContentVideoInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
  courseUnitContentData?: InputMaybe<CourseUnitContentInput>;
};


/** The project root mutation */
export type RootMutationUpdateCourseArgs = {
  courseData?: InputMaybe<CourseInput>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateCourseSpecialityArgs = {
  courseSpecialityId?: InputMaybe<Scalars['Int']['input']>;
  inputData?: InputMaybe<CourseSpecialityInput>;
};


/** The project root mutation */
export type RootMutationUpdateCourseUnitArgs = {
  courseUnitData?: InputMaybe<CourseUnitInput>;
  courseUnitId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateCourseUnitContentOrderArgs = {
  course?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['JSONString']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateCourseUnitOrderArgs = {
  course?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['JSONString']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateCurrencyArgs = {
  currencyId?: InputMaybe<Scalars['Int']['input']>;
  inputData?: InputMaybe<CurrencyInput>;
};


/** The project root mutation */
export type RootMutationUpdateCurrencyConverterArgs = {
  converterId?: InputMaybe<Scalars['Int']['input']>;
  inputData?: InputMaybe<CurrencyConverterInput>;
};


/** The project root mutation */
export type RootMutationUpdateCurrencyRateHistoryNotesArgs = {
  historyId?: InputMaybe<Scalars['Int']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateHomePageSliderArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateHomePageSliderInput;
};


/** The project root mutation */
export type RootMutationUpdateInstituteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateInstituteInput;
};


/** The project root mutation */
export type RootMutationUpdateInstructorArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateInstructorInput;
};


/** The project root mutation */
export type RootMutationUpdateLifeStreamArgs = {
  createZoom?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateLifeStreamInput;
};


/** The project root mutation */
export type RootMutationUpdatePartnerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdatePartnerBalanceInput;
};


/** The project root mutation */
export type RootMutationUpdatePartnerRewardLedgerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdatePartnerRewardLedgerInput;
};


/** The project root mutation */
export type RootMutationUpdatePartnerWithdrawArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdatePartnerWithdrawInput;
};


/** The project root mutation */
export type RootMutationUpdatePrerequisiteArgs = {
  contentData?: InputMaybe<PrerequisiteInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationUpdatePrerequisiteOrderArgs = {
  course?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['JSONString']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateUserProfileArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UpdateUserInput;
};


/** The project root mutation */
export type RootMutationUpdateWhatYouWillLearnArgs = {
  contentData?: InputMaybe<WhatYouWillLearnInput>;
  contentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root mutation */
export type RootMutationUpdateWhatYouWillLearnOrderArgs = {
  course?: InputMaybe<Scalars['Int']['input']>;
  ordering?: InputMaybe<Scalars['JSONString']['input']>;
};


/** The project root mutation */
export type RootMutationUploadAttachmentTransactionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input: UploadAttachmentTransactionInput;
};


/** The project root mutation */
export type RootMutationVerifyAccountArgs = {
  token: Scalars['String']['input'];
};


/** The project root mutation */
export type RootMutationVerifyTokenArgs = {
  token: Scalars['String']['input'];
};

/** The project root query */
export type RootQuery = {
  __typename?: 'RootQuery';
  activeCurrencies: Maybe<CurrencyNodeConnection>;
  allAlhasifPartnerBalance: Maybe<PartnerBalanceNodeConnection>;
  allAlhasifPartnerRewardLedgers: Maybe<Scalars['Float']['output']>;
  allAlhasifPartnerWithdraws: Maybe<PartnerWithdrawNodeConnection>;
  allAttachmentTransactionManagers: Maybe<AttachmentTransactionManagerNodeConnection>;
  allAttachmentTransactions: Maybe<AttachmentTransactionNodeConnection>;
  allBatches: Maybe<BatchNodeConnection>;
  allCertificates: Maybe<CertificateNodeConnection>;
  allContentArticles: Maybe<ContentArticleNodeConnection>;
  allContentQuizByCourse: Maybe<ContentQuizNodeConnection>;
  allContentQuizQuestionAnswerByContentQuizQuestion: Maybe<ContentQuizQuestionAnswerNodeConnection>;
  allContentQuizQuestionByContentQuiz: Maybe<ContentQuizQuestionNodeConnection>;
  allContentVideo: Maybe<ContentVideoNodeConnection>;
  allContentVideoByCourse: Maybe<ContentVideoNodeConnection>;
  allCourseInstructors: Maybe<CourseInstructorNodeConnection>;
  allCourseInstructorsByCourse: Maybe<CourseInstructorNodeConnection>;
  allCourseLanguages: Maybe<CourseLanguageNodeConnection>;
  allCoursePartnerBalance: Maybe<PartnerBalanceNodeConnection>;
  allCoursePartnerRewardLedgers: Maybe<Scalars['Float']['output']>;
  allCoursePartnerWithdraws: Maybe<PartnerWithdrawNodeConnection>;
  allCourseQuizSolutions: Maybe<CourseQuizSolutionNodeConnection>;
  allCourseSpecialities: Maybe<CourseSpecialityNodeConnection>;
  allCourseUnitContents: Maybe<CourseUnitContentNodeConnection>;
  allCourseUnitContentsByCourse: Maybe<CourseUnitContentNodeConnection>;
  allCourseUnitContentsByCourseContentFile: Maybe<CourseUnitContentNodeConnection>;
  allCourseUnitContentsByCourseUnit: Maybe<CourseUnitContentNodeConnection>;
  allCourseUnits: Maybe<CourseUnitNodeConnection>;
  allCourseUnitsByCourseId: Maybe<CourseUnitNodeConnection>;
  allCourses: Maybe<CourseNodeConnection>;
  allCoursesCount: Maybe<Scalars['String']['output']>;
  allCoursesForInstructor: Maybe<CourseNodeConnection>;
  allCoursesHours: Maybe<Scalars['String']['output']>;
  allCoursesInSpeciality: Maybe<CourseNodeConnection>;
  allCurrencies: Maybe<CurrencyNodeConnection>;
  allCurrencyConverters: Maybe<CurrencyConverterNodeConnection>;
  allCurrencyRateHistories: Maybe<CurrencyRateHistoryNodeConnection>;
  allEnrollmentFeedbacks: Maybe<EnrollmentFeedbackNodeConnection>;
  allEnrollments: Maybe<EnrollmentNodeConnection>;
  allEnrollmentsForCurrentUser: Maybe<EnrollmentNodeConnection>;
  allEnrollmentsForCurrentUserV2: Maybe<EnrollmentNodeConnection>;
  allHomePageSliders: Maybe<HomePageSliderNodeConnection>;
  allInstitutes: Maybe<InstituteNodeConnection>;
  allInstructorCount: Maybe<Scalars['Int']['output']>;
  allInstructorOrders: Maybe<OrderNodeConnection>;
  allInstructors: Maybe<InstructorNodeConnection>;
  allLifeStreamSignatures: Maybe<LifeStreamSignatureNodeConnection>;
  allLifeStreams: Maybe<LifeStreamNodeConnection>;
  allMarketerAttachmentTransaction: Maybe<AttachmentTransactionNodeConnection>;
  allMarketingPartnerBalance: Maybe<PartnerBalanceNodeConnection>;
  allMarketingPartnerRewardLedgers: Maybe<Scalars['Float']['output']>;
  allMarketingPartnerWithdraws: Maybe<PartnerWithdrawNodeConnection>;
  allOrderDetails: Maybe<OrderDetailsNodeConnection>;
  allOrders: Maybe<OrderNodeConnection>;
  allPartnerBalances: Maybe<PartnerBalanceNodeConnection>;
  allPartnerLedgers: Maybe<PartnerLedgerNodeConnection>;
  allPartnerRewardLedgers: Maybe<PartnerRewardLedgerNodeConnection>;
  allPartnerWithdraws: Maybe<PartnerWithdrawNodeConnection>;
  allPrerequisite: Maybe<PrerequisiteNodeConnection>;
  allPrerequisiteByCourse: Maybe<PrerequisiteNodeConnection>;
  allPyramidAttachmentTransactions: Maybe<AttachmentTransactionNodeConnection>;
  allPyramidBalances: Maybe<PyramidBalanceNodeConnection>;
  allPyramidLedgers: Maybe<PyramidLedgerNodeConnection>;
  allPyramidRecruits: Maybe<PyramidRecruitNodeConnection>;
  allPyramidUsers: Maybe<CustomUserNodeConnection>;
  allPyramidWithdraws: Maybe<PyramidWithdrawNodeConnection>;
  allPyramidWithdrawsRequests: Maybe<PyramidWithdrawNodeConnection>;
  allPyramids: Maybe<PyramidNodeConnection>;
  allQuestionReplies: Maybe<QuestionReplyNodeConnection>;
  allQuestionRepliesForQuestion: Maybe<QuestionReplyNodeConnection>;
  allQuestions: Maybe<QuestionNodeConnection>;
  allQuestionsByCourse: Maybe<QuestionNodeConnection>;
  allQuestionsForInstructor: Maybe<QuestionNodeConnection>;
  allSabriPartnerBalance: Maybe<PartnerBalanceNodeConnection>;
  allSabriPartnerRewardLedgers: Maybe<Scalars['Float']['output']>;
  allSabriPartnerWithdraws: Maybe<PartnerWithdrawNodeConnection>;
  allWhatYouWillLearn: Maybe<WhatYouWillLearnNodeConnection>;
  allWhatYouWillLearnByCourse: Maybe<WhatYouWillLearnNodeConnection>;
  attachmentTransaction: Maybe<AttachmentTransactionNode>;
  batch: Maybe<BatchNode>;
  certificate: Maybe<CertificateNode>;
  checkPyramidAffiliate: Maybe<PyramidAffiliateNode>;
  contentArticle: Maybe<ContentArticleNode>;
  contentVideo: Maybe<ContentVideoNode>;
  conversionRate: Maybe<ConversionRateType>;
  course: Maybe<CourseNode>;
  courseInstructor: Maybe<CourseInstructorNode>;
  courseLanguage: Maybe<CourseLanguageNode>;
  courseQuizSolution: Maybe<CourseQuizSolutionNode>;
  courseSpeciality: Maybe<CourseSpecialityNode>;
  courseUnit: Maybe<CourseUnitNode>;
  courseUnitContent: Maybe<CourseUnitContentNode>;
  currency: Maybe<CurrencyNode>;
  currencyConverter: Maybe<CurrencyConverterNode>;
  currencyConvertersByFromCurrency: Maybe<CurrencyConverterNodeConnection>;
  currencyConvertersByToCurrency: Maybe<CurrencyConverterNodeConnection>;
  currencyRateHistory: Maybe<CurrencyRateHistoryNode>;
  currencyRateHistoryByConverter: Maybe<CurrencyRateHistoryNodeConnection>;
  currencyRateHistoryByCurrencyPair: Maybe<CurrencyRateHistoryNodeConnection>;
  /** The ID of the object */
  enrollment: Maybe<EnrollmentNode>;
  enrollmentByCourseForCurrentUser: Maybe<EnrollmentNode>;
  enrollmentFeedback: Maybe<EnrollmentFeedbackNode>;
  institute: Maybe<InstituteNode>;
  instructor: Maybe<InstructorNode>;
  instructorByUserId: Maybe<InstructorNode>;
  instructorOrderDetails: Maybe<OrderDetailsNodeConnection>;
  learningProgress: Maybe<LearningProgressNode>;
  learningProgressByCourse: Maybe<LearningProgressNodeConnection>;
  learningProgressByUnitContent: Maybe<LearningProgressNode>;
  lifeStream: Maybe<LifeStreamNode>;
  lifeStreamSignature: Maybe<LifeStreamSignatureNode>;
  majorCurrencies: Maybe<CurrencyNodeConnection>;
  me: Maybe<CustomUserNode>;
  myAttachmentTransactions: Maybe<AttachmentTransactionNodeConnection>;
  myNotifications: Maybe<NotificationNodeConnection>;
  myOrders: Maybe<OrderNodeConnection>;
  myPyramidAccount: Maybe<PyramidNode>;
  myPyramidAffiliates: Maybe<Scalars['Int']['output']>;
  myPyramidBalance: Maybe<PyramidBalanceNode>;
  myPyramidLedgerReward: Maybe<Scalars['Float']['output']>;
  myPyramidMarketers: Maybe<Scalars['Int']['output']>;
  myPyramidWithdraws: Maybe<PyramidWithdrawNodeConnection>;
  notification: Maybe<NotificationNode>;
  order: Maybe<OrderNode>;
  orderDetail: Maybe<OrderDetailsNode>;
  partnerBalance: Maybe<PartnerBalanceNode>;
  partnerLedger: Maybe<PartnerLedgerNode>;
  partnerRewardLedger: Maybe<PartnerRewardLedgerNode>;
  partnerWithdraw: Maybe<PartnerWithdrawNode>;
  paypalPublishableKey: Maybe<Scalars['JSONString']['output']>;
  prerequisite: Maybe<PrerequisiteNode>;
  pyramid: Maybe<PyramidNode>;
  pyramidBalance: Maybe<PyramidBalanceNode>;
  pyramidLedger: Maybe<PyramidLedgerNode>;
  pyramidRecruit: Maybe<PyramidRecruitNode>;
  pyramidWithdraw: Maybe<PyramidWithdrawNode>;
  question: Maybe<QuestionNode>;
  /** The ID of the object */
  questionReply: Maybe<QuestionReplyNode>;
  recentRateChanges: Maybe<CurrencyRateHistoryNodeConnection>;
  stripePublishableKey: Maybe<Scalars['JSONString']['output']>;
  totalUsers: Maybe<Scalars['String']['output']>;
  user: Maybe<CustomUserNode>;
  whatYouWillLearn: Maybe<WhatYouWillLearnNode>;
};


/** The project root query */
export type RootQueryActiveCurrenciesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_Icontains?: InputMaybe<Scalars['String']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** The project root query */
export type RootQueryAllAlhasifPartnerBalanceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllAlhasifPartnerRewardLedgersArgs = {
  filters?: InputMaybe<Scalars['JSONString']['input']>;
};


/** The project root query */
export type RootQueryAllAlhasifPartnerWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllAttachmentTransactionManagersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllAttachmentTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};


/** The project root query */
export type RootQueryAllBatchesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllCertificatesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllContentArticlesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllContentQuizByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllContentQuizQuestionAnswerByContentQuizQuestionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contentQuizQuestionId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllContentQuizQuestionByContentQuizArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  contentQuizId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllContentVideoArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllContentVideoByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseInstructorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseInstructorsByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseLanguagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCoursePartnerBalanceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCoursePartnerRewardLedgersArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllCoursePartnerWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseQuizSolutionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseSpecialitiesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllCourseUnitContentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseUnitContentsByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseUnitContentsByCourseContentFileArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseUnitContentsByCourseUnitArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseUnitId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllCourseUnitsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryAllCourseUnitsByCourseIdArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryAllCoursesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryAllCoursesForInstructorArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryAllCoursesInSpecialityArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseSpecialities?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isSdgExchange?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  slug?: InputMaybe<Scalars['String']['input']>;
  specialityId?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryAllCurrenciesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_Icontains?: InputMaybe<Scalars['String']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** The project root query */
export type RootQueryAllCurrencyConvertersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversionRate?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastRateUpdate?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  rateChangePercentage?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  toCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  toCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** The project root query */
export type RootQueryAllCurrencyRateHistoriesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  changePercentage?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  converter_FromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_FromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  previousRate?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  rate_Gt?: InputMaybe<Scalars['Float']['input']>;
  rate_Gte?: InputMaybe<Scalars['Float']['input']>;
  rate_Lt?: InputMaybe<Scalars['Float']['input']>;
  rate_Lte?: InputMaybe<Scalars['Float']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryAllEnrollmentFeedbacksArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllEnrollmentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  byMonth?: InputMaybe<Scalars['Int']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  course_Title?: InputMaybe<Scalars['String']['input']>;
  course_Title_Icontains?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryAllEnrollmentsForCurrentUserArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  course_Title?: InputMaybe<Scalars['String']['input']>;
  course_Title_Icontains?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryAllEnrollmentsForCurrentUserV2Args = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  course_Title?: InputMaybe<Scalars['String']['input']>;
  course_Title_Icontains?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  user?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryAllHomePageSlidersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  specialityId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllInstitutesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllInstructorOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  isDonePayment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllInstructorsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllLifeStreamSignaturesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllLifeStreamsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllMarketerAttachmentTransactionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};


/** The project root query */
export type RootQueryAllMarketingPartnerBalanceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllMarketingPartnerWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllOrderDetailsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  isDonePayment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPartnerBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPartnerLedgersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPartnerRewardLedgersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPartnerWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPrerequisiteArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPrerequisiteByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPyramidAttachmentTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};


/** The project root query */
export type RootQueryAllPyramidBalancesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllPyramidLedgersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllPyramidRecruitsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllPyramidUsersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  email_Icontains?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPyramidWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPyramidWithdrawsRequestsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllPyramidsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  pyramidId?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryAllQuestionRepliesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllQuestionRepliesForQuestionArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  questionId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryAllQuestionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllQuestionsByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllQuestionsForInstructorArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllSabriPartnerBalanceArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllSabriPartnerRewardLedgersArgs = {
  filters?: InputMaybe<Scalars['JSONString']['input']>;
};


/** The project root query */
export type RootQueryAllSabriPartnerWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllWhatYouWillLearnArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAllWhatYouWillLearnByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['ID']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryAttachmentTransactionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryBatchArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCertificateArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryContentArticleArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryContentVideoArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryConversionRateArgs = {
  fromCurrency?: InputMaybe<Scalars['String']['input']>;
  toCurrency?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryCourseArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryCourseInstructorArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCourseLanguageArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCourseQuizSolutionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCourseSpecialityArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCourseUnitArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCourseUnitContentArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCurrencyArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCurrencyConverterArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCurrencyConvertersByFromCurrencyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversionRate?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastRateUpdate?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  rateChangePercentage?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  toCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  toCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** The project root query */
export type RootQueryCurrencyConvertersByToCurrencyArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  conversionRate?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  conversionRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  fromCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lastRateUpdate?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  lastRateUpdate_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  rateChangePercentage?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  rateChangePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  toCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  toCurrency_IsActive?: InputMaybe<Scalars['Boolean']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** The project root query */
export type RootQueryCurrencyRateHistoryArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryCurrencyRateHistoryByConverterArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  changePercentage?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  converterId?: InputMaybe<Scalars['Int']['input']>;
  converter_FromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_FromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  previousRate?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  rate_Gt?: InputMaybe<Scalars['Float']['input']>;
  rate_Gte?: InputMaybe<Scalars['Float']['input']>;
  rate_Lt?: InputMaybe<Scalars['Float']['input']>;
  rate_Lte?: InputMaybe<Scalars['Float']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryCurrencyRateHistoryByCurrencyPairArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  changePercentage?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  converter_FromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_FromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency?: InputMaybe<Scalars['String']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  previousRate?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  rate_Gt?: InputMaybe<Scalars['Float']['input']>;
  rate_Gte?: InputMaybe<Scalars['Float']['input']>;
  rate_Lt?: InputMaybe<Scalars['Float']['input']>;
  rate_Lte?: InputMaybe<Scalars['Float']['input']>;
  toCurrency?: InputMaybe<Scalars['String']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryEnrollmentArgs = {
  id: Scalars['ID']['input'];
};


/** The project root query */
export type RootQueryEnrollmentByCourseForCurrentUserArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryEnrollmentFeedbackArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryInstituteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryInstructorArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryInstructorByUserIdArgs = {
  userId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryInstructorOrderDetailsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryLearningProgressArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryLearningProgressByCourseArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  courseId?: InputMaybe<Scalars['Int']['input']>;
  enrollmentId?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryLearningProgressByUnitContentArgs = {
  unitContentId?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryLifeStreamArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryLifeStreamSignatureArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryMajorCurrenciesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  name_Icontains?: InputMaybe<Scalars['String']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  symbol?: InputMaybe<Scalars['String']['input']>;
  symbol_Icontains?: InputMaybe<Scalars['String']['input']>;
  updated?: InputMaybe<Scalars['DateTime']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
  updated_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  updated_Lte?: InputMaybe<Scalars['DateTime']['input']>;
};


/** The project root query */
export type RootQueryMyAttachmentTransactionsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  doneVerification?: InputMaybe<Scalars['Boolean']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  marketerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<Scalars['ID']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  orderId?: InputMaybe<Scalars['Int']['input']>;
  order_Created?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  order_Created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  order_InvoiceNumber?: InputMaybe<Scalars['String']['input']>;
  order_Orderdetails_Course?: InputMaybe<Scalars['ID']['input']>;
  order_User_Email?: InputMaybe<Scalars['String']['input']>;
  pyramidManager?: InputMaybe<Scalars['ID']['input']>;
  pyramidManagerEndorse?: InputMaybe<Scalars['Boolean']['input']>;
  pyramidRetryPlease?: InputMaybe<Scalars['Boolean']['input']>;
  retryPlease?: InputMaybe<Scalars['Boolean']['input']>;
};


/** The project root query */
export type RootQueryMyNotificationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  description_Icontains?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  extraData?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  source?: InputMaybe<Scalars['ID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** The project root query */
export type RootQueryMyOrdersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  first?: InputMaybe<Scalars['Int']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  isDonePayment?: InputMaybe<Scalars['Boolean']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryMyPyramidWithdrawsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  filters?: InputMaybe<Scalars['JSONString']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** The project root query */
export type RootQueryNotificationArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryOrderArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryOrderDetailArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPartnerBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPartnerLedgerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPartnerRewardLedgerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPartnerWithdrawArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPrerequisiteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPyramidArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPyramidBalanceArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPyramidLedgerArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPyramidRecruitArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryPyramidWithdrawArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryQuestionArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryQuestionReplyArgs = {
  id: Scalars['ID']['input'];
};


/** The project root query */
export type RootQueryRecentRateChangesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  changePercentage?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Gte?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lt?: InputMaybe<Scalars['Float']['input']>;
  changePercentage_Lte?: InputMaybe<Scalars['Float']['input']>;
  converter_FromCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_FromCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code?: InputMaybe<Scalars['String']['input']>;
  converter_ToCurrency_Code_Icontains?: InputMaybe<Scalars['String']['input']>;
  created?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Gte?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lt?: InputMaybe<Scalars['DateTime']['input']>;
  created_Lte?: InputMaybe<Scalars['DateTime']['input']>;
  days?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  previousRate?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Gte?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lt?: InputMaybe<Scalars['Float']['input']>;
  previousRate_Lte?: InputMaybe<Scalars['Float']['input']>;
  rate?: InputMaybe<Scalars['Float']['input']>;
  rate_Gt?: InputMaybe<Scalars['Float']['input']>;
  rate_Gte?: InputMaybe<Scalars['Float']['input']>;
  rate_Lt?: InputMaybe<Scalars['Float']['input']>;
  rate_Lte?: InputMaybe<Scalars['Float']['input']>;
  updatedBy?: InputMaybe<Scalars['ID']['input']>;
};


/** The project root query */
export type RootQueryUserArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};


/** The project root query */
export type RootQueryWhatYouWillLearnArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
};

/** The project root subscription */
export type RootSubscription = {
  __typename?: 'RootSubscription';
  checkoutSubscription: Maybe<CheckoutSubscription>;
  notificationCreated: Maybe<NotificationSubscription>;
  questionAnswerSubscription: Maybe<QuestionAnswerSubscription>;
};


/** The project root subscription */
export type RootSubscriptionQuestionAnswerSubscriptionArgs = {
  courseId?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Send password reset email.
 *
 * For non verified users, send an activation
 * email instead.
 *
 * Accepts both primary and secondary email.
 *
 * If there is no user with the requested email,
 * a successful response is returned.
 */
export type SendPasswordResetEmail = {
  __typename?: 'SendPasswordResetEmail';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Upload   */
export type SetAttachmentTransactionOperationNumber = {
  __typename?: 'SetAttachmentTransactionOperationNumber';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type SetAttachmentTransactionOperationNumberInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

export type SlideUnion = CourseNode;

/** Social Auth for JSON Web Token (JWT) */
export type SocialAuthJwt = {
  __typename?: 'SocialAuthJWT';
  social: Maybe<SocialType>;
  token: Maybe<Scalars['String']['output']>;
  user: Maybe<CustomUserNode>;
};

export type SocialNode = Node & {
  __typename?: 'SocialNode';
  created: Scalars['DateTime']['output'];
  extraData: Maybe<Scalars['SocialCamelJSON']['output']>;
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  modified: Scalars['DateTime']['output'];
  provider: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  user: CustomUserNode;
};

export type SocialNodeConnection = {
  __typename?: 'SocialNodeConnection';
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SocialNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
};

/** A Relay edge containing a `SocialNode` and its cursor. */
export type SocialNodeEdge = {
  __typename?: 'SocialNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<SocialNode>;
};

export type SocialType = {
  __typename?: 'SocialType';
  created: Scalars['DateTime']['output'];
  extraData: Maybe<Scalars['SocialCamelJSON']['output']>;
  id: Scalars['ID']['output'];
  modified: Scalars['DateTime']['output'];
  provider: Scalars['String']['output'];
  uid: Scalars['String']['output'];
  user: CustomUserNode;
};

/** Enables logged in users to create order request  */
export type StartLearningUnit = {
  __typename?: 'StartLearningUnit';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  learning: Maybe<LearningProgressNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type SubAttachmentTransactionNode = MyNode & {
  __typename?: 'SubAttachmentTransactionNode';
  attachment: Maybe<Scalars['String']['output']>;
  created: Scalars['DateTime']['output'];
  doneVerification: Scalars['Boolean']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  marketer: Maybe<PyramidNode>;
  marketerEndorse: Scalars['Boolean']['output'];
  operationNumber: Maybe<Scalars['String']['output']>;
  order: OrderNode;
  pk: Maybe<Scalars['Int']['output']>;
  pyramidManager: Maybe<AttachmentTransactionManagerNode>;
  pyramidManagerEndorse: Scalars['Boolean']['output'];
  pyramidRetryPlease: Scalars['Boolean']['output'];
  retryPlease: Scalars['Boolean']['output'];
  updated: Scalars['DateTime']['output'];
};

export type SubAttachmentTransactionNodeConnection = {
  __typename?: 'SubAttachmentTransactionNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<SubAttachmentTransactionNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `SubAttachmentTransactionNode` and its cursor. */
export type SubAttachmentTransactionNodeEdge = {
  __typename?: 'SubAttachmentTransactionNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<SubAttachmentTransactionNode>;
};

/** Enables logged in users to create order request  */
export type ToggleCourseInCompoundCourse = {
  __typename?: 'ToggleCourseInCompoundCourse';
  course: Maybe<CourseNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type ToggleIsFree = {
  __typename?: 'ToggleIsFree';
  courseUnitContent: Maybe<CourseUnitContentNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type ToggleIsMandatory = {
  __typename?: 'ToggleIsMandatory';
  courseUnitContent: Maybe<CourseUnitContentNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/**
 * Update user model fields, defined on settings.
 *
 * User must be verified.
 */
export type UpdateAccount = {
  __typename?: 'UpdateAccount';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update  */
export type UpdateBatch = {
  __typename?: 'UpdateBatch';
  batchName: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  courseName: Maybe<Scalars['String']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<BatchNode>;
  instructorName: Maybe<Scalars['String']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  totalHours: Maybe<Scalars['Float']['output']>;
};

export type UpdateBatchInput = {
  batchName?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  courseName?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  instructorName?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  totalHours?: InputMaybe<Scalars['Float']['input']>;
};

/** Create   */
export type UpdateCertificateName = {
  __typename?: 'UpdateCertificateName';
  certificateName: Maybe<Scalars['String']['output']>;
  certificateNameConfirm: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<CustomUserNode>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateCertificateNameInput = {
  certificateName?: InputMaybe<Scalars['String']['input']>;
  certificateNameConfirm?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type UpdateContentFile = {
  __typename?: 'UpdateContentFile';
  content: Maybe<ContentFileNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update  */
export type UpdateContentQuiz = {
  __typename?: 'UpdateContentQuiz';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizNode>;
  isMandatory: Maybe<Scalars['Boolean']['output']>;
  quizTitle: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateContentQuizInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  isMandatory?: InputMaybe<Scalars['Boolean']['input']>;
  quizTitle?: InputMaybe<Scalars['String']['input']>;
};

/** Update  */
export type UpdateContentQuizQuestion = {
  __typename?: 'UpdateContentQuizQuestion';
  clientMutationId: Maybe<Scalars['String']['output']>;
  contentQuiz: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  imageQuestion: Maybe<Scalars['Upload']['output']>;
  instance: Maybe<ContentQuizQuestionNode>;
  order: Maybe<Scalars['Int']['output']>;
  question: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update  */
export type UpdateContentQuizQuestionAnswer = {
  __typename?: 'UpdateContentQuizQuestionAnswer';
  answer: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  contentQuizQuestion: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<ContentQuizQuestionAnswerNode>;
  isCorrect: Maybe<Scalars['Boolean']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  why: Maybe<Scalars['String']['output']>;
};

export type UpdateContentQuizQuestionAnswerInput = {
  answer?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contentQuizQuestion?: InputMaybe<Scalars['Int']['input']>;
  isCorrect?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  why?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateContentQuizQuestionInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  contentQuiz?: InputMaybe<Scalars['Int']['input']>;
  imageQuestion?: InputMaybe<Scalars['Upload']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  question?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type UpdateContentVideo = {
  __typename?: 'UpdateContentVideo';
  content: Maybe<ContentVideoNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type UpdateCourse = {
  __typename?: 'UpdateCourse';
  course: Maybe<CourseNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update course_speciality  */
export type UpdateCourseSpeciality = {
  __typename?: 'UpdateCourseSpeciality';
  courseSpeciality: Maybe<CourseSpecialityNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type UpdateCourseUnit = {
  __typename?: 'UpdateCourseUnit';
  courseUnit: Maybe<CourseUnitNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type UpdateCourseUnitContentOrder = {
  __typename?: 'UpdateCourseUnitContentOrder';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type UpdateCourseUnitOrder = {
  __typename?: 'UpdateCourseUnitOrder';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update currency  */
export type UpdateCurrency = {
  __typename?: 'UpdateCurrency';
  currency: Maybe<CurrencyNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update currency converter  */
export type UpdateCurrencyConverter = {
  __typename?: 'UpdateCurrencyConverter';
  currencyConverter: Maybe<CurrencyConverterNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Update currency rate history notes  */
export type UpdateCurrencyRateHistoryNotes = {
  __typename?: 'UpdateCurrencyRateHistoryNotes';
  currencyRateHistory: Maybe<CurrencyRateHistoryNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type UpdateHomePageSlider = {
  __typename?: 'UpdateHomePageSlider';
  clientMutationId: Maybe<Scalars['String']['output']>;
  cost: Maybe<Scalars['Float']['output']>;
  endDate: Maybe<Scalars['DateTime']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<HomePageSliderNode>;
  isPublished: Maybe<Scalars['Boolean']['output']>;
  startDate: Maybe<Scalars['DateTime']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateHomePageSliderInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Create   */
export type UpdateInstitute = {
  __typename?: 'UpdateInstitute';
  brief: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  cover: Maybe<Scalars['Upload']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<InstituteNode>;
  profile: Maybe<Scalars['Upload']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  title: Maybe<Scalars['String']['output']>;
};

export type UpdateInstituteInput = {
  brief?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<Scalars['Upload']['input']>;
  profile?: InputMaybe<Scalars['Upload']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Create   */
export type UpdateInstructor = {
  __typename?: 'UpdateInstructor';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  image: Maybe<Scalars['Upload']['output']>;
  instance: Maybe<InstructorNode>;
  qualification: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  user: Maybe<Scalars['Int']['output']>;
};

export type UpdateInstructorInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  qualification?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Int']['input']>;
};

/** Update  */
export type UpdateLifeStream = {
  __typename?: 'UpdateLifeStream';
  agenda: Maybe<Scalars['String']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  courseUnit: Maybe<Scalars['Int']['output']>;
  createData: Maybe<Scalars['JSONString']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<LifeStreamNode>;
  responseData: Maybe<Scalars['JSONString']['output']>;
  status: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  topic: Maybe<Scalars['String']['output']>;
  user: Maybe<Scalars['Int']['output']>;
};

export type UpdateLifeStreamInput = {
  agenda?: InputMaybe<Scalars['String']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  courseUnit?: InputMaybe<Scalars['Int']['input']>;
  createData?: InputMaybe<Scalars['JSONString']['input']>;
  responseData?: InputMaybe<Scalars['JSONString']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  topic?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<Scalars['Int']['input']>;
};

/** Update  */
export type UpdatePartnerBalance = {
  __typename?: 'UpdatePartnerBalance';
  balance: Maybe<Scalars['Float']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerBalanceNode>;
  partnerType: Maybe<Scalars['String']['output']>;
  pyramidHead: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UpdatePartnerBalanceInput = {
  balance?: InputMaybe<Scalars['Float']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  partnerType?: InputMaybe<Scalars['String']['input']>;
  pyramidHead?: InputMaybe<Scalars['Int']['input']>;
};

/** Update  */
export type UpdatePartnerRewardLedger = {
  __typename?: 'UpdatePartnerRewardLedger';
  amount: Maybe<Scalars['Float']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  course: Maybe<Scalars['Int']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerRewardLedgerNode>;
  isRedeemed: Maybe<Scalars['Boolean']['output']>;
  order: Maybe<Scalars['Int']['output']>;
  partnerType: Maybe<Scalars['String']['output']>;
  pyramidHead: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UpdatePartnerRewardLedgerInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  course?: InputMaybe<Scalars['Int']['input']>;
  isRedeemed?: InputMaybe<Scalars['Boolean']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
  partnerType?: InputMaybe<Scalars['String']['input']>;
  pyramidHead?: InputMaybe<Scalars['Int']['input']>;
};

/** Update  */
export type UpdatePartnerWithdraw = {
  __typename?: 'UpdatePartnerWithdraw';
  amount: Maybe<Scalars['Float']['output']>;
  approvedBy: Maybe<Scalars['Int']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<PartnerWithdrawNode>;
  isDone: Maybe<Scalars['Boolean']['output']>;
  partnerBalance: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
  user: Maybe<Scalars['Int']['output']>;
};

export type UpdatePartnerWithdrawInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
  approvedBy?: InputMaybe<Scalars['Int']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  isDone?: InputMaybe<Scalars['Boolean']['input']>;
  partnerBalance?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<Scalars['Int']['input']>;
};

/** Enables logged in users to create order request  */
export type UpdatePrerequisite = {
  __typename?: 'UpdatePrerequisite';
  content: Maybe<PrerequisiteNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type UpdatePrerequisiteOrder = {
  __typename?: 'UpdatePrerequisiteOrder';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Create   */
export type UpdateUser = {
  __typename?: 'UpdateUser';
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  gender: Maybe<Scalars['String']['output']>;
  instance: Maybe<CustomUserNode>;
  phoneNumber: Maybe<Scalars['String']['output']>;
  phoneNumber2: Maybe<Scalars['String']['output']>;
  phoneNumber3: Maybe<Scalars['String']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UpdateUserInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  phoneNumber2?: InputMaybe<Scalars['String']['input']>;
  phoneNumber3?: InputMaybe<Scalars['String']['input']>;
};

/** Enables logged in users to create order request  */
export type UpdateWhatYouWillLearn = {
  __typename?: 'UpdateWhatYouWillLearn';
  content: Maybe<WhatYouWillLearnNode>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Enables logged in users to create order request  */
export type UpdateWhatYouWillLearnOrder = {
  __typename?: 'UpdateWhatYouWillLearnOrder';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Upload   */
export type UploadAttachmentTransaction = {
  __typename?: 'UploadAttachmentTransaction';
  attachment: Maybe<Scalars['Upload']['output']>;
  clientMutationId: Maybe<Scalars['String']['output']>;
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  instance: Maybe<AttachmentTransactionNode>;
  order: Maybe<Scalars['Int']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type UploadAttachmentTransactionInput = {
  attachment?: InputMaybe<Scalars['Upload']['input']>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  order?: InputMaybe<Scalars['Int']['input']>;
};

/** An enumeration. */
export type UserGender =
  /** Female */
  | 'FEMALE'
  /** Male */
  | 'MALE'
  /** Not Set */
  | 'NOT_SET';

/**
 * Verify user account.
 *
 * Receive the token that was sent by email.
 * If the token is valid, make the user verified
 * by making the `user.status.verified` field true.
 */
export type VerifyAccount = {
  __typename?: 'VerifyAccount';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

/** Same as `grapgql_jwt` implementation, with standard output. */
export type VerifyToken = {
  __typename?: 'VerifyToken';
  errors: Maybe<Scalars['ExpectedErrorType']['output']>;
  payload: Maybe<Scalars['GenericScalar']['output']>;
  success: Maybe<Scalars['Boolean']['output']>;
};

export type WhatYouWillLearnInput = {
  course?: InputMaybe<Scalars['Int']['input']>;
  points?: InputMaybe<Scalars['String']['input']>;
};

export type WhatYouWillLearnNode = MyNode & {
  __typename?: 'WhatYouWillLearnNode';
  course: Maybe<CourseNode>;
  created: Scalars['DateTime']['output'];
  /** The ID of the object. */
  id: Scalars['ID']['output'];
  order: Maybe<Scalars['Int']['output']>;
  pk: Maybe<Scalars['Int']['output']>;
  points: Maybe<Scalars['String']['output']>;
  updated: Scalars['DateTime']['output'];
};

export type WhatYouWillLearnNodeConnection = {
  __typename?: 'WhatYouWillLearnNodeConnection';
  edgeCount: Maybe<Scalars['Int']['output']>;
  /** Contains the nodes in this connection. */
  edges: Array<Maybe<WhatYouWillLearnNodeEdge>>;
  /** Pagination data for this connection. */
  pageInfo: PageInfo;
  totalCount: Maybe<Scalars['Int']['output']>;
};

/** A Relay edge containing a `WhatYouWillLearnNode` and its cursor. */
export type WhatYouWillLearnNodeEdge = {
  __typename?: 'WhatYouWillLearnNodeEdge';
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node: Maybe<WhatYouWillLearnNode>;
};

export type ArchiveUserAccountMutationVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type ArchiveUserAccountMutation = { __typename?: 'RootMutation', archiveAccount: { __typename?: 'ArchiveAccount', success: boolean | null, errors: any | null } | null };

export type ChangeUserPasswordMutationVariables = Exact<{
  oldPassword: Scalars['String']['input'];
  newPassword1: Scalars['String']['input'];
  newPassword2: Scalars['String']['input'];
}>;


export type ChangeUserPasswordMutation = { __typename?: 'RootMutation', passwordChange: { __typename?: 'PasswordChange', success: boolean | null, errors: any | null, token: string | null, refreshToken: string | null } | null };

export type SocialAuthMutationVariables = Exact<{
  provider: Scalars['String']['input'];
  accessToken: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type SocialAuthMutation = { __typename?: 'RootMutation', socialAuth: { __typename?: 'SocialAuthJWT', token: string | null, social: { __typename?: 'SocialType', provider: string, uid: string, extraData: any | null, created: string, modified: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, fullName: string, username: string, firstName: string, lastName: string, certificateName: string | null, phoneNumber: string | null, phoneNumber2: string | null, phoneNumber3: string | null, verified: boolean | null, isAttachmentTransactionManager: boolean | null, isPyramidAdmin: boolean | null, isPyramidMarketer: boolean | null, userCurrency: string | null, isInstructor: boolean | null } } | null } | null };

export type DeleteUserAccountMutationVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type DeleteUserAccountMutation = { __typename?: 'RootMutation', deleteAccount: { __typename?: 'DeleteAccount', success: boolean | null, errors: any | null } | null };

export type LoginUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginUserMutation = { __typename?: 'RootMutation', tokenAuth: { __typename?: 'ObtainJSONWebToken', success: boolean | null, errors: any | null, token: string | null, refreshToken: string | null, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, username: string, email: string, firstName: string, lastName: string, fullName: string, certificateName: string | null, phoneNumber: string | null, phoneNumber2: string | null, phoneNumber3: string | null, verified: boolean | null, isAttachmentTransactionManager: boolean | null, isPyramidAdmin: boolean | null, isPyramidMarketer: boolean | null, isInstructor: boolean | null, userCurrency: string | null } | null } | null };

export type RefreshUserTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshUserTokenMutation = { __typename?: 'RootMutation', refreshToken: { __typename?: 'RefreshToken', success: boolean | null, errors: any | null, token: string | null, refreshToken: string | null } | null };

export type RegisterNewUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password1: Scalars['String']['input'];
  password2: Scalars['String']['input'];
}>;


export type RegisterNewUserMutation = { __typename?: 'RootMutation', register: { __typename?: 'Register', success: boolean | null, errors: any | null, token: string | null, refreshToken: string | null } | null };

export type ResendActivationEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ResendActivationEmailMutation = { __typename?: 'RootMutation', resendActivationEmail: { __typename?: 'ResendActivationEmail', success: boolean | null, errors: any | null } | null };

export type UserPasswordResetMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword1: Scalars['String']['input'];
  newPassword2: Scalars['String']['input'];
}>;


export type UserPasswordResetMutation = { __typename?: 'RootMutation', passwordReset: { __typename?: 'PasswordReset', success: boolean | null, errors: any | null } | null };

export type RevokeUserRefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RevokeUserRefreshTokenMutation = { __typename?: 'RootMutation', revokeToken: { __typename?: 'RevokeToken', success: boolean | null, errors: any | null } | null };

export type UpdateCertificateNameMutationVariables = Exact<{
  input: UpdateCertificateNameInput;
}>;


export type UpdateCertificateNameMutation = { __typename?: 'RootMutation', updateCertificateName: { __typename?: 'UpdateCertificateName', success: boolean | null, errors: any | null } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserProfileMutation = { __typename?: 'RootMutation', updateUserProfile: { __typename?: 'UpdateUser', success: boolean | null, errors: any | null, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, fullName: string, phoneNumber: string | null, phoneNumber2: string | null, phoneNumber3: string | null, gender: UserGender | null } | null } | null };

export type UserPasswordResetEmailMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type UserPasswordResetEmailMutation = { __typename?: 'RootMutation', sendPasswordResetEmail: { __typename?: 'SendPasswordResetEmail', success: boolean | null, errors: any | null } | null };

export type VerifyUserAccountMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyUserAccountMutation = { __typename?: 'RootMutation', verifyAccount: { __typename?: 'VerifyAccount', success: boolean | null, errors: any | null } | null };

export type VerifyUserTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyUserTokenMutation = { __typename?: 'RootMutation', verifyToken: { __typename?: 'VerifyToken', success: boolean | null, errors: any | null, payload: any | null } | null };

export type AllInstructorCountQueryVariables = Exact<{ [key: string]: never; }>;


export type AllInstructorCountQuery = { __typename?: 'RootQuery', allInstructorCount: number | null };

export type GetMyProfileDataQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMyProfileDataQuery = { __typename?: 'RootQuery', me: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, fullName: string, certificateName: string | null, certificateNameConfirm: string | null, email: string, gender: UserGender | null, phoneNumber: string | null, phoneNumber2: string | null, phoneNumber3: string | null, isAttachmentTransactionManager: boolean | null, isPyramidAdmin: boolean | null, isPyramidMarketer: boolean | null, userCurrency: string | null } | null };

export type TotalUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type TotalUsersQuery = { __typename?: 'RootQuery', totalUsers: string | null };

export type ReUploadAttachmentTransactionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: ReUploadAttachmentTransactionInput;
}>;


export type ReUploadAttachmentTransactionMutation = { __typename?: 'RootMutation', reUploadAttachmentTransaction: { __typename?: 'ReUploadAttachmentTransaction', success: boolean | null, errors: any | null, attachmentTransaction: { __typename?: 'AttachmentTransactionNode', pk: number | null, attachment: string | null, marketerEndorse: boolean, retryPlease: boolean, pyramidManagerEndorse: boolean, pyramidRetryPlease: boolean, doneVerification: boolean, created: string, updated: string, order: { __typename?: 'OrderNode', pk: number | null }, marketer: { __typename?: 'PyramidNode', pk: number | null } | null, pyramidManager: { __typename?: 'AttachmentTransactionManagerNode', pk: number | null } | null } | null } | null };

export type UploadAttachmentTransactionMutationVariables = Exact<{
  input: UploadAttachmentTransactionInput;
}>;


export type UploadAttachmentTransactionMutation = { __typename?: 'RootMutation', uploadAttachmentTransaction: { __typename?: 'UploadAttachmentTransaction', success: boolean | null, errors: any | null, attachmentTransaction: { __typename?: 'AttachmentTransactionNode', pk: number | null, attachment: string | null, marketerEndorse: boolean, retryPlease: boolean, pyramidManagerEndorse: boolean, pyramidRetryPlease: boolean, doneVerification: boolean, created: string, updated: string, order: { __typename?: 'OrderNode', pk: number | null }, marketer: { __typename?: 'PyramidNode', pk: number | null } | null, pyramidManager: { __typename?: 'AttachmentTransactionManagerNode', pk: number | null } | null } | null } | null };

export type MarketerAttachmentTransactionConfirmationMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: MarketerAttachmentTransactionConfirmationInput;
}>;


export type MarketerAttachmentTransactionConfirmationMutation = { __typename?: 'RootMutation', marketerAttachmentTransactionConfirmation: { __typename?: 'MarketerAttachmentTransactionConfirmation', success: boolean | null, errors: any | null } | null };

export type AllMarketerAttachmentTransactionQueryVariables = Exact<{ [key: string]: never; }>;


export type AllMarketerAttachmentTransactionQuery = { __typename?: 'RootQuery', allMarketerAttachmentTransaction: { __typename?: 'AttachmentTransactionNodeConnection', edges: Array<{ __typename?: 'AttachmentTransactionNodeEdge', node: { __typename?: 'AttachmentTransactionNode', pk: number | null, attachment: string | null, marketerEndorse: boolean, retryPlease: boolean, pyramidManagerEndorse: boolean, pyramidRetryPlease: boolean, doneVerification: boolean, created: string, updated: string, order: { __typename?: 'OrderNode', pk: number | null, totalAmount: number, orderTotal: number | null, invoiceNumber: string, currency: OrderCurrency, user: { __typename?: 'CustomUserNode', pk: number | null, username: string, email: string, fullName: string, phoneNumber2: string | null, phoneNumber3: string | null }, orderdetailsSet: { __typename?: 'OrderDetailsNodeConnection', edges: Array<{ __typename?: 'OrderDetailsNodeEdge', node: { __typename?: 'OrderDetailsNode', pk: number | null, course: { __typename?: 'CourseNode', pk: number | null, title: string } } | null } | null> } }, marketer: { __typename?: 'PyramidNode', pk: number | null } | null, pyramidManager: { __typename?: 'AttachmentTransactionManagerNode', pk: number | null } | null } | null } | null> } | null };

export type MyAttachmentTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyAttachmentTransactionsQuery = { __typename?: 'RootQuery', myAttachmentTransactions: { __typename?: 'AttachmentTransactionNodeConnection', edges: Array<{ __typename?: 'AttachmentTransactionNodeEdge', node: { __typename?: 'AttachmentTransactionNode', pk: number | null, attachment: string | null, marketerEndorse: boolean, retryPlease: boolean, pyramidManagerEndorse: boolean, pyramidRetryPlease: boolean, doneVerification: boolean, created: string, updated: string, order: { __typename?: 'OrderNode', pk: number | null, orderTotal: number | null, totalAmount: number, invoiceNumber: string, currency: OrderCurrency }, marketer: { __typename?: 'PyramidNode', pk: number | null } | null, pyramidManager: { __typename?: 'AttachmentTransactionManagerNode', pk: number | null } | null } | null } | null> } | null };

export type CreateCertificateMutationVariables = Exact<{
  enrollmentId: Scalars['Int']['input'];
  input: CreateCertificateInput;
}>;


export type CreateCertificateMutation = { __typename?: 'RootMutation', createCertificate: { __typename?: 'CreateCertificate', success: boolean | null, errors: any | null } | null };

export type CreateManualCertificateMutationVariables = Exact<{
  course: Scalars['Int']['input'];
  userEmail: Scalars['String']['input'];
  input: CreateManualCertificateInput;
}>;


export type CreateManualCertificateMutation = { __typename?: 'RootMutation', createManualCertificate: { __typename?: 'CreateManualCertificate', success: boolean | null, errors: any | null } | null };

export type AllCertificatesQueryVariables = Exact<{
  filters?: InputMaybe<Scalars['JSONString']['input']>;
}>;


export type AllCertificatesQuery = { __typename?: 'RootQuery', allCertificates: { __typename?: 'CertificateNodeConnection', edges: Array<{ __typename?: 'CertificateNodeEdge', node: { __typename?: 'CertificateNode', id: string, pk: number | null, serial: string | null, startDate: string | null, endDate: string | null, issueDate: string | null, period: number | null, totalHours: number | null, isManual: boolean, isReady: boolean, isPrinted: boolean, isPrintable: boolean, created: string, updated: string, enrollment: { __typename?: 'EnrollmentNode', pk: number | null, id: string, course: { __typename?: 'CourseNode', id: string, pk: number | null, title: string } } | null, batch: { __typename?: 'BatchNode', id: string, pk: number | null, batchName: string | null, courseName: string | null } | null, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, fullName: string } | null } | null } | null> } | null };

export type CaptureBraintreeCheckoutMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
  nonce: Scalars['String']['input'];
}>;


export type CaptureBraintreeCheckoutMutation = { __typename?: 'RootMutation', captureBraintreeCheckout: { __typename?: 'CaptureBraintreeCheckout', success: boolean | null, errors: any | null } | null };

export type CapturePaypalCheckoutMutationVariables = Exact<{
  orderId: Scalars['String']['input'];
}>;


export type CapturePaypalCheckoutMutation = { __typename?: 'RootMutation', capturePaypalCheckout: { __typename?: 'CapturePaypalCheckout', success: boolean | null, errors: any | null, session: Record<string, number> | null } | null };

export type CreateBraintreeCheckoutMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
}>;


export type CreateBraintreeCheckoutMutation = { __typename?: 'RootMutation', createBraintreeCheckout: { __typename?: 'CreateBraintreeCheckout', success: boolean | null, errors: any | null, braintreeClientToken: string | null } | null };

export type CreateSmartNodeCheckoutMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
  card?: InputMaybe<Scalars['String']['input']>;
  expDate?: InputMaybe<Scalars['String']['input']>;
  ipin?: InputMaybe<Scalars['Int']['input']>;
}>;


export type CreateSmartNodeCheckoutMutation = { __typename?: 'RootMutation', createSmartNodeCheckout: { __typename?: 'CreateSmartNodeCheckout', success: boolean | null, errors: any | null } | null };

export type CreateStripeCheckoutMutationVariables = Exact<{
  orderId: Scalars['Int']['input'];
  currency: Scalars['String']['input'];
  successUrl?: InputMaybe<Scalars['String']['input']>;
  cancelUrl?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateStripeCheckoutMutation = { __typename?: 'RootMutation', createStripeCheckout: { __typename?: 'CreateStripeCheckout', success: boolean | null, errors: any | null, paymentUrl: string | null } | null };

export type PaypalPublishableKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type PaypalPublishableKeyQuery = { __typename?: 'RootQuery', paypalPublishableKey: Record<string, number> | null };

export type StripePublishableKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type StripePublishableKeyQuery = { __typename?: 'RootQuery', stripePublishableKey: Record<string, number> | null };

export type CreateCourseQuizSolutionMutationVariables = Exact<{
  input: CreateCourseQuizSolutionInput;
}>;


export type CreateCourseQuizSolutionMutation = { __typename?: 'RootMutation', createCourseQuizSolution: { __typename?: 'CreateCourseQuizSolution', success: boolean | null, errors: any | null, courseQuizSolution: { __typename?: 'CourseQuizSolutionNode', userAnswer: { __typename?: 'ContentQuizQuestionAnswerNode', id: string, pk: number | null, answer: string | null, isCorrect: boolean, why: string | null } } | null } | null };

export type EndLearningUnitMutationVariables = Exact<{
  progressData: ProgressInput;
  progressId: Scalars['Int']['input'];
}>;


export type EndLearningUnitMutation = { __typename?: 'RootMutation', endLearningUnit: { __typename?: 'EndLearningUnit', success: boolean | null, errors: any | null, learning: { __typename?: 'LearningProgressNode', pk: number | null, begin: string | null, complete: string | null } | null } | null };

export type StartLearningUnitMutationVariables = Exact<{
  progressData: ProgressInput;
}>;


export type StartLearningUnitMutation = { __typename?: 'RootMutation', startLearningUnit: { __typename?: 'StartLearningUnit', success: boolean | null, errors: any | null, learning: { __typename?: 'LearningProgressNode', pk: number | null, begin: string | null, complete: string | null } | null } | null };

export type AllContentQuizQuestionByContentQuizIdQueryVariables = Exact<{
  contentQuizId: Scalars['Int']['input'];
  filters?: InputMaybe<Scalars['JSONString']['input']>;
}>;


export type AllContentQuizQuestionByContentQuizIdQuery = { __typename?: 'RootQuery', allContentQuizQuestionByContentQuiz: { __typename?: 'ContentQuizQuestionNodeConnection', edges: Array<{ __typename?: 'ContentQuizQuestionNodeEdge', node: { __typename?: 'ContentQuizQuestionNode', pk: number | null, question: string | null, contentquizquestionanswerSet: { __typename?: 'ContentQuizQuestionAnswerNodeConnection', edges: Array<{ __typename?: 'ContentQuizQuestionAnswerNodeEdge', node: { __typename?: 'ContentQuizQuestionAnswerNode', id: string, pk: number | null, answer: string | null, isCorrect: boolean, why: string | null } | null } | null> }, coursequizsolutionSet: { __typename?: 'CourseQuizSolutionNodeConnection', edges: Array<{ __typename?: 'CourseQuizSolutionNodeEdge', node: { __typename?: 'CourseQuizSolutionNode', id: string, pk: number | null, userAnswer: { __typename?: 'ContentQuizQuestionAnswerNode', id: string, pk: number | null, answer: string | null, isCorrect: boolean, why: string | null } } | null } | null> } } | null } | null> } | null };

export type GetAllLearningProgressByCourseQueryVariables = Exact<{
  courseId?: InputMaybe<Scalars['Int']['input']>;
  enrollmentId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllLearningProgressByCourseQuery = { __typename?: 'RootQuery', learningProgressByCourse: { __typename?: 'LearningProgressNodeConnection', edges: Array<{ __typename?: 'LearningProgressNodeEdge', node: { __typename?: 'LearningProgressNode', id: string, pk: number | null, begin: string | null, complete: string | null, courseUnitContent: { __typename?: 'CourseUnitContentNode', id: string, pk: number | null } } | null } | null> } | null };

export type GetAllCourseInstructorsQueryVariables = Exact<{
  courseID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAllCourseInstructorsQuery = { __typename?: 'RootQuery', allCourseInstructors: { __typename?: 'CourseInstructorNodeConnection', edges: Array<{ __typename?: 'CourseInstructorNodeEdge', node: { __typename?: 'CourseInstructorNode', id: string, instructor: { __typename?: 'InstructorNode', id: string, image: string | null, qualification: string, user: { __typename?: 'CustomUserNode', id: string, username: string, fullName: string, firstName: string, lastName: string } } } | null } | null> } | null };

export type AllCourseUnitContentsByCourseContentFileQueryVariables = Exact<{
  courseId: Scalars['Int']['input'];
}>;


export type AllCourseUnitContentsByCourseContentFileQuery = { __typename?: 'RootQuery', allCourseUnitContentsByCourseContentFile: { __typename?: 'CourseUnitContentNodeConnection', edges: Array<{ __typename?: 'CourseUnitContentNodeEdge', node: { __typename?: 'CourseUnitContentNode', pk: number | null, isFree: boolean, modelName: string | null, modelValue: Record<string, number> | null } | null } | null> } | null };

export type GetAllCourseUnitsByCourseIdQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  courseID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAllCourseUnitsByCourseIdQuery = { __typename?: 'RootQuery', allCourseUnits: { __typename?: 'CourseUnitNodeConnection', totalCount: number | null, edgeCount: number | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'CourseUnitNodeEdge', node: { __typename?: 'CourseUnitNode', id: string, pk: number | null, title: string | null, isExternal: boolean, external: { __typename?: 'CourseUnitNode', id: string, pk: number | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', totalCount: number | null, edges: Array<{ __typename?: 'CourseUnitContentNodeEdge', node: { __typename?: 'CourseUnitContentNode', id: string, pk: number | null, order: number | null, isFree: boolean, isMandatory: boolean, modelName: string | null, modelValue: Record<string, number> | null, courseUnit: { __typename?: 'CourseUnitNode', id: string, pk: number | null, title: string | null, course: { __typename?: 'CourseNode', id: string, pk: number | null } | null } } | null } | null> } } | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', edges: Array<{ __typename?: 'CourseUnitContentNodeEdge', node: { __typename?: 'CourseUnitContentNode', id: string, pk: number | null, isFree: boolean, isMandatory: boolean, modelName: string | null, modelValue: Record<string, number> | null, courseUnit: { __typename?: 'CourseUnitNode', id: string, pk: number | null, title: string | null, course: { __typename?: 'CourseNode', id: string, pk: number | null } | null } } | null } | null> } } | null } | null> } | null };

export type GetAllCoursesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>> | InputMaybe<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  courseSpeciality?: InputMaybe<Scalars['ID']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetAllCoursesQuery = { __typename?: 'RootQuery', allCourses: { __typename?: 'CourseNodeConnection', totalCount: number | null, edgeCount: number | null, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, endCursor: string | null }, edges: Array<{ __typename?: 'CourseNodeEdge', node: { __typename?: 'CourseNode', id: string, pk: number | null, title: string, isPaid: boolean, enrolled: boolean | null, courseFee: number, courseFeeInSdg: number, profile: string | null, cover: string | null, currency: Record<string, number> | null, courseSpeciality: { __typename?: 'CourseSpecialityNode', id: string, pk: number | null }, courseinstructorSet: { __typename?: 'CourseInstructorNodeConnection', edges: Array<{ __typename?: 'CourseInstructorNodeEdge', node: { __typename?: 'CourseInstructorNode', id: string, isMainInstructor: boolean, instructor: { __typename?: 'InstructorNode', id: string, user: { __typename?: 'CustomUserNode', id: string, username: string, fullName: string, firstName: string, lastName: string } } } | null } | null> } } | null } | null> } | null };

export type AllCoursesHoursQueryVariables = Exact<{ [key: string]: never; }>;


export type AllCoursesHoursQuery = { __typename?: 'RootQuery', allCoursesHours: string | null };

export type AllCoursesInSpecialityQueryVariables = Exact<{
  specialityId: Scalars['Int']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  execludeIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>> | InputMaybe<Scalars['Int']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  title_Istartswith?: InputMaybe<Scalars['String']['input']>;
  title_Icontains?: InputMaybe<Scalars['String']['input']>;
  isPaid?: InputMaybe<Scalars['Boolean']['input']>;
  isDraft?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type AllCoursesInSpecialityQuery = { __typename?: 'RootQuery', allCoursesInSpeciality: { __typename?: 'CourseNodeConnection', totalCount: number | null, edgeCount: number | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'CourseNodeEdge', node: { __typename?: 'CourseNode', id: string, pk: number | null, title: string, isPaid: boolean, courseFee: number, courseFeeInSdg: number, currency: Record<string, number> | null, profile: string | null, cover: string | null, enrolled: boolean | null, isDraft: boolean } | null } | null> } | null };

export type GetAllCoursesCountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllCoursesCountQuery = { __typename?: 'RootQuery', allCoursesCount: string | null };

export type GetAllPreRequisitesByCourseQueryVariables = Exact<{
  courseID?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllPreRequisitesByCourseQuery = { __typename?: 'RootQuery', allPrerequisiteByCourse: { __typename?: 'PrerequisiteNodeConnection', edges: Array<{ __typename?: 'PrerequisiteNodeEdge', node: { __typename?: 'PrerequisiteNode', id: string, pk: number | null, prerequisite: string | null } | null } | null> } | null };

export type GetAllSpecialitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllSpecialitiesQuery = { __typename?: 'RootQuery', allCourseSpecialities: { __typename?: 'CourseSpecialityNodeConnection', totalCount: number | null, edgeCount: number | null, edges: Array<{ __typename?: 'CourseSpecialityNodeEdge', node: { __typename?: 'CourseSpecialityNode', id: string, pk: number | null, speciality: string } | null } | null> } | null };

export type GetAllWhatYouWillLearnByCourseIdQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  courseID?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetAllWhatYouWillLearnByCourseIdQuery = { __typename?: 'RootQuery', allWhatYouWillLearn: { __typename?: 'WhatYouWillLearnNodeConnection', pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'WhatYouWillLearnNodeEdge', node: { __typename?: 'WhatYouWillLearnNode', id: string, pk: number | null, points: string | null } | null } | null> } | null };

export type GetCourseByIdQueryVariables = Exact<{
  coursePk?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCourseByIdQuery = { __typename?: 'RootQuery', course: { __typename?: 'CourseNode', id: string, pk: number | null, courseHours: string | null, title: string, profile: string | null, cover: string | null, courseFee: number, courseFeeInSdg: number, currency: Record<string, number> | null, brief: string, isPaid: boolean, enrollmentCount: number | null, telegramLink: string | null, hasCertificate: boolean, enrolled: boolean | null, courseinstructorSet: { __typename?: 'CourseInstructorNodeConnection', edges: Array<{ __typename?: 'CourseInstructorNodeEdge', node: { __typename?: 'CourseInstructorNode', id: string, pk: number | null, instructor: { __typename?: 'InstructorNode', id: string, qualification: string, image: string | null, user: { __typename?: 'CustomUserNode', id: string, username: string, firstName: string, lastName: string } } } | null } | null> }, courseunitSet: { __typename?: 'CourseUnitNodeConnection', edges: Array<{ __typename?: 'CourseUnitNodeEdge', node: { __typename?: 'CourseUnitNode', id: string, pk: number | null, title: string | null, order: number | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', totalCount: number | null, edges: Array<{ __typename?: 'CourseUnitContentNodeEdge', node: { __typename?: 'CourseUnitContentNode', id: string, pk: number | null, order: number | null, isFree: boolean, isMandatory: boolean, modelName: string | null, modelValue: Record<string, number> | null } | null } | null> } } | null } | null> }, courseSpeciality: { __typename?: 'CourseSpecialityNode', id: string, pk: number | null, speciality: string }, courseLanguage: { __typename?: 'CourseLanguageNode', id: string, pk: number | null, languageName: string, languageCode: string } } | null };

export type GetCourseByIdSlimQueryVariables = Exact<{
  coursePk?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCourseByIdSlimQuery = { __typename?: 'RootQuery', course: { __typename?: 'CourseNode', id: string, pk: number | null, courseHours: string | null, title: string, profile: string | null, cover: string | null, courseFee: number, courseFeeInSdg: number, currency: Record<string, number> | null, brief: string, isPaid: boolean, enrollmentCount: number | null, telegramLink: string | null, hasCertificate: boolean, enrolled: boolean | null, courseunitSet: { __typename?: 'CourseUnitNodeConnection', edges: Array<{ __typename?: 'CourseUnitNodeEdge', node: { __typename?: 'CourseUnitNode', id: string, pk: number | null, title: string | null, order: number | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', totalCount: number | null } } | null } | null> }, courseSpeciality: { __typename?: 'CourseSpecialityNode', id: string, pk: number | null, speciality: string }, courseLanguage: { __typename?: 'CourseLanguageNode', id: string, pk: number | null, languageName: string, languageCode: string } } | null };

export type GetCourseUnitContentQueryVariables = Exact<{
  contentPk: Scalars['Int']['input'];
}>;


export type GetCourseUnitContentQuery = { __typename?: 'RootQuery', courseUnitContent: { __typename?: 'CourseUnitContentNode', id: string, pk: number | null, modelName: string | null, modelValue: Record<string, number> | null, courseUnit: { __typename?: 'CourseUnitNode', id: string, pk: number | null } } | null };

export type GetCourseUnitContentsQueryVariables = Exact<{
  unitPk: Scalars['Int']['input'];
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetCourseUnitContentsQuery = { __typename?: 'RootQuery', courseUnit: { __typename?: 'CourseUnitNode', id: string, pk: number | null, title: string | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', totalCount: number | null, pageInfo: { __typename?: 'PageInfo', endCursor: string | null, hasNextPage: boolean }, edges: Array<{ __typename?: 'CourseUnitContentNodeEdge', node: { __typename?: 'CourseUnitContentNode', id: string, pk: number | null, order: number | null, isFree: boolean, isMandatory: boolean, modelName: string | null, modelValue: Record<string, number> | null } | null } | null> } } | null };

export type AllEnrollmentsForCurrentUserQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllEnrollmentsForCurrentUserQuery = { __typename?: 'RootQuery', allEnrollmentsForCurrentUser: { __typename?: 'EnrollmentNodeConnection', pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'EnrollmentNodeEdge', node: { __typename?: 'EnrollmentNode', id: string, pk: number | null, course: { __typename?: 'CourseNode', id: string, pk: number | null, title: string, cover: string | null, courseunitSet: { __typename?: 'CourseUnitNodeConnection', totalCount: number | null, edgeCount: number | null, edges: Array<{ __typename?: 'CourseUnitNodeEdge', node: { __typename?: 'CourseUnitNode', id: string, pk: number | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', totalCount: number | null, edgeCount: number | null } } | null } | null> } }, learningprogressSet: { __typename?: 'LearningProgressNodeConnection', totalCount: number | null, edgeCount: number | null, edges: Array<{ __typename?: 'LearningProgressNodeEdge', node: { __typename?: 'LearningProgressNode', id: string, pk: number | null } | null } | null> } } | null } | null> } | null };

export type GetEnrollmentByCourseForCurrentUserQueryVariables = Exact<{
  courseId: Scalars['Int']['input'];
}>;


export type GetEnrollmentByCourseForCurrentUserQuery = { __typename?: 'RootQuery', enrollmentByCourseForCurrentUser: { __typename?: 'EnrollmentNode', pk: number | null, course: { __typename?: 'CourseNode', id: string, pk: number | null, title: string, courseunitSet: { __typename?: 'CourseUnitNodeConnection', totalCount: number | null, edgeCount: number | null, edges: Array<{ __typename?: 'CourseUnitNodeEdge', node: { __typename?: 'CourseUnitNode', id: string, pk: number | null, courseunitcontentSet: { __typename?: 'CourseUnitContentNodeConnection', totalCount: number | null, edgeCount: number | null } } | null } | null> } }, learningprogressSet: { __typename?: 'LearningProgressNodeConnection', totalCount: number | null, edgeCount: number | null, edges: Array<{ __typename?: 'LearningProgressNodeEdge', node: { __typename?: 'LearningProgressNode', id: string, pk: number | null } | null } | null> } } | null };

export type CourseFragmentsFragment = { __typename?: 'CourseNode', pk: number | null, id: string, title: string, cover: string | null, brief: string };

export type AllHomePageSlidersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllHomePageSlidersQuery = { __typename?: 'RootQuery', allHomePageSliders: { __typename?: 'HomePageSliderNodeConnection', edges: Array<{ __typename?: 'HomePageSliderNodeEdge', node: { __typename?: 'HomePageSliderNode', objectId: number, id: string, pk: number | null, isPublished: boolean, startDate: string | null, endDate: string | null, slide: { __typename?: 'CourseNode', pk: number | null, id: string, title: string, cover: string | null, brief: string } | null } | null } | null> } | null };

export type DoneReadingNotificationMutationVariables = Exact<{ [key: string]: never; }>;


export type DoneReadingNotificationMutation = { __typename?: 'RootMutation', doneReadingNotification: { __typename?: 'DoneReadingNotification', success: boolean | null } | null };

export type GetAllMyNotificationsQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAllMyNotificationsQuery = { __typename?: 'RootQuery', myNotifications: { __typename?: 'NotificationNodeConnection', totalCount: number | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'NotificationNodeEdge', node: { __typename?: 'NotificationNode', pk: number | null, title: string, description: string | null, extraData: string | null, type: NotificationType, created: string, updated: string, source: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, firstName: string, lastName: string } | null } | null } | null> } | null };

export type GetMyNotificationsQueryVariables = Exact<{
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
  extraData?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMyNotificationsQuery = { __typename?: 'RootQuery', myNotifications: { __typename?: 'NotificationNodeConnection', edges: Array<{ __typename?: 'NotificationNodeEdge', node: { __typename?: 'NotificationNode', id: string, pk: number | null, type: NotificationType, title: string, source: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, firstName: string, lastName: string } | null } | null } | null> } | null };

export type CheckoutSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CheckoutSubscriptionSubscription = { __typename?: 'RootSubscription', checkoutSubscription: { __typename?: 'CheckoutSubscription', notification: { __typename?: 'NotificationNode', pk: number | null, title: string, description: string | null, extraData: string | null, type: NotificationType, created: string, updated: string, source: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, firstName: string, lastName: string } | null } | null } | null };

export type NotificationCreatedSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NotificationCreatedSubscriptionSubscription = { __typename?: 'RootSubscription', notificationCreated: { __typename?: 'NotificationSubscription', notification: { __typename?: 'NotificationNode', pk: number | null, title: string, description: string | null, extraData: string | null, type: NotificationType, created: string, updated: string, source: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, firstName: string, lastName: string } | null } | null } | null };

export type CreateNewOrderWithBulkOrderDetailsMutationVariables = Exact<{
  courseIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type CreateNewOrderWithBulkOrderDetailsMutation = { __typename?: 'RootMutation', createNewOrderWithBulkOrderDetails: { __typename?: 'CreateNewOrderWithBulkOrderDetails', success: boolean | null, errors: any | null, order: { __typename?: 'OrderNode', pk: number | null } | null } | null };

export type ClaimPyramidLedgerBalanceMutationVariables = Exact<{
  input: ClaimPyramidLedgerBalanceInput;
}>;


export type ClaimPyramidLedgerBalanceMutation = { __typename?: 'RootMutation', claimPyramidLedgerBalance: { __typename?: 'ClaimPyramidLedgerBalance', success: boolean | null, errors: any | null, pyramidBalance: { __typename?: 'PyramidBalanceNode', id: string, pk: number | null, balance: number | null, created: string, updated: string } | null } | null };

export type JoinPlatformMutationVariables = Exact<{
  marketingCode: Scalars['String']['input'];
  input: JoinPlatformInput;
}>;


export type JoinPlatformMutation = { __typename?: 'RootMutation', joinPlatform: { __typename?: 'JoinPlatform', success: boolean | null, errors: any | null, clientMutationId: string | null, pyramidAffiliate: { __typename?: 'PyramidAffiliateNode', pk: number | null, id: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string } } | null } | null };

export type JoinPyramidProgramMutationVariables = Exact<{
  input: JoinPyramidProgramInput;
}>;


export type JoinPyramidProgramMutation = { __typename?: 'RootMutation', joinPyramidProgram: { __typename?: 'JoinPyramidProgram', success: boolean | null, errors: any | null, pyramid: { __typename?: 'PyramidNode', pyramidId: string | null, pyramidCode: string | null, created: string, updated: string, user: { __typename?: 'CustomUserNode', pk: number | null } | null, parent: { __typename?: 'PyramidNode', pk: number | null } | null } | null } | null };

export type WithdrawPyramidBalanceMutationVariables = Exact<{
  amount: Scalars['Float']['input'];
  input: MakePyramidWithdrawInput;
}>;


export type WithdrawPyramidBalanceMutation = { __typename?: 'RootMutation', makePyramidWithdraw: { __typename?: 'MakePyramidWithdraw', success: boolean | null, errors: any | null, pyramidWithdraw: { __typename?: 'PyramidWithdrawNode', id: string, pk: number | null, amount: number | null, isDone: boolean, created: string, updated: string, pyramidAccount: { __typename?: 'PyramidNode', pk: number | null } } | null } | null };

export type CheckPyramidAffiliateQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckPyramidAffiliateQuery = { __typename?: 'RootQuery', checkPyramidAffiliate: { __typename?: 'PyramidAffiliateNode', id: string, pk: number | null, created: string, updated: string, pyramidAccount: { __typename?: 'PyramidNode', id: string, pk: number | null }, user: { __typename?: 'CustomUserNode', pk: number | null, id: string } } | null };

export type MyPyramidAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPyramidAccountQuery = { __typename?: 'RootQuery', myPyramidAccount: { __typename?: 'PyramidNode', id: string, pk: number | null, pyramidId: string | null, pyramidCode: string | null, isBlocked: boolean, isAdmin: boolean, isSuperuser: boolean, created: string, updated: string, user: { __typename?: 'CustomUserNode', pk: number | null } | null, parent: { __typename?: 'PyramidNode', pk: number | null } | null } | null };

export type MyPyramidBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPyramidBalanceQuery = { __typename?: 'RootQuery', myPyramidBalance: { __typename?: 'PyramidBalanceNode', id: string, pk: number | null, balance: number | null, created: string, updated: string } | null };

export type MyPyramidLedgerRewardQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPyramidLedgerRewardQuery = { __typename?: 'RootQuery', myPyramidLedgerReward: number | null };

export type MyPyramidMarketersQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPyramidMarketersQuery = { __typename?: 'RootQuery', myPyramidMarketers: number | null };

export type MyPyramidWithdrawsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPyramidWithdrawsQuery = { __typename?: 'RootQuery', myPyramidWithdraws: { __typename?: 'PyramidWithdrawNodeConnection', edges: Array<{ __typename?: 'PyramidWithdrawNodeEdge', node: { __typename?: 'PyramidWithdrawNode', id: string, pk: number | null, amount: number | null, isDone: boolean, created: string, updated: string } | null } | null> } | null };

export type MyPyramidAffiliatesQueryVariables = Exact<{ [key: string]: never; }>;


export type MyPyramidAffiliatesQuery = { __typename?: 'RootQuery', myPyramidAffiliates: number | null };

export type ArchiveCourseQuestionMutationVariables = Exact<{
  questionId: Scalars['Int']['input'];
}>;


export type ArchiveCourseQuestionMutation = { __typename?: 'RootMutation', archiveCourseQuestion: { __typename?: 'ArchiveCourseQuestion', success: boolean | null, errors: any | null, question: { __typename?: 'QuestionNode', pk: number | null, question: string, archived: boolean } | null } | null };

export type ArchiveQuestionReplyMutationVariables = Exact<{
  questionReplyId: Scalars['Int']['input'];
}>;


export type ArchiveQuestionReplyMutation = { __typename?: 'RootMutation', archiveQuestionReply: { __typename?: 'ArchiveQuestionReply', success: boolean | null, errors: any | null, questionReply: { __typename?: 'QuestionReplyNode', pk: number | null, answer: string, archived: boolean } | null } | null };

export type CreateCourseQuestionMutationVariables = Exact<{
  courseId: Scalars['Int']['input'];
  question: Scalars['String']['input'];
}>;


export type CreateCourseQuestionMutation = { __typename?: 'RootMutation', createCourseQuestion: { __typename?: 'CreateCourseQuestion', success: boolean | null, errors: any | null, question: { __typename?: 'QuestionNode', pk: number | null, question: string } | null } | null };

export type CreateQuestionReplyMutationVariables = Exact<{
  questionId: Scalars['Int']['input'];
  answer: Scalars['String']['input'];
}>;


export type CreateQuestionReplyMutation = { __typename?: 'RootMutation', createQuestionReply: { __typename?: 'CreateQuestionReply', success: boolean | null, errors: any | null, questionReply: { __typename?: 'QuestionReplyNode', pk: number | null, answer: string } | null } | null };

export type AllQuestionRepliesForQuestionQueryVariables = Exact<{
  questionId: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllQuestionRepliesForQuestionQuery = { __typename?: 'RootQuery', allQuestionRepliesForQuestion: { __typename?: 'QuestionReplyNodeConnection', totalCount: number | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'QuestionReplyNodeEdge', node: { __typename?: 'QuestionReplyNode', id: string, pk: number | null, answer: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, email: string } } | null } | null> } | null };

export type AllQuestionsByCourseQueryVariables = Exact<{
  courseId: Scalars['Int']['input'];
  orderBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>> | InputMaybe<Scalars['String']['input']>>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AllQuestionsByCourseQuery = { __typename?: 'RootQuery', allQuestionsByCourse: { __typename?: 'QuestionNodeConnection', totalCount: number | null, pageInfo: { __typename?: 'PageInfo', startCursor: string | null, endCursor: string | null, hasNextPage: boolean, hasPreviousPage: boolean }, edges: Array<{ __typename?: 'QuestionNodeEdge', node: { __typename?: 'QuestionNode', id: string, pk: number | null, question: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, email: string }, questionreplySet: { __typename?: 'QuestionReplyNodeConnection', totalCount: number | null, edges: Array<{ __typename?: 'QuestionReplyNodeEdge', node: { __typename?: 'QuestionReplyNode', id: string, pk: number | null, answer: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, email: string } } | null } | null> } } | null } | null> } | null };

export type QuestionAndAnswerSubscriptionVariables = Exact<{
  courseId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type QuestionAndAnswerSubscription = { __typename?: 'RootSubscription', questionAnswerSubscription: { __typename?: 'QuestionAnswerSubscription', notification: { __typename?: 'NotificationNode', id: string, pk: number | null, title: string, description: string | null, extraData: string | null, type: NotificationType, created: string, updated: string, source: { __typename?: 'CustomUserNode', id: string, pk: number | null, email: string, firstName: string, lastName: string } | null } | null, question: { __typename?: 'QuestionNode', pk: number | null, question: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, email: string }, questionreplySet: { __typename?: 'QuestionReplyNodeConnection', totalCount: number | null, edges: Array<{ __typename?: 'QuestionReplyNodeEdge', node: { __typename?: 'QuestionReplyNode', id: string, pk: number | null, answer: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, email: string } } | null } | null> } } | null, answer: { __typename?: 'QuestionReplyNode', pk: number | null, answer: string, user: { __typename?: 'CustomUserNode', id: string, pk: number | null, firstName: string, lastName: string, email: string } } | null } | null };

export const CourseFragmentsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseFragments"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CourseNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"brief"}}]}}]} as unknown as DocumentNode<CourseFragmentsFragment, unknown>;
export const ArchiveUserAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveUserAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<ArchiveUserAccountMutation, ArchiveUserAccountMutationVariables>;
export const ChangeUserPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordChange"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"oldPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"oldPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword1"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword1"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const SocialAuthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SocialAuth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"socialAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}},{"kind":"Argument","name":{"kind":"Name","value":"accessToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accessToken"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"social"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"certificateName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber3"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"isAttachmentTransactionManager"}},{"kind":"Field","name":{"kind":"Name","value":"isPyramidAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isPyramidMarketer"}},{"kind":"Field","name":{"kind":"Name","value":"userCurrency"}},{"kind":"Field","name":{"kind":"Name","value":"isInstructor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"provider"}},{"kind":"Field","name":{"kind":"Name","value":"uid"}},{"kind":"Field","name":{"kind":"Name","value":"extraData"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"modified"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<SocialAuthMutation, SocialAuthMutationVariables>;
export const DeleteUserAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<DeleteUserAccountMutation, DeleteUserAccountMutationVariables>;
export const LoginUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tokenAuth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"certificateName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber3"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"isAttachmentTransactionManager"}},{"kind":"Field","name":{"kind":"Name","value":"isPyramidAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isPyramidMarketer"}},{"kind":"Field","name":{"kind":"Name","value":"isInstructor"}},{"kind":"Field","name":{"kind":"Name","value":"userCurrency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginUserMutation, LoginUserMutationVariables>;
export const RefreshUserTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshUserToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshUserTokenMutation, RefreshUserTokenMutationVariables>;
export const RegisterNewUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterNewUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullName"}}},{"kind":"Argument","name":{"kind":"Name","value":"password1"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password1"}}},{"kind":"Argument","name":{"kind":"Name","value":"password2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RegisterNewUserMutation, RegisterNewUserMutationVariables>;
export const ResendActivationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendActivationEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendActivationEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<ResendActivationEmailMutation, ResendActivationEmailMutationVariables>;
export const UserPasswordResetDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserPasswordReset"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword1"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newPassword2"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"passwordReset"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword1"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword1"}}},{"kind":"Argument","name":{"kind":"Name","value":"newPassword2"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newPassword2"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<UserPasswordResetMutation, UserPasswordResetMutationVariables>;
export const RevokeUserRefreshTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeUserRefreshToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<RevokeUserRefreshTokenMutation, RevokeUserRefreshTokenMutationVariables>;
export const UpdateCertificateNameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCertificateName"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCertificateNameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCertificateName"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<UpdateCertificateNameMutation, UpdateCertificateNameMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"user"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber3"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const UserPasswordResetEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserPasswordResetEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendPasswordResetEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<UserPasswordResetEmailMutation, UserPasswordResetEmailMutationVariables>;
export const VerifyUserAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyUserAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<VerifyUserAccountMutation, VerifyUserAccountMutationVariables>;
export const VerifyUserTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyUserToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"payload"}}]}}]}}]} as unknown as DocumentNode<VerifyUserTokenMutation, VerifyUserTokenMutationVariables>;
export const AllInstructorCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllInstructorCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allInstructorCount"}}]}}]} as unknown as DocumentNode<AllInstructorCountQuery, AllInstructorCountQueryVariables>;
export const GetMyProfileDataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyProfileData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"certificateName"}},{"kind":"Field","name":{"kind":"Name","value":"certificateNameConfirm"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"gender"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber3"}},{"kind":"Field","name":{"kind":"Name","value":"isAttachmentTransactionManager"}},{"kind":"Field","name":{"kind":"Name","value":"isPyramidAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isPyramidMarketer"}},{"kind":"Field","name":{"kind":"Name","value":"userCurrency"}}]}}]}}]} as unknown as DocumentNode<GetMyProfileDataQuery, GetMyProfileDataQueryVariables>;
export const TotalUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TotalUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalUsers"}}]}}]} as unknown as DocumentNode<TotalUsersQuery, TotalUsersQueryVariables>;
export const ReUploadAttachmentTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReUploadAttachmentTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReUploadAttachmentTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reUploadAttachmentTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"attachmentTransaction"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"marketer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marketerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"retryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManagerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidRetryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"doneVerification"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<ReUploadAttachmentTransactionMutation, ReUploadAttachmentTransactionMutationVariables>;
export const UploadAttachmentTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadAttachmentTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadAttachmentTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadAttachmentTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"attachmentTransaction"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"marketer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marketerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"retryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManagerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidRetryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"doneVerification"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<UploadAttachmentTransactionMutation, UploadAttachmentTransactionMutationVariables>;
export const MarketerAttachmentTransactionConfirmationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarketerAttachmentTransactionConfirmation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarketerAttachmentTransactionConfirmationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"marketerAttachmentTransactionConfirmation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<MarketerAttachmentTransactionConfirmationMutation, MarketerAttachmentTransactionConfirmationMutationVariables>;
export const AllMarketerAttachmentTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllMarketerAttachmentTransaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allMarketerAttachmentTransaction"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"orderTotal"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber2"}},{"kind":"Field","name":{"kind":"Name","value":"phoneNumber3"}}]}},{"kind":"Field","name":{"kind":"Name","value":"orderdetailsSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"marketer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marketerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"retryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManagerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidRetryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"doneVerification"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllMarketerAttachmentTransactionQuery, AllMarketerAttachmentTransactionQueryVariables>;
export const MyAttachmentTransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAttachmentTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAttachmentTransactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"orderTotal"}},{"kind":"Field","name":{"kind":"Name","value":"totalAmount"}},{"kind":"Field","name":{"kind":"Name","value":"invoiceNumber"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}}]}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"marketer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"marketerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"retryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pyramidManagerEndorse"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidRetryPlease"}},{"kind":"Field","name":{"kind":"Name","value":"doneVerification"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyAttachmentTransactionsQuery, MyAttachmentTransactionsQueryVariables>;
export const CreateCertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCertificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCertificateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCertificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"enrollmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<CreateCertificateMutation, CreateCertificateMutationVariables>;
export const CreateManualCertificateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateManualCertificate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"course"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userEmail"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateManualCertificateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createManualCertificate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"course"}}},{"kind":"Argument","name":{"kind":"Name","value":"userEmail"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userEmail"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<CreateManualCertificateMutation, CreateManualCertificateMutationVariables>;
export const AllCertificatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCertificates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONString"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCertificates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"enrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"batch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"batchName"}},{"kind":"Field","name":{"kind":"Name","value":"courseName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"serial"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"issueDate"}},{"kind":"Field","name":{"kind":"Name","value":"period"}},{"kind":"Field","name":{"kind":"Name","value":"totalHours"}},{"kind":"Field","name":{"kind":"Name","value":"isManual"}},{"kind":"Field","name":{"kind":"Name","value":"isReady"}},{"kind":"Field","name":{"kind":"Name","value":"isPrinted"}},{"kind":"Field","name":{"kind":"Name","value":"isPrintable"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCertificatesQuery, AllCertificatesQueryVariables>;
export const CaptureBraintreeCheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CaptureBraintreeCheckout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"captureBraintreeCheckout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<CaptureBraintreeCheckoutMutation, CaptureBraintreeCheckoutMutationVariables>;
export const CapturePaypalCheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CapturePaypalCheckout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capturePaypalCheckout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"session"}}]}}]}}]} as unknown as DocumentNode<CapturePaypalCheckoutMutation, CapturePaypalCheckoutMutationVariables>;
export const CreateBraintreeCheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBraintreeCheckout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBraintreeCheckout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"braintreeClientToken"}}]}}]}}]} as unknown as DocumentNode<CreateBraintreeCheckoutMutation, CreateBraintreeCheckoutMutationVariables>;
export const CreateSmartNodeCheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSmartNodeCheckout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"card"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ipin"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSmartNodeCheckout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"card"},"value":{"kind":"Variable","name":{"kind":"Name","value":"card"}}},{"kind":"Argument","name":{"kind":"Name","value":"ipin"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ipin"}}},{"kind":"Argument","name":{"kind":"Name","value":"expDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}}]}}]}}]} as unknown as DocumentNode<CreateSmartNodeCheckoutMutation, CreateSmartNodeCheckoutMutationVariables>;
export const CreateStripeCheckoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStripeCheckout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"currency"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"successUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cancelUrl"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStripeCheckout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderId"}}},{"kind":"Argument","name":{"kind":"Name","value":"successUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"successUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"cancelUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cancelUrl"}}},{"kind":"Argument","name":{"kind":"Name","value":"currency"},"value":{"kind":"Variable","name":{"kind":"Name","value":"currency"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"paymentUrl"}}]}}]}}]} as unknown as DocumentNode<CreateStripeCheckoutMutation, CreateStripeCheckoutMutationVariables>;
export const PaypalPublishableKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PaypalPublishableKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paypalPublishableKey"}}]}}]} as unknown as DocumentNode<PaypalPublishableKeyQuery, PaypalPublishableKeyQueryVariables>;
export const StripePublishableKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StripePublishableKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stripePublishableKey"}}]}}]} as unknown as DocumentNode<StripePublishableKeyQuery, StripePublishableKeyQueryVariables>;
export const CreateCourseQuizSolutionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourseQuizSolution"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCourseQuizSolutionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourseQuizSolution"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"courseQuizSolution"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userAnswer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"isCorrect"}},{"kind":"Field","name":{"kind":"Name","value":"why"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateCourseQuizSolutionMutation, CreateCourseQuizSolutionMutationVariables>;
export const EndLearningUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EndLearningUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progressData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progressId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endLearningUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"progressData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progressData"}}},{"kind":"Argument","name":{"kind":"Name","value":"progressId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progressId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"learning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"begin"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}}]}}]}}]}}]} as unknown as DocumentNode<EndLearningUnitMutation, EndLearningUnitMutationVariables>;
export const StartLearningUnitDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"StartLearningUnit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"progressData"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProgressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startLearningUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"progressData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"progressData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"learning"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"begin"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}}]}}]}}]}}]} as unknown as DocumentNode<StartLearningUnitMutation, StartLearningUnitMutationVariables>;
export const AllContentQuizQuestionByContentQuizIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllContentQuizQuestionByContentQuizId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentQuizId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filters"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONString"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allContentQuizQuestionByContentQuiz"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"contentQuizId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentQuizId"}}},{"kind":"Argument","name":{"kind":"Name","value":"filters"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filters"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"contentquizquestionanswerSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"isCorrect"}},{"kind":"Field","name":{"kind":"Name","value":"why"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"coursequizsolutionSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"userAnswer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"isCorrect"}},{"kind":"Field","name":{"kind":"Name","value":"why"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllContentQuizQuestionByContentQuizIdQuery, AllContentQuizQuestionByContentQuizIdQueryVariables>;
export const GetAllLearningProgressByCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllLearningProgressByCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"learningProgressByCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"enrollmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"enrollmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"courseUnitContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"begin"}},{"kind":"Field","name":{"kind":"Name","value":"complete"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllLearningProgressByCourseQuery, GetAllLearningProgressByCourseQueryVariables>;
export const GetAllCourseInstructorsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCourseInstructors"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCourseInstructors"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"instructor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"qualification"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCourseInstructorsQuery, GetAllCourseInstructorsQueryVariables>;
export const AllCourseUnitContentsByCourseContentFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCourseUnitContentsByCourseContentFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCourseUnitContentsByCourseContentFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"modelValue"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCourseUnitContentsByCourseContentFileQuery, AllCourseUnitContentsByCourseContentFileQueryVariables>;
export const GetAllCourseUnitsByCourseIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCourseUnitsByCourseID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCourseUnits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isExternal"}},{"kind":"Field","name":{"kind":"Name","value":"external"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isMandatory"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"modelValue"}},{"kind":"Field","name":{"kind":"Name","value":"courseUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isMandatory"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"modelValue"}},{"kind":"Field","name":{"kind":"Name","value":"courseUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCourseUnitsByCourseIdQuery, GetAllCourseUnitsByCourseIdQueryVariables>;
export const GetAllCoursesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCourses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"execludeIds"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title_Istartswith"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title_Icontains"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseSpeciality"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPaid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDraft"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCourses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"execludeIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"execludeIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"title_Icontains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title_Icontains"}}},{"kind":"Argument","name":{"kind":"Name","value":"title_Istartswith"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title_Istartswith"}}},{"kind":"Argument","name":{"kind":"Name","value":"courseSpeciality"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseSpeciality"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPaid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPaid"}}},{"kind":"Argument","name":{"kind":"Name","value":"isDraft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDraft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isPaid"}},{"kind":"Field","name":{"kind":"Name","value":"enrolled"}},{"kind":"Field","name":{"kind":"Name","value":"courseFee"}},{"kind":"Field","name":{"kind":"Name","value":"courseFeeInSdg"}},{"kind":"Field","name":{"kind":"Name","value":"profile"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"courseSpeciality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseinstructorSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isMainInstructor"}},{"kind":"Field","name":{"kind":"Name","value":"instructor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllCoursesQuery, GetAllCoursesQueryVariables>;
export const AllCoursesHoursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCoursesHours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCoursesHours"}}]}}]} as unknown as DocumentNode<AllCoursesHoursQuery, AllCoursesHoursQueryVariables>;
export const AllCoursesInSpecialityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllCoursesInSpeciality"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"specialityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"execludeIds"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title_Istartswith"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title_Icontains"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPaid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isDraft"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCoursesInSpeciality"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"specialityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"specialityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"execludeIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"execludeIds"}}},{"kind":"Argument","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"title_Icontains"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title_Icontains"}}},{"kind":"Argument","name":{"kind":"Name","value":"title_Istartswith"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title_Istartswith"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPaid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPaid"}}},{"kind":"Argument","name":{"kind":"Name","value":"isDraft"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isDraft"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isPaid"}},{"kind":"Field","name":{"kind":"Name","value":"courseFee"}},{"kind":"Field","name":{"kind":"Name","value":"courseFeeInSdg"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"profile"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"enrolled"}},{"kind":"Field","name":{"kind":"Name","value":"isDraft"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllCoursesInSpecialityQuery, AllCoursesInSpecialityQueryVariables>;
export const GetAllCoursesCountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllCoursesCount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCoursesCount"}}]}}]} as unknown as DocumentNode<GetAllCoursesCountQuery, GetAllCoursesCountQueryVariables>;
export const GetAllPreRequisitesByCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllPreRequisitesByCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPrerequisiteByCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"prerequisite"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllPreRequisitesByCourseQuery, GetAllPreRequisitesByCourseQueryVariables>;
export const GetAllSpecialitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllSpecialities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCourseSpecialities"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"speciality"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllSpecialitiesQuery, GetAllSpecialitiesQueryVariables>;
export const GetAllWhatYouWillLearnByCourseIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllWhatYouWillLearnByCourseID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allWhatYouWillLearn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"course"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseID"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"points"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllWhatYouWillLearnByCourseIdQuery, GetAllWhatYouWillLearnByCourseIdQueryVariables>;
export const GetCourseByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseByID"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coursePk"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coursePk"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"courseHours"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profile"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"courseFee"}},{"kind":"Field","name":{"kind":"Name","value":"courseFeeInSdg"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"brief"}},{"kind":"Field","name":{"kind":"Name","value":"isPaid"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"telegramLink"}},{"kind":"Field","name":{"kind":"Name","value":"hasCertificate"}},{"kind":"Field","name":{"kind":"Name","value":"courseinstructorSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"instructor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"qualification"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseunitSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isMandatory"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"modelValue"}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrolled"}},{"kind":"Field","name":{"kind":"Name","value":"courseSpeciality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"speciality"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseLanguage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"languageName"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetCourseByIdQuery, GetCourseByIdQueryVariables>;
export const GetCourseByIdSlimDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseByIDSlim"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"coursePk"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"course"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"coursePk"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"courseHours"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"profile"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"courseFee"}},{"kind":"Field","name":{"kind":"Name","value":"courseFeeInSdg"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"brief"}},{"kind":"Field","name":{"kind":"Name","value":"isPaid"}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentCount"}},{"kind":"Field","name":{"kind":"Name","value":"telegramLink"}},{"kind":"Field","name":{"kind":"Name","value":"hasCertificate"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrolled"}},{"kind":"Field","name":{"kind":"Name","value":"courseSpeciality"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"speciality"}}]}},{"kind":"Field","name":{"kind":"Name","value":"courseLanguage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"languageName"}},{"kind":"Field","name":{"kind":"Name","value":"languageCode"}}]}}]}}]}}]} as unknown as DocumentNode<GetCourseByIdSlimQuery, GetCourseByIdSlimQueryVariables>;
export const GetCourseUnitContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseUnitContent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contentPk"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseUnitContent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contentPk"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"modelValue"}},{"kind":"Field","name":{"kind":"Name","value":"courseUnit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}}]}}]}}]} as unknown as DocumentNode<GetCourseUnitContentQuery, GetCourseUnitContentQueryVariables>;
export const GetCourseUnitContentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCourseUnitContents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unitPk"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"courseUnit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unitPk"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isFree"}},{"kind":"Field","name":{"kind":"Name","value":"isMandatory"}},{"kind":"Field","name":{"kind":"Name","value":"modelName"}},{"kind":"Field","name":{"kind":"Name","value":"modelValue"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetCourseUnitContentsQuery, GetCourseUnitContentsQueryVariables>;
export const AllEnrollmentsForCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllEnrollmentsForCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allEnrollmentsForCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"learningprogressSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllEnrollmentsForCurrentUserQuery, AllEnrollmentsForCurrentUserQueryVariables>;
export const GetEnrollmentByCourseForCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEnrollmentByCourseForCurrentUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentByCourseForCurrentUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"course"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"courseunitcontentSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"learningprogressSet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edgeCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetEnrollmentByCourseForCurrentUserQuery, GetEnrollmentByCourseForCurrentUserQueryVariables>;
export const AllHomePageSlidersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllHomePageSliders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allHomePageSliders"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"-id","block":false}]}},{"kind":"Argument","name":{"kind":"Name","value":"isPublished"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slide"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CourseFragments"}}]}},{"kind":"Field","name":{"kind":"Name","value":"objectId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CourseFragments"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CourseNode"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"brief"}}]}}]} as unknown as DocumentNode<AllHomePageSlidersQuery, AllHomePageSlidersQueryVariables>;
export const DoneReadingNotificationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DoneReadingNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"doneReadingNotification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DoneReadingNotificationMutation, DoneReadingNotificationMutationVariables>;
export const GetAllMyNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllMyNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"extraData"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetAllMyNotificationsQuery, GetAllMyNotificationsQueryVariables>;
export const GetMyNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMyNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"extraData"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"extraData"},"value":{"kind":"Variable","name":{"kind":"Name","value":"extraData"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetMyNotificationsQuery, GetMyNotificationsQueryVariables>;
export const CheckoutSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CheckoutSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkoutSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"extraData"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<CheckoutSubscriptionSubscription, CheckoutSubscriptionSubscriptionVariables>;
export const NotificationCreatedSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NotificationCreatedSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notificationCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"extraData"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<NotificationCreatedSubscriptionSubscription, NotificationCreatedSubscriptionSubscriptionVariables>;
export const CreateNewOrderWithBulkOrderDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNewOrderWithBulkOrderDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseIds"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNewOrderWithBulkOrderDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseIds"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseIds"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"order"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNewOrderWithBulkOrderDetailsMutation, CreateNewOrderWithBulkOrderDetailsMutationVariables>;
export const ClaimPyramidLedgerBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ClaimPyramidLedgerBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClaimPyramidLedgerBalanceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimPyramidLedgerBalance"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"pyramidBalance"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<ClaimPyramidLedgerBalanceMutation, ClaimPyramidLedgerBalanceMutationVariables>;
export const JoinPlatformDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinPlatform"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"marketingCode"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinPlatformInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinPlatform"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"marketingCode"},"value":{"kind":"Variable","name":{"kind":"Name","value":"marketingCode"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"pyramidAffiliate"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<JoinPlatformMutation, JoinPlatformMutationVariables>;
export const JoinPyramidProgramDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinPyramidProgram"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinPyramidProgramInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinPyramidProgram"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"pyramid"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pyramidId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pyramidCode"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<JoinPyramidProgramMutation, JoinPyramidProgramMutationVariables>;
export const WithdrawPyramidBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WithdrawPyramidBalance"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"amount"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MakePyramidWithdrawInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"makePyramidWithdraw"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"amount"},"value":{"kind":"Variable","name":{"kind":"Name","value":"amount"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","alias":{"kind":"Name","value":"pyramidWithdraw"},"name":{"kind":"Name","value":"instance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"isDone"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]} as unknown as DocumentNode<WithdrawPyramidBalanceMutation, WithdrawPyramidBalanceMutationVariables>;
export const CheckPyramidAffiliateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CheckPyramidAffiliate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkPyramidAffiliate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]} as unknown as DocumentNode<CheckPyramidAffiliateQuery, CheckPyramidAffiliateQueryVariables>;
export const MyPyramidAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPyramidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPyramidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"pyramidId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"parent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pyramidCode"}},{"kind":"Field","name":{"kind":"Name","value":"isBlocked"}},{"kind":"Field","name":{"kind":"Name","value":"isAdmin"}},{"kind":"Field","name":{"kind":"Name","value":"isSuperuser"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]} as unknown as DocumentNode<MyPyramidAccountQuery, MyPyramidAccountQueryVariables>;
export const MyPyramidBalanceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPyramidBalance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPyramidBalance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]} as unknown as DocumentNode<MyPyramidBalanceQuery, MyPyramidBalanceQueryVariables>;
export const MyPyramidLedgerRewardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPyramidLedgerReward"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPyramidLedgerReward"}}]}}]} as unknown as DocumentNode<MyPyramidLedgerRewardQuery, MyPyramidLedgerRewardQueryVariables>;
export const MyPyramidMarketersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPyramidMarketers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPyramidMarketers"}}]}}]} as unknown as DocumentNode<MyPyramidMarketersQuery, MyPyramidMarketersQueryVariables>;
export const MyPyramidWithdrawsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPyramidWithdraws"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPyramidWithdraws"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"isDone"}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyPyramidWithdrawsQuery, MyPyramidWithdrawsQueryVariables>;
export const MyPyramidAffiliatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyPyramidAffiliates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myPyramidAffiliates"}}]}}]} as unknown as DocumentNode<MyPyramidAffiliatesQuery, MyPyramidAffiliatesQueryVariables>;
export const ArchiveCourseQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveCourseQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveCourseQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}}]}}]}}]}}]} as unknown as DocumentNode<ArchiveCourseQuestionMutation, ArchiveCourseQuestionMutationVariables>;
export const ArchiveQuestionReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveQuestionReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionReplyId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveQuestionReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionReplyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionReplyId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"questionReply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}}]}}]}}]}}]} as unknown as DocumentNode<ArchiveQuestionReplyMutation, ArchiveQuestionReplyMutationVariables>;
export const CreateCourseQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCourseQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"question"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCourseQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"question"},"value":{"kind":"Variable","name":{"kind":"Name","value":"question"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"question"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCourseQuestionMutation, CreateCourseQuestionMutationVariables>;
export const CreateQuestionReplyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateQuestionReply"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answer"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQuestionReply"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"answer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"errors"}},{"kind":"Field","name":{"kind":"Name","value":"questionReply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}}]}}]}}]}}]} as unknown as DocumentNode<CreateQuestionReplyMutation, CreateQuestionReplyMutationVariables>;
export const AllQuestionRepliesForQuestionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllQuestionRepliesForQuestion"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allQuestionRepliesForQuestion"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"questionId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"questionId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllQuestionRepliesForQuestionQuery, AllQuestionRepliesForQuestionQueryVariables>;
export const AllQuestionsByCourseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AllQuestionsByCourse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"limit"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allQuestionsByCourse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orderBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orderBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"limit"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionreplySet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AllQuestionsByCourseQuery, AllQuestionsByCourseQueryVariables>;
export const QuestionAndAnswerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"QuestionAndAnswer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"questionAnswerSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"courseId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"courseId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notification"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"extraData"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"created"}},{"kind":"Field","name":{"kind":"Name","value":"updated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"question"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"question"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"questionreplySet"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalCount"}},{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"answer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"answer"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pk"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]}}]} as unknown as DocumentNode<QuestionAndAnswerSubscription, QuestionAndAnswerSubscriptionVariables>;