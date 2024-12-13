import { load } from "cheerio";
import { Document } from "../../../controllers/v1/types";
import { Meta } from "..";

export function extractMetadata(
  meta: Meta,
  html: string,
): Document["metadata"] {
  let title: string | undefined = undefined;
  let description: string | undefined = undefined;
  let language: string | undefined = undefined;
  let keywords: string | undefined = undefined;
  let robots: string | undefined = undefined;
  let ogTitle: string | undefined = undefined;
  let ogDescription: string | undefined = undefined;
  let ogUrl: string | undefined = undefined;
  let ogImage: string | undefined = undefined;
  let ogAudio: string | undefined = undefined;
  let ogDeterminer: string | undefined = undefined;
  let ogLocale: string | undefined = undefined;
  let ogLocaleAlternate: string[] | undefined = undefined;
  let ogSiteName: string | undefined = undefined;
  let ogVideo: string | undefined = undefined;
  let dcTermsCreated: string | undefined = undefined;
  let dcDateCreated: string | undefined = undefined;
  let dcDate: string | undefined = undefined;
  let dcTermsType: string | undefined = undefined;
  let dcType: string | undefined = undefined;
  let dcTermsAudience: string | undefined = undefined;
  let dcTermsSubject: string | undefined = undefined;
  let dcSubject: string | undefined = undefined;
  let dcDescription: string | undefined = undefined;
  let dcTermsKeywords: string | undefined = undefined;
  let modifiedTime: string | undefined = undefined;
  let publishedTime: string | undefined = undefined;
  let articleTag: string | undefined = undefined;
  let articleSection: string | undefined = undefined;
  const customMetadata: Record<string, string | string[]> = {};

  const soup = load(html);

  try {
    title = soup("title").text() || undefined;
    description = soup('meta[name="description"]').attr("content") || undefined;

    // Assuming the language is part of the URL as per the regex pattern
    language = soup("html").attr("lang") || undefined;

    keywords = soup('meta[name="keywords"]').attr("content") || undefined;
    robots = soup('meta[name="robots"]').attr("content") || undefined;
    ogTitle = soup('meta[property="og:title"]').attr("content") || undefined;
    ogDescription =
      soup('meta[property="og:description"]').attr("content") || undefined;
    ogUrl = soup('meta[property="og:url"]').attr("content") || undefined;
    ogImage = soup('meta[property="og:image"]').attr("content") || undefined;
    ogAudio = soup('meta[property="og:audio"]').attr("content") || undefined;
    ogDeterminer =
      soup('meta[property="og:determiner"]').attr("content") || undefined;
    ogLocale = soup('meta[property="og:locale"]').attr("content") || undefined;
    ogLocaleAlternate =
      soup('meta[property="og:locale:alternate"]')
        .map((i, el) => soup(el).attr("content"))
        .get() || undefined;
    ogSiteName =
      soup('meta[property="og:site_name"]').attr("content") || undefined;
    ogVideo = soup('meta[property="og:video"]').attr("content") || undefined;
    articleSection =
      soup('meta[name="article:section"]').attr("content") || undefined;
    articleTag = soup('meta[name="article:tag"]').attr("content") || undefined;
    publishedTime =
      soup('meta[property="article:published_time"]').attr("content") ||
      undefined;
    modifiedTime =
      soup('meta[property="article:modified_time"]').attr("content") ||
      undefined;
    dcTermsKeywords =
      soup('meta[name="dcterms.keywords"]').attr("content") || undefined;
    dcDescription =
      soup('meta[name="dc.description"]').attr("content") || undefined;
    dcSubject = soup('meta[name="dc.subject"]').attr("content") || undefined;
    dcTermsSubject =
      soup('meta[name="dcterms.subject"]').attr("content") || undefined;
    dcTermsAudience =
      soup('meta[name="dcterms.audience"]').attr("content") || undefined;
    dcType = soup('meta[name="dc.type"]').attr("content") || undefined;
    dcTermsType =
      soup('meta[name="dcterms.type"]').attr("content") || undefined;
    dcDate = soup('meta[name="dc.date"]').attr("content") || undefined;
    dcDateCreated =
      soup('meta[name="dc.date.created"]').attr("content") || undefined;
    dcTermsCreated =
      soup('meta[name="dcterms.created"]').attr("content") || undefined;

    try {
      // Extract all meta tags for custom metadata
      soup("meta").each((i, elem) => {
        try {
          const name = soup(elem).attr("name") || soup(elem).attr("property");
          const content = soup(elem).attr("content");

          if (name && content) {
            if (customMetadata[name] === undefined) {
              customMetadata[name] = content;
            } else if (Array.isArray(customMetadata[name])) {
              (customMetadata[name] as string[]).push(content);
            } else {
              customMetadata[name] = [customMetadata[name] as string, content];
            }
          }
        } catch (error) {
          meta.logger.error(`Error extracting custom metadata (in)`, { error });
        }
      });
    } catch (error) {
      meta.logger.error(`Error extracting custom metadata`, { error });
    }
  } catch (error) {
    meta.logger.error(`Error extracting metadata`, { error });
  }

  return {
    title,
    description,
    language,
    keywords,
    robots,
    ogTitle,
    ogDescription,
    ogUrl,
    ogImage,
    ogAudio,
    ogDeterminer,
    ogLocale,
    ogLocaleAlternate,
    ogSiteName,
    ogVideo,
    dcTermsCreated,
    dcDateCreated,
    dcDate,
    dcTermsType,
    dcType,
    dcTermsAudience,
    dcTermsSubject,
    dcSubject,
    dcDescription,
    dcTermsKeywords,
    modifiedTime,
    publishedTime,
    articleTag,
    articleSection,
    ...customMetadata,
  };
}