/**
 * 블로그 포스트의 메타데이터 타입 정의
 * MDX 파일의 frontmatter와 매칭됩니다
 */
export interface BlogPost {
  /** 포스트의 고유 식별자 (slug) */
  slug: string;
  /** 포스트 제목 */
  title: string;
  /** 포스트 작성일 (YYYY-MM-DD 형식) */
  date: string;
  /** 포스트 카테고리 */
  category: string;
  /** 포스트 태그 배열 */
  tags: string[];
  /** 포스트 설명 (SEO용) */
  description: string;
  /** 포스트 내용 (MDX 원본 문자열 또는 컴파일된 결과) */
  content?: string | any;
  /** 파일 생성 시간 (밀리초 타임스탬프) */
  ctime?: number;
}

/**
 * 블로그 포스트 목록을 가져올 때 사용하는 옵션
 */
export interface GetPostsOptions {
  /** 특정 언어로 필터링 */
  lang?: string;
  /** 특정 카테고리로 필터링 */
  category?: string;
  /** 정렬 방식 (기본값: date-desc) */
  sort?: 'date-desc' | 'date-asc' | 'title-asc';
}
