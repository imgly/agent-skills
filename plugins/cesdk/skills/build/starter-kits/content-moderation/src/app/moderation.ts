/**
 * Content Moderation API
 */

import type { CreativeEngine } from '@cesdk/cesdk-js';

import { getImageUrl, percentageToState } from './utils';
import type {
  ImageBlockData,
  ModerationCheckResult,
  ModerationResult
} from './types';

const MODERATION_API_URL =
  'https://europe-west3-img-ly.cloudfunctions.net/sightengineApiProxy';

/**
 * Reads one confidence score, so a response that is missing one fails the check
 * instead of mapping to NaN and reporting the design as clean.
 */
function readScore(source: unknown, key: string): number {
  const score = (source as Record<string, unknown> | null)?.[key];
  if (typeof score !== 'number' || !Number.isFinite(score)) {
    throw new Error(
      `The moderation service returned no "${key}" score. A design cannot be reported as clean without one.`
    );
  }
  return score;
}

/**
 * Calls the content moderation API for an image URL.
 * Note: This uses a demo proxy endpoint. Replace with your own moderation service.
 */
export async function checkImageContentAPI(
  url: string
): Promise<ModerationCheckResult[]> {
  const response = await fetch(
    `${MODERATION_API_URL}?url=${encodeURIComponent(url)}`,
    {
      method: 'get',
      headers: {
        accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'multipart/form-data;'
      }
    }
  );
  const results = await response.json();

  return [
    {
      name: 'Weapons',
      description: 'Handguns, rifles, machine guns, threatening knives...',
      state: percentageToState(readScore(results, 'weapon'))
    },
    {
      name: 'Alcohol',
      description: 'Wine, beer, cocktails, champagne...',
      state: percentageToState(readScore(results, 'alcohol'))
    },
    {
      name: 'Drugs',
      description: 'Cannabis, syringes, glass pipes, bongs, pills...',
      state: percentageToState(readScore(results, 'drugs'))
    },
    {
      name: 'Nudity',
      description: 'Images that contain either raw nudity or partial nudity.',
      state: percentageToState(1 - readScore(results.nudity, 'safe'))
    }
  ];
}

/**
 * Checks all images in the scene for inappropriate content.
 */
export async function checkImageContent(
  engine: CreativeEngine
): Promise<ModerationResult[]> {
  const imageBlocksData: ImageBlockData[] = engine.block
    .findByKind('image')
    .map((blockId) => ({
      blockId,
      url: getImageUrl(engine, blockId) ?? '',
      blockType: engine.block.getType(blockId),
      blockName: engine.block.getName(blockId)
    }))
    .filter(({ url }) => url);

  const imagesWithValidity = await Promise.all(
    imageBlocksData.flatMap(async (imageBlockData) => {
      const imageContentCategories = await checkImageContentAPI(
        imageBlockData.url
      );

      return imageContentCategories.flatMap((checkResult) => ({
        ...checkResult,
        ...imageBlockData
      }));
    })
  );
  return imagesWithValidity.flat();
}
