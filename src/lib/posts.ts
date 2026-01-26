/**
 * 블로그 포스트 관련 유틸리티 함수
 * MDX 파일을 읽고 파싱하는 기능을 제공합니다
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, GetPostsOptions } from './types';

// content/posts 디렉토리의 절대 경로
const postsDirectory = path.join(process.cwd(), 'content', 'posts');

/**
 * 모든 블로그 포스트의 메타데이터를 가져옵니다
 * @param options 필터링 및 정렬 옵션
 * @returns 블로그 포스트 메타데이터 배열
 */
export async function getPosts(options: GetPostsOptions = {}): Promise<BlogPost[]> {
  const { lang, category, sort = 'date-desc' } = options;
  
  // 모든 카테고리 디렉토리 읽기
  const categoryDirs = fs.readdirSync(postsDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  const allPosts: BlogPost[] = [];
  
  // 각 카테고리별로 포스트 읽기
  // 실제 구조: content/posts/{category}/{lang}/{slug}.mdx
  for (const cat of categoryDirs) {
    // 카테고리 필터링
    if (category && cat !== category) continue;
    
    const categoryPath = path.join(postsDirectory, cat);
    
    // 언어 필터링
    if (lang) {
      // 특정 언어만 읽기
      const langPath = path.join(categoryPath, lang);
      if (fs.existsSync(langPath) && fs.statSync(langPath).isDirectory()) {
        const mdxFiles = fs.readdirSync(langPath)
          .filter(file => file.endsWith('.mdx'))
          .map(file => file.replace('.mdx', ''));
        
        for (const slug of mdxFiles) {
          const langFile = path.join(langPath, `${slug}.mdx`);
          if (fs.existsSync(langFile)) {
            const fileContents = fs.readFileSync(langFile, 'utf8');
            const { data } = matter(fileContents);
            const stats = fs.statSync(langFile);
            
            allPosts.push({
              slug,
              category: cat,
              title: data.title || '',
              date: data.date || '',
              tags: data.tags || [],
              description: data.description || '',
              ctime: stats.birthtime.getTime(),
            });
          }
        }
      }
    } else {
      // 모든 언어 파일 읽기
      const langDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const fileLang of langDirs) {
        const langPath = path.join(categoryPath, fileLang);
        const mdxFiles = fs.readdirSync(langPath)
          .filter(file => file.endsWith('.mdx'))
          .map(file => file.replace('.mdx', ''));
        
        for (const slug of mdxFiles) {
          const langFile = path.join(langPath, `${slug}.mdx`);
          const fileContents = fs.readFileSync(langFile, 'utf8');
          const { data } = matter(fileContents);
          const stats = fs.statSync(langFile);
          
          allPosts.push({
            slug,
            category: cat,
            title: data.title || '',
            date: data.date || '',
            tags: data.tags || [],
            description: data.description || '',
            ctime: stats.birthtime.getTime(),
          });
        }
      }
    }
  }
  
  // 정렬
  if (sort === 'date-desc') {
    allPosts.sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      // 날짜가 같으면 생성 시간으로 정렬 (최신이 먼저)
      return (b.ctime || 0) - (a.ctime || 0);
    });
  } else if (sort === 'date-asc') {
    allPosts.sort((a, b) => {
      const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      // 날짜가 같으면 생성 시간으로 정렬 (오래된 것이 먼저)
      return (a.ctime || 0) - (b.ctime || 0);
    });
  } else if (sort === 'title-asc') {
    allPosts.sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return allPosts;
}

/**
 * 특정 블로그 포스트의 상세 정보를 가져옵니다
 * @param slug 포스트의 slug
 * @param category 포스트의 카테고리
 * @param lang 포스트의 언어
 * @returns 블로그 포스트 상세 정보 (컨텐츠 포함)
 */
export async function getPost(
  slug: string,
  category: string,
  lang: string
): Promise<BlogPost | null> {
  try {
    // 실제 구조: content/posts/{category}/{lang}/{slug}.mdx
    const filePath = path.join(postsDirectory, category, lang, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // RSC 버전의 MDXRemote는 serialize된 객체가 아닌 원본 content를 사용
    // serialize는 클라이언트 컴포넌트용이므로, RSC에서는 content 문자열을 그대로 반환
    return {
      slug,
      category,
      title: data.title || '',
      date: data.date || '',
      tags: data.tags || [],
      description: data.description || '',
      content: content, // 원본 MDX 문자열 반환
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * 모든 카테고리 목록을 가져옵니다
 * @returns 카테고리 이름 배열
 */
export function getCategories(): string[] {
  try {
    return fs.readdirSync(postsDirectory, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

/**
 * 특정 카테고리의 모든 slug 목록을 가져옵니다
 * @param category 카테고리 이름
 * @returns slug 배열
 */
export function getSlugsByCategory(category: string): string[] {
  try {
    const categoryPath = path.join(postsDirectory, category);
    return fs.readdirSync(categoryPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error(`Error reading slugs for category ${category}:`, error);
    return [];
  }
}
