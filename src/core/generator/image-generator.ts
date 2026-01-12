// import html2canvas from 'html2canvas';
// import { saveAs } from 'file-saver';
// import JSZip from 'jszip';
// import React from 'react';
// import { createRoot, Root } from 'react-dom/client';
// import { DialogueItem } from '@/types/dialogue';
// import { CardSize } from '@/types/template';
// import { BubbleChat } from '@/templates/BubbleChat';
// import { splitDialogue } from '../splitter/content-splitter';

// /**
//  * 生成单张图片 - 仅用于直接渲染 BubbleChat 模板
//  * 注意：此函数已被 wysiwyg-generator.ts 中的虚拟容器方案替代
//  * 建议使用 wysiwyg-generator.ts 中的导出函数以保证与预览效果一致
//  */
// export const generateSingleImage = async (
//   element: HTMLElement
// ): Promise<Blob> => {
//   const canvas = await html2canvas(element, {
//     scale: 2, // 提高清晰度
//     useCORS: true,
//     logging: false,
//     allowTaint: true,
//   });

//   return new Promise((resolve, reject) => {
//     canvas.toBlob((blob) => {
//       if (blob) {
//         resolve(blob);
//       } else {
//         reject(new Error('图片生成失败'));
//       }
//     }, 'image/png');
//   });
// };

// /**
//  * 渲染模板到 DOM 元素 - 仅用于直接渲染 BubbleChat 模板
//  * 注意：此函数已被 wysiwyg-generator.ts 中的虚拟容器方案替代
//  */
// const renderTemplateToElement = (
//   element: HTMLElement,
//   title: string,
//   dialogueItems: DialogueItem[],
//   cardSize: CardSize,
//   cardIndex: number,
//   totalCards: number
// ): { root: Root; cleanup: () => void } => {
//   const root = createRoot(element);
  
//   root.render(
//     React.createElement(BubbleChat, {
//       title,
//       dialogueItems,
//       cardSize,
//       cardIndex,
//       totalCards,
//     })
//   );

//   return {
//     root,
//     cleanup: () => {
//       root.unmount();
//     },
//   };
// };

// /**
//  * 生成所有卡片图片 - 仅用于直接渲染 BubbleChat 模板
//  * 注意：此函数已被 wysiwyg-generator.ts 中的虚拟容器方案替代
//  * 建议使用 wysiwyg-generator.ts 中的 generateSplitImages() 函数
//  */
// export const generateAllImages = async (
//   title: string,
//   dialogueItems: DialogueItem[],
//   cardSize: CardSize
// ): Promise<Blob[]> => {
//   // 拆分内容
//   const cards = splitDialogue(dialogueItems, cardSize);

//   if (cards.length === 0) {
//     throw new Error('没有可生成的内容');
//   }

//   const blobs: Blob[] = [];

//   // 创建一个隐藏的容器
//   const container = document.createElement('div');
//   container.style.position = 'absolute';
//   container.style.left = '-9999px';
//   container.style.top = '-9999px';
//   document.body.appendChild(container);

//   try {
//     for (const card of cards) {
//       // 创建临时元素
//       const element = document.createElement('div');
//       container.appendChild(element);

//       // 渲染模板
//       const { cleanup } = renderTemplateToElement(
//         element,
//         title,
//         card.dialogueItems,
//         cardSize,
//         card.cardIndex,
//         card.totalCards
//       );

//       // 等待渲染完成
//       await new Promise((resolve) => setTimeout(resolve, 100));

//       // 生成图片
//       const blob = await generateSingleImage(element);
//       blobs.push(blob);

//       // 清理
//       cleanup();
//       container.removeChild(element);
//     }
//   } finally {
//     // 清理容器
//     document.body.removeChild(container);
//   }

//   return blobs;
// };

// /**
//  * 下载单张图片 - 仅用于直接渲染 BubbleChat 模板
//  * 已弃用：请使用 wysiwyg-generator.ts 中的 downloadSingleImage() 函数
//  * @deprecated 使用 wysiwyg-generator.ts 中的导出函数
//  */
// export const downloadSingleImage = async (
//   title: string,
//   dialogueItems: DialogueItem[],
//   cardSize: CardSize,
//   cardIndex: number = 0
// ): Promise<void> => {
//   const cards = splitDialogue(dialogueItems, cardSize);
  
//   if (cards.length === 0) {
//     throw new Error('没有可生成的内容');
//   }

//   const card = cards[cardIndex] || cards[0];

//   // 创建临时元素
//   const element = document.createElement('div');
//   element.style.position = 'absolute';
//   element.style.left = '-9999px';
//   element.style.top = '-9999px';
//   document.body.appendChild(element);

//   try {
//     // 渲染模板
//     const { cleanup } = renderTemplateToElement(
//       element,
//       title,
//       card.dialogueItems,
//       cardSize,
//       card.cardIndex,
//       card.totalCards
//     );

//     // 等待渲染完成
//     await new Promise((resolve) => setTimeout(resolve, 100));

//     // 生成并下载图片
//     const blob = await generateSingleImage(element);
//     saveAs(blob, `${title}-${cardIndex + 1}.png`);

//     // 清理
//     cleanup();
//   } finally {
//     document.body.removeChild(element);
//   }
// };

// /**
//  * 下载所有图片（ZIP）- 仅用于直接渲染 BubbleChat 模板
//  * 已弃用：请使用 wysiwyg-generator.ts 中的 downloadAllSplitImages() 函数
//  * @deprecated 使用 wysiwyg-generator.ts 中的导出函数
//  */
// export const downloadAllImages = async (
//   title: string,
//   dialogueItems: DialogueItem[],
//   cardSize: CardSize
// ): Promise<void> => {
//   const blobs = await generateAllImages(title, dialogueItems, cardSize);

//   if (blobs.length === 0) {
//     throw new Error('没有可生成的内容');
//   }

//   // 创建 ZIP
//   const zip = new JSZip();

//   blobs.forEach((blob, index) => {
//     zip.file(`${title}-${index + 1}.png`, blob);
//   });

//   // 生成 ZIP 并下载
//   const zipBlob = await zip.generateAsync({ type: 'blob' });
//   saveAs(zipBlob, `${title}.zip`);
// };
