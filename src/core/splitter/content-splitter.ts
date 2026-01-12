import { DialogueItem } from '@/types/dialogue';
import { CardSize, CardContent } from '@/types/splitter';
import { MAX_DIALOGUE_ROUNDS } from '@/utils/constants';

/**
 * 将对话内容拆分为多张卡片
 */
export const splitDialogue = (
  dialogueItems: DialogueItem[],
  cardSize: CardSize
): CardContent[] => {
  if (dialogueItems.length === 0) {
    return [];
  }

  const maxRounds = MAX_DIALOGUE_ROUNDS[cardSize];
  const cards: CardContent[] = [];
  
  // 按轮次分组（一对 user + assistant 为一轮）
  const rounds: DialogueItem[][] = [];
  let currentRound: DialogueItem[] = [];
  
  for (const item of dialogueItems) {
    if (item.role === 'user' && currentRound.length > 0) {
      // 开始新的一轮
      rounds.push([...currentRound]);
      currentRound = [item];
    } else {
      currentRound.push(item);
    }
  }
  
  // 添加最后一轮
  if (currentRound.length > 0) {
    rounds.push(currentRound);
  }

  // 将轮次分配到卡片
  let currentCard: DialogueItem[] = [];
  let cardIndex = 0;

  for (const round of rounds) {
    // 如果当前卡片加上这一轮会超过限制，创建新卡片
    if (currentCard.length + round.length > maxRounds * 2 && currentCard.length > 0) {
      cards.push({
        dialogueItems: [...currentCard],
        cardIndex: cardIndex++,
        totalCards: 0, // 稍后更新
      });
      currentCard = [];
    }

    currentCard.push(...round);
  }

  // 添加最后一张卡片
  if (currentCard.length > 0) {
    cards.push({
      dialogueItems: currentCard,
      cardIndex: cardIndex++,
      totalCards: 0,
    });
  }

  // 更新 totalCards
  const totalCards = cards.length;
  return cards.map((card) => ({
    ...card,
    totalCards,
  }));
};
